from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from .models import Invoice, InvoiceItem, Quotation, QuotationItem, Expense
from .serializers import (
    InvoiceSerializer, InvoiceItemSerializer,
    QuotationSerializer, QuotationItemSerializer,
    ExpenseSerializer
)


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice_number', 'customer_name', 'customer_email']
    ordering_fields = ['invoice_date', 'total', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Invoice.objects.filter(organization=org).prefetch_related('items')
        return Invoice.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        invoices = Invoice.objects.filter(organization=org)
        return Response({
            'total_invoiced': float(invoices.aggregate(total=Sum('total'))['total'] or 0),
            'total_paid': float(invoices.aggregate(total=Sum('amount_paid'))['total'] or 0),
            'total_outstanding': float(invoices.aggregate(total=Sum('total'))['total'] or 0) - float(invoices.aggregate(total=Sum('amount_paid'))['total'] or 0),
            'by_status': {
                'draft': invoices.filter(status='draft').count(),
                'sent': invoices.filter(status='sent').count(),
                'paid': invoices.filter(status='paid').count(),
                'overdue': invoices.filter(status='overdue').count(),
            }
        })

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'paid'
        invoice.amount_paid = invoice.total
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'sent'
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)


class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['description']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return InvoiceItem.objects.filter(organization=org)
        return InvoiceItem.objects.none()


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['quotation_number', 'customer_name', 'customer_email']
    ordering_fields = ['quotation_date', 'total', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Quotation.objects.filter(organization=org).prefetch_related('items')
        return Quotation.objects.none()

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = 'accepted'
        quotation.save()
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = 'rejected'
        quotation.save()
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = 'sent'
        quotation.save()
        return Response(QuotationSerializer(quotation).data)


class QuotationItemViewSet(viewsets.ModelViewSet):
    queryset = QuotationItem.objects.all()
    serializer_class = QuotationItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['description']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return QuotationItem.objects.filter(organization=org)
        return QuotationItem.objects.none()


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['expense_number', 'description', 'vendor']
    ordering_fields = ['expense_date', 'amount', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Expense.objects.filter(organization=org)
        return Expense.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        expenses = Expense.objects.filter(organization=org)
        return Response({
            'total_expenses': float(expenses.aggregate(total=Sum('amount'))['total'] or 0),
            'by_category': dict(
                expenses.values('category').annotate(total=Sum('amount')).values_list('category', 'total')
            ),
            'by_status': {
                'pending': expenses.filter(status='pending').count(),
                'approved': expenses.filter(status='approved').count(),
                'rejected': expenses.filter(status='rejected').count(),
                'paid': expenses.filter(status='paid').count(),
            }
        })

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'approved'
        expense.save()
        return Response(ExpenseSerializer(expense).data)

    @action(detail=True, methods=['post'])
    def reject_expense(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'rejected'
        expense.save()
        return Response(ExpenseSerializer(expense).data)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'paid'
        expense.save()
        return Response(ExpenseSerializer(expense).data)
