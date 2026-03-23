from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
from decimal import Decimal

from .models import (
    Account, JournalEntry, JournalEntryLine, Vendor, Bill, BillItem, BillPayment,
    VendorCredit, Customer, Invoice, InvoiceItem, InvoicePayment, CustomerCredit,
    Quotation, QuotationItem, RecurringInvoice, Expense, ExpensePolicy,
    BankAccount, BankTransaction, TaxRate, Budget, BudgetLine
)
from .serializers import (
    AccountSerializer, JournalEntrySerializer, JournalEntryLineSerializer,
    VendorSerializer, BillSerializer, BillPaymentSerializer, VendorCreditSerializer,
    CustomerSerializer, InvoiceSerializer, InvoiceListSerializer, InvoicePaymentSerializer,
    CustomerCreditSerializer, QuotationSerializer, QuotationItemSerializer,
    RecurringInvoiceSerializer, ExpenseSerializer, ExpensePolicySerializer,
    BankAccountSerializer, BankTransactionSerializer, TaxRateSerializer,
    BudgetSerializer, BudgetLineSerializer
)


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'name', 'description']
    ordering_fields = ['code', 'name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Account.objects.filter(organization=org)
            
            account_type = self.request.query_params.get('account_type')
            if account_type:
                queryset = queryset.filter(account_type=account_type)
            
            is_active = self.request.query_params.get('is_active')
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
            return queryset
        return Account.objects.none()

    @action(detail=False, methods=['get'])
    def balance_sheet(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        accounts = Account.objects.filter(organization=org, is_active=True)
        
        assets = []
        liabilities = []
        equity = []
        total_assets = Decimal('0')
        total_liabilities = Decimal('0')
        total_equity = Decimal('0')
        
        for account in accounts:
            balance = account.balance
            acc_data = {
                'code': account.code,
                'name': account.name,
                'balance': balance
            }
            
            if account.account_type == 'asset':
                assets.append(acc_data)
                total_assets += balance
            elif account.account_type == 'liability':
                liabilities.append(acc_data)
                total_liabilities += balance
            elif account.account_type == 'equity':
                equity.append(acc_data)
                total_equity += balance
        
        return Response({
            'assets': assets,
            'liabilities': liabilities,
            'equity': equity,
            'total_assets': total_assets,
            'total_liabilities': total_liabilities,
            'total_equity': total_equity,
        })


class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['entry_number', 'description', 'reference']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = JournalEntry.objects.filter(organization=org).prefetch_related('lines')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            start_date = self.request.query_params.get('start_date')
            if start_date:
                queryset = queryset.filter(date__gte=start_date)
            
            end_date = self.request.query_params.get('end_date')
            if end_date:
                queryset = queryset.filter(date__lte=end_date)
            
            return queryset
        return JournalEntry.objects.none()

    @action(detail=False, methods=['get'])
    def trial_balance(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        date_from = request.query_params.get('date_from', timezone.now().date())
        date_to = request.query_params.get('date_to', timezone.now().date())
        
        accounts = Account.objects.filter(organization=org, is_active=True)
        trial_balance = []
        total_debits = Decimal('0')
        total_credits = Decimal('0')
        
        for account in accounts:
            debits = account.debit_entries.filter(
                journal_entry__date__lte=date_to,
                journal_entry__status='posted'
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
            
            credits = account.credit_entries.filter(
                journal_entry__date__lte=date_to,
                journal_entry__status='posted'
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
            
            if account.balance_type == 'debit':
                balance = debits - credits
                debit = balance if balance > 0 else Decimal('0')
                credit = -balance if balance < 0 else Decimal('0')
            else:
                balance = credits - debits
                credit = balance if balance > 0 else Decimal('0')
                debit = -balance if balance < 0 else Decimal('0')
            
            if debit > 0 or credit > 0:
                trial_balance.append({
                    'account_code': account.code,
                    'account_name': account.name,
                    'account_type': account.account_type,
                    'debit': debit,
                    'credit': credit
                })
                total_debits += debit
                total_credits += credit
        
        return Response({
            'accounts': trial_balance,
            'total_debits': total_debits,
            'total_credits': total_credits,
            'is_balanced': total_debits == total_credits
        })

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        entry = self.get_object()
        if entry.status != 'draft':
            return Response({'error': 'Entry is already posted'}, status=status.HTTP_400_BAD_REQUEST)
        
        entry.status = 'posted'
        entry.posted_by = request.user
        entry.posted_at = timezone.now()
        entry.save()
        return Response(JournalEntrySerializer(entry).data)

    @action(detail=True, methods=['post'])
    def reverse(self, request, pk=None):
        entry = self.get_object()
        if entry.status != 'posted':
            return Response({'error': 'Entry is not posted'}, status=status.HTTP_400_BAD_REQUEST)
        
        entry.status = 'reversed'
        entry.save()
        
        reverse_entry = JournalEntry.objects.create(
            date=timezone.now().date(),
            description=f"Reversal of {entry.entry_number}",
            reference=f"Reversed: {entry.entry_number}",
            source_document=entry.source_document,
            source_id=entry.source_id,
            status='posted',
            posted_by=request.user,
            posted_at=timezone.now(),
            organization=entry.organization
        )
        
        for line in entry.lines.all():
            JournalEntryLine.objects.create(
                journal_entry=reverse_entry,
                account=line.account,
                description=f"Reversal: {line.description}",
                debit=line.credit,
                credit=line.debit
            )
        
        return Response(JournalEntrySerializer(reverse_entry).data)


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'email', 'city']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Vendor.objects.filter(organization=org)
            
            is_active = self.request.query_params.get('is_active')
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
            return queryset
        return Vendor.objects.none()


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['bill_number', 'vendor__name', 'invoice_number']
    ordering_fields = ['bill_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Bill.objects.filter(organization=org).prefetch_related('items')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            vendor = self.request.query_params.get('vendor')
            if vendor:
                queryset = queryset.filter(vendor_id=vendor)
            
            start_date = self.request.query_params.get('start_date')
            if start_date:
                queryset = queryset.filter(bill_date__gte=start_date)
            
            end_date = self.request.query_params.get('end_date')
            if end_date:
                queryset = queryset.filter(bill_date__lte=end_date)
            
            return queryset
        return Bill.objects.none()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'approved'
        bill.save()
        return Response(BillSerializer(bill).data)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        bill = self.get_object()
        amount = Decimal(request.data.get('amount', bill.balance_due))
        
        payment = BillPayment.objects.create(
            bill=bill,
            payment_date=request.data.get('payment_date', timezone.now().date()),
            amount=amount,
            payment_method=request.data.get('payment_method', 'bank_transfer'),
            reference=request.data.get('reference', ''),
            notes=request.data.get('notes', ''),
            created_by=request.user,
            organization=bill.organization
        )
        
        bill.amount_paid += amount
        if bill.amount_paid >= bill.total:
            bill.status = 'paid'
        else:
            bill.status = 'partially_paid'
        bill.save()
        
        return Response(BillSerializer(bill).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        bill = self.get_object()
        if bill.amount_paid > 0:
            return Response({'error': 'Cannot cancel a bill with payments'}, status=status.HTTP_400_BAD_REQUEST)
        bill.status = 'cancelled'
        bill.save()
        return Response(BillSerializer(bill).data)

    @action(detail=False, methods=['get'])
    def aging(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        today = timezone.now().date()
        bills = Bill.objects.filter(
            organization=org,
            status__in=['received', 'approved', 'partially_paid']
        ).select_related('vendor')
        
        aging_data = []
        for bill in bills:
            days_outstanding = (today - bill.due_date).days
            aging_bucket = 'current'
            if days_outstanding > 90:
                aging_bucket = '91+'
            elif days_outstanding > 60:
                aging_bucket = '61-90'
            elif days_outstanding > 30:
                aging_bucket = '31-60'
            elif days_outstanding > 0:
                aging_bucket = '1-30'
            
            aging_data.append({
                'vendor_name': bill.vendor.name,
                'bill_number': bill.bill_number,
                'due_date': bill.due_date,
                'balance_due': bill.balance_due,
                'days_outstanding': max(0, days_outstanding),
                'aging_bucket': aging_bucket
            })
        
        return Response(aging_data)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'email', 'city']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Customer.objects.filter(organization=org)
            
            is_active = self.request.query_params.get('is_active')
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
            return queryset
        return Customer.objects.none()

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        customer = self.get_object()
        customer.is_active = not customer.is_active
        customer.save()
        return Response({
            'id': customer.id,
            'name': customer.name,
            'is_active': customer.is_active
        })

    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        customer = self.get_object()
        
        invoices = customer.invoices.all().values(
            'invoice_number', 'invoice_date', 'total', 'status', 'currency'
        )
        
        quotations = customer.quotations.all().values(
            'quotation_number', 'quotation_date', 'total', 'status', 'currency'
        )
        
        payments = InvoicePayment.objects.filter(
            invoice__customer=customer
        ).select_related('invoice').values(
            'payment_date', 'amount', 'payment_method', 'invoice__invoice_number'
        )
        
        credits = customer.credits.all().values(
            'credit_number', 'date', 'amount', 'status'
        )
        
        return Response({
            'invoices': list(invoices),
            'quotations': list(quotations),
            'payments': list(payments),
            'credits': list(credits),
        })


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice_number', 'customer__name', 'order_number']
    ordering_fields = ['invoice_date', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return InvoiceListSerializer
        return InvoiceSerializer

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Invoice.objects.filter(organization=org).prefetch_related('items')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            customer = self.request.query_params.get('customer')
            if customer:
                queryset = queryset.filter(customer_id=customer)
            
            start_date = self.request.query_params.get('start_date')
            if start_date:
                queryset = queryset.filter(invoice_date__gte=start_date)
            
            end_date = self.request.query_params.get('end_date')
            if end_date:
                queryset = queryset.filter(invoice_date__lte=end_date)
            
            is_overdue = self.request.query_params.get('overdue')
            if is_overdue == 'true':
                queryset = queryset.filter(
                    due_date__lt=timezone.now().date(),
                    status__in=['sent', 'viewed', 'overdue']
                )
            
            return queryset
        return Invoice.objects.none()

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'sent'
        invoice.sent_at = timezone.now()
        invoice.sent_by = request.user
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        invoice = self.get_object()
        email_subject = request.data.get('email_subject', f'Invoice {invoice.invoice_number}')
        email_body = request.data.get('email_body', '')
        
        invoice.email_subject = email_subject
        invoice.email_body = email_body
        invoice.email_sent = True
        invoice.last_email_sent_at = timezone.now()
        invoice.status = 'sent'
        invoice.sent_at = timezone.now()
        invoice.sent_by = request.user
        invoice.save()
        return Response({
            'message': 'Email sent successfully',
            'email_sent': invoice.email_sent,
            'last_email_sent_at': invoice.last_email_sent_at
        })

    @action(detail=True, methods=['post'])
    def void(self, request, pk=None):
        invoice = self.get_object()
        if invoice.status == 'paid':
            return Response({'error': 'Cannot void a paid invoice'}, status=status.HTTP_400_BAD_REQUEST)
        
        invoice.status = 'void'
        invoice.void_at = timezone.now()
        invoice.void_reason = request.data.get('reason', '')
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['post'])
    def mark_viewed(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'viewed'
        invoice.viewed_at = timezone.now()
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['post'])
    def payment(self, request, pk=None):
        invoice = self.get_object()
        amount = Decimal(request.data.get('amount', invoice.balance_due))
        
        payment = InvoicePayment.objects.create(
            invoice=invoice,
            payment_date=request.data.get('payment_date', timezone.now().date()),
            amount=amount,
            payment_method=request.data.get('payment_method', 'bank_transfer'),
            reference=request.data.get('reference', ''),
            notes=request.data.get('notes', ''),
            created_by=request.user,
            organization=invoice.organization
        )
        
        invoice.amount_paid += amount
        if invoice.amount_paid >= invoice.total:
            invoice.status = 'paid'
        else:
            invoice.status = 'partially_paid'
        invoice.save()
        
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        invoice = self.get_object()
        if invoice.amount_paid > 0:
            return Response({'error': 'Cannot cancel an invoice with payments'}, status=status.HTTP_400_BAD_REQUEST)
        invoice.status = 'cancelled'
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        invoice = self.get_object()
        payments = invoice.payments.all()
        return Response(InvoicePaymentSerializer(payments, many=True).data)

    @action(detail=False, methods=['get'])
    def aging(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        today = timezone.now().date()
        invoices = Invoice.objects.filter(
            organization=org,
            status__in=['sent', 'viewed', 'overdue', 'partially_paid']
        ).select_related('customer')
        
        aging_data = []
        for invoice in invoices:
            days_outstanding = (today - invoice.due_date).days
            aging_bucket = 'current'
            if days_outstanding > 90:
                aging_bucket = '91+'
            elif days_outstanding > 60:
                aging_bucket = '61-90'
            elif days_outstanding > 30:
                aging_bucket = '31-60'
            elif days_outstanding > 0:
                aging_bucket = '1-30'
            
            aging_data.append({
                'customer_name': invoice.customer.name,
                'invoice_number': invoice.invoice_number,
                'due_date': invoice.due_date,
                'balance_due': invoice.balance_due,
                'days_outstanding': max(0, days_outstanding),
                'aging_bucket': aging_bucket
            })
        
        return Response(aging_data)


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['quotation_number', 'customer__name']
    ordering_fields = ['quotation_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Quotation.objects.filter(organization=org).prefetch_related('items')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            customer = self.request.query_params.get('customer')
            if customer:
                queryset = queryset.filter(customer_id=customer)
            
            return queryset
        return Quotation.objects.none()

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = 'sent'
        quotation.sent_at = timezone.now()
        quotation.sent_by = request.user
        quotation.save()
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        quotation = self.get_object()
        email_subject = request.data.get('email_subject', f'Quotation {quotation.quotation_number}')
        email_body = request.data.get('email_body', '')
        
        quotation.email_subject = email_subject
        quotation.email_body = email_body
        quotation.email_sent = True
        quotation.last_email_sent_at = timezone.now()
        quotation.status = 'sent'
        quotation.sent_at = timezone.now()
        quotation.sent_by = request.user
        quotation.save()
        return Response({
            'message': 'Email sent successfully',
            'email_sent': quotation.email_sent,
            'last_email_sent_at': quotation.last_email_sent_at
        })

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = 'approved'
        quotation.approved_at = timezone.now()
        quotation.approved_by = request.user
        quotation.save()
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = 'rejected'
        quotation.rejected_at = timezone.now()
        quotation.rejected_by = request.user
        quotation.rejection_reason = request.data.get('reason', '')
        quotation.save()
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def convert_to_invoice(self, request, pk=None):
        quotation = self.get_object()
        if quotation.status not in ['accepted', 'sent']:
            return Response({'error': 'Quotation must be accepted before converting'}, status=status.HTTP_400_BAD_REQUEST)
        
        invoice = Invoice.objects.create(
            customer=quotation.customer,
            invoice_date=timezone.now().date(),
            due_date=request.data.get('due_date', timezone.now().date() + timedelta(days=30)),
            subtotal=quotation.subtotal,
            discount_percent=quotation.discount_percent,
            discount_amount=quotation.discount_amount,
            tax_percent=quotation.tax_percent,
            tax_amount=quotation.tax_amount,
            total=quotation.total,
            notes=quotation.notes,
            terms_conditions=quotation.terms_conditions,
            converted_from_quotation=quotation,
            organization=quotation.organization
        )
        
        for item in quotation.items.all():
            InvoiceItem.objects.create(
                invoice=invoice,
                description=item.description,
                product=item.product,
                quantity=item.quantity,
                unit_price=item.unit_price,
                discount_percent=item.discount_percent,
                organization=quotation.organization
            )
        
        quotation.status = 'converted'
        quotation.converted_to_invoice = invoice
        quotation.save()
        
        return Response(InvoiceSerializer(invoice).data)


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['expense_number', 'description', 'category']
    ordering_fields = ['expense_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Expense.objects.filter(organization=org)
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            category = self.request.query_params.get('category')
            if category:
                queryset = queryset.filter(category=category)
            
            start_date = self.request.query_params.get('start_date')
            if start_date:
                queryset = queryset.filter(expense_date__gte=start_date)
            
            end_date = self.request.query_params.get('end_date')
            if end_date:
                queryset = queryset.filter(expense_date__lte=end_date)
            
            return queryset
        return Expense.objects.none()

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'submitted'
        expense.submitted_by = request.user
        expense.save()
        return Response(ExpenseSerializer(expense).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'approved'
        expense.approved_by = request.user
        expense.save()
        return Response(ExpenseSerializer(expense).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'rejected'
        expense.notes += f"\nRejected: {request.data.get('reason', '')}"
        expense.save()
        return Response(ExpenseSerializer(expense).data)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'paid'
        expense.save()
        return Response(ExpenseSerializer(expense).data)


class TaxRateViewSet(viewsets.ModelViewSet):
    queryset = TaxRate.objects.all()
    serializer_class = TaxRateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return TaxRate.objects.filter(organization=org)
        return TaxRate.objects.none()


class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'bank_name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return BankAccount.objects.filter(organization=org)
        return BankAccount.objects.none()


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'period']
    ordering_fields = ['start_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Budget.objects.filter(organization=org).prefetch_related('lines')
        return Budget.objects.none()


class FinanceDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        revenue_accounts = Account.objects.filter(organization=org, account_type='revenue')
        expense_accounts = Account.objects.filter(organization=org, account_type='expense')
        
        total_revenue = sum(acc.balance for acc in revenue_accounts)
        total_expenses = sum(acc.balance for acc in expense_accounts)
        
        total_receivables = Invoice.objects.filter(
            organization=org,
            status__in=['sent', 'viewed', 'overdue', 'partially_paid']
        ).aggregate(total=Sum('balance_due'))['total'] or Decimal('0')
        
        total_payables = Bill.objects.filter(
            organization=org,
            status__in=['received', 'approved', 'partially_paid']
        ).aggregate(total=Sum('balance_due'))['total'] or Decimal('0')
        
        cash_balance = BankAccount.objects.filter(
            organization=org,
            is_active=True
        ).aggregate(total=Sum('current_balance'))['total'] or Decimal('0')
        
        invoices_overdue = Invoice.objects.filter(
            organization=org,
            due_date__lt=today,
            status__in=['sent', 'viewed', 'overdue']
        ).count()
        
        bills_due_soon = Bill.objects.filter(
            organization=org,
            due_date__lte=today + timedelta(days=7),
            status__in=['received', 'approved']
        ).count()
        
        return Response({
            'total_revenue': total_revenue,
            'total_expenses': total_expenses,
            'net_profit': total_revenue - total_expenses,
            'total_receivables': total_receivables,
            'total_payables': total_payables,
            'cash_balance': cash_balance,
            'invoices_overdue': invoices_overdue,
            'bills_due_soon': bills_due_soon,
        })

    @action(detail=False, methods=['get'])
    def income_statement(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        date_from = request.query_params.get('date_from', timezone.now().date().replace(month=1, day=1))
        date_to = request.query_params.get('date_to', timezone.now().date())
        
        revenue_accounts = Account.objects.filter(organization=org, account_type='revenue')
        expense_accounts = Account.objects.filter(organization=org, account_type='expense')
        
        revenue = []
        total_revenue = Decimal('0')
        for acc in revenue_accounts:
            debits = acc.debit_entries.filter(
                journal_entry__date__gte=date_from,
                journal_entry__date__lte=date_to,
                journal_entry__status='posted'
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
            credits = acc.credit_entries.filter(
                journal_entry__date__gte=date_from,
                journal_entry__date__lte=date_to,
                journal_entry__status='posted'
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
            balance = credits - debits
            revenue.append({'name': acc.name, 'amount': balance})
            total_revenue += balance
        
        expenses = []
        total_expenses = Decimal('0')
        for acc in expense_accounts:
            debits = acc.debit_entries.filter(
                journal_entry__date__gte=date_from,
                journal_entry__date__lte=date_to,
                journal_entry__status='posted'
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
            credits = acc.credit_entries.filter(
                journal_entry__date__gte=date_from,
                journal_entry__date__lte=date_to,
                journal_entry__status='posted'
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
            balance = debits - credits
            expenses.append({'name': acc.name, 'amount': balance})
            total_expenses += balance
        
        return Response({
            'revenue': revenue,
            'expenses': expenses,
            'total_revenue': total_revenue,
            'total_expenses': total_expenses,
            'net_profit': total_revenue - total_expenses,
        })
