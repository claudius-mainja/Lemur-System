from rest_framework import serializers
from django.db.models import Sum, Count, Avg
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone

from .models import (
    Account, JournalEntry, JournalEntryLine, Vendor, Bill, BillItem, BillPayment,
    VendorCredit, Customer, Invoice, InvoiceItem, InvoicePayment, CustomerCredit,
    Quotation, QuotationItem, RecurringInvoice, Expense, ExpensePolicy,
    BankAccount, BankTransaction, TaxRate, Budget, BudgetLine
)


class AccountSerializer(serializers.ModelSerializer):
    balance = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    parent_name = serializers.CharField(source='parent.name', read_only=True, allow_null=True)

    class Meta:
        model = Account
        fields = ['id', 'code', 'name', 'account_type', 'balance_type', 'parent', 'parent_name',
                  'description', 'is_active', 'is_bank_account', 'bank_name', 'bank_account_number',
                  'balance', 'created_at', 'updated_at']


class JournalEntryLineSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)
    account_code = serializers.CharField(source='account.code', read_only=True)

    class Meta:
        model = JournalEntryLine
        fields = ['id', 'account', 'account_name', 'account_code', 'description', 'debit', 'credit']


class JournalEntrySerializer(serializers.ModelSerializer):
    lines = JournalEntryLineSerializer(many=True, read_only=True)
    posted_by_name = serializers.CharField(source='posted_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = JournalEntry
        fields = ['id', 'entry_number', 'date', 'description', 'reference', 'source_document',
                  'source_id', 'status', 'posted_by', 'posted_by_name', 'posted_at',
                  'lines', 'created_at', 'updated_at']


class VendorSerializer(serializers.ModelSerializer):
    bill_count = serializers.SerializerMethodField()
    total_balance = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = ['id', 'name', 'code', 'email', 'phone', 'address', 'city', 'state',
                  'country', 'postal_code', 'tax_id', 'payment_terms', 'bank_name',
                  'bank_account', 'notes', 'is_active', 'bill_count', 'total_balance',
                  'created_at', 'updated_at']

    def get_bill_count(self, obj):
        return obj.bills.count()

    def get_total_balance(self, obj):
        return sum(b.balance_due for b in obj.bills.all())


class BillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillItem
        fields = ['id', 'description', 'account', 'quantity', 'unit_price', 'total']


class BillSerializer(serializers.ModelSerializer):
    items = BillItemSerializer(many=True, read_only=True)
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    balance_due = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = Bill
        fields = ['id', 'bill_number', 'vendor', 'vendor_name', 'invoice_number', 'bill_date',
                  'due_date', 'subtotal', 'tax_amount', 'total', 'amount_paid', 'balance_due',
                  'status', 'notes', 'items', 'created_at', 'updated_at']


class BillPaymentSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = BillPayment
        fields = ['id', 'bill', 'payment_date', 'amount', 'payment_method', 'reference',
                  'notes', 'created_by', 'created_by_name', 'created_at']


class VendorCreditSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)

    class Meta:
        model = VendorCredit
        fields = ['id', 'credit_number', 'vendor', 'vendor_name', 'amount', 'reason',
                  'date', 'applied_amount', 'status', 'created_at', 'updated_at']


class CustomerSerializer(serializers.ModelSerializer):
    invoice_count = serializers.SerializerMethodField()
    total_receivable = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = ['id', 'name', 'code', 'email', 'phone', 'address', 'city', 'state',
                  'country', 'postal_code', 'tax_id', 'payment_terms', 'credit_limit',
                  'notes', 'is_active', 'invoice_count', 'total_receivable',
                  'created_at', 'updated_at']

    def get_invoice_count(self, obj):
        return obj.invoices.count()

    def get_total_receivable(self, obj):
        return sum(inv.balance_due for inv in obj.invoices.all())


class InvoiceItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True, allow_null=True)

    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'product', 'product_name', 'quantity', 'unit_price',
                  'discount_percent', 'tax_percent', 'total', 'created_at']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    balance_due = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    sent_by_name = serializers.CharField(source='sent_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer', 'customer_name', 'order_number',
                  'invoice_date', 'due_date', 'subtotal', 'discount_percent', 'discount_amount',
                  'tax_percent', 'tax_amount', 'total', 'amount_paid', 'balance_due',
                  'currency', 'status', 'payment_terms', 'notes', 'terms_conditions',
                  'sent_at', 'sent_by', 'sent_by_name', 'viewed_at',
                  'void_at', 'void_reason',
                  'email_subject', 'email_body', 'email_sent', 'last_email_sent_at',
                  'is_overdue', 'items', 'created_at', 'updated_at']


class InvoiceListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    balance_due = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer_name', 'invoice_date', 'due_date',
                  'total', 'amount_paid', 'balance_due', 'status', 'is_overdue']


class InvoicePaymentSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = InvoicePayment
        fields = ['id', 'invoice', 'payment_date', 'amount', 'payment_method', 'reference',
                  'notes', 'created_by', 'created_by_name', 'created_at']


class CustomerCreditSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = CustomerCredit
        fields = ['id', 'credit_number', 'customer', 'customer_name', 'amount', 'reason',
                  'date', 'applied_amount', 'status', 'created_at', 'updated_at']


class QuotationItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True, allow_null=True)

    class Meta:
        model = QuotationItem
        fields = ['id', 'description', 'product', 'product_name', 'quantity', 'unit_price',
                  'discount_percent', 'total', 'created_at']


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True, allow_null=True)
    rejected_by_name = serializers.CharField(source='rejected_by.get_full_name', read_only=True, allow_null=True)
    sent_by_name = serializers.CharField(source='sent_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Quotation
        fields = ['id', 'quotation_number', 'customer', 'customer_name', 'quotation_date',
                  'valid_until', 'subtotal', 'discount_percent', 'discount_amount',
                  'tax_percent', 'tax_amount', 'total', 'currency', 'status',
                  'notes', 'terms_conditions',
                  'approved_at', 'approved_by', 'approved_by_name',
                  'rejected_at', 'rejected_by', 'rejected_by_name', 'rejection_reason',
                  'sent_at', 'sent_by', 'sent_by_name', 'viewed_at',
                  'email_subject', 'email_body', 'email_sent', 'last_email_sent_at',
                  'converted_to_invoice', 'items', 'created_at', 'updated_at']


class RecurringInvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    last_invoice_number = serializers.CharField(source='last_invoice.invoice_number', read_only=True, allow_null=True)

    class Meta:
        model = RecurringInvoice
        fields = ['id', 'customer', 'customer_name', 'frequency', 'start_date', 'end_date',
                  'next_invoice_date', 'description', 'default_notes', 'status',
                  'last_invoice', 'last_invoice_number', 'created_at', 'updated_at']


class ExpensePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpensePolicy
        fields = ['id', 'name', 'category', 'max_amount', 'requires_receipt',
                  'requires_approval', 'approval_threshold', 'description', 'is_active',
                  'created_at', 'updated_at']


class ExpenseSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True, allow_null=True)
    account_name = serializers.CharField(source='account.name', read_only=True, allow_null=True)
    submitted_by_name = serializers.CharField(source='submitted_by.get_full_name', read_only=True, allow_null=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Expense
        fields = ['id', 'expense_number', 'category', 'description', 'amount', 'tax_amount',
                  'total_amount', 'expense_date', 'vendor', 'vendor_name', 'reference',
                  'account', 'account_name', 'status', 'submitted_by', 'submitted_by_name',
                  'approved_by', 'approved_by_name', 'receipt', 'notes', 'created_at', 'updated_at']


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ['id', 'name', 'bank_name', 'account_number', 'account_type',
                  'routing_number', 'current_balance', 'is_active', 'created_at', 'updated_at']


class BankTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankTransaction
        fields = ['id', 'bank_account', 'transaction_date', 'transaction_type', 'amount',
                  'description', 'reference', 'category', 'is_reconciled', 'reconciled_at',
                  'created_at']


class TaxRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRate
        fields = ['id', 'name', 'rate', 'is_active', 'applies_to_sales',
                  'applies_to_purchases', 'description', 'created_at', 'updated_at']


class BudgetLineSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)

    class Meta:
        model = BudgetLine
        fields = ['id', 'budget', 'account', 'account_name', 'category', 'amount', 'spent']


class BudgetSerializer(serializers.ModelSerializer):
    lines = BudgetLineSerializer(many=True, read_only=True)

    class Meta:
        model = Budget
        fields = ['id', 'name', 'period', 'start_date', 'end_date', 'total_amount',
                  'status', 'notes', 'lines', 'created_at', 'updated_at']


class FinanceDashboardSerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=14, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_receivables = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_payables = serializers.DecimalField(max_digits=14, decimal_places=2)
    cash_balance = serializers.DecimalField(max_digits=14, decimal_places=2)
    invoices_overdue = serializers.IntegerField()
    bills_due_soon = serializers.IntegerField()


class TrialBalanceSerializer(serializers.Serializer):
    account_code = serializers.CharField()
    account_name = serializers.CharField()
    account_type = serializers.CharField()
    debit = serializers.DecimalField(max_digits=14, decimal_places=2)
    credit = serializers.DecimalField(max_digits=14, decimal_places=2)


class BalanceSheetSerializer(serializers.Serializer):
    assets = serializers.ListField()
    liabilities = serializers.ListField()
    equity = serializers.ListField()
    total_assets = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_liabilities = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_equity = serializers.DecimalField(max_digits=14, decimal_places=2)


class IncomeStatementSerializer(serializers.Serializer):
    revenue = serializers.ListField()
    expenses = serializers.ListField()
    total_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=14, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=14, decimal_places=2)
