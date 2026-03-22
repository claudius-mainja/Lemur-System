from rest_framework import serializers
from .models import Invoice, InvoiceItem, Quotation, QuotationItem, Expense


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'total']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'customer_name', 'customer_email', 'customer_address',
            'invoice_date', 'due_date', 'subtotal', 'tax_rate', 'tax_amount', 'total',
            'amount_paid', 'status', 'payment_terms', 'notes', 'items',
            'created_at', 'updated_at'
        ]


class QuotationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'total']


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)

    class Meta:
        model = Quotation
        fields = [
            'id', 'quotation_number', 'customer_name', 'customer_email', 'customer_address',
            'quotation_date', 'valid_until', 'subtotal', 'tax_rate', 'tax_amount', 'total',
            'status', 'notes', 'items', 'created_at', 'updated_at'
        ]


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = [
            'id', 'expense_number', 'category', 'description', 'amount', 'expense_date',
            'vendor', 'reference', 'status', 'created_at', 'updated_at'
        ]
