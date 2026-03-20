from rest_framework import serializers
from .models import Invoice, Payment


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            'id', 'organization_id', 'invoice_number', 'customer_name', 'customer_email',
            'customer_address', 'subtotal', 'tax_amount', 'discount_amount', 'total_amount',
            'currency', 'status', 'payment_terms', 'issue_date', 'due_date', 'paid_date',
            'notes', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'organization_id', 'invoice', 'invoice_number', 'amount', 'currency',
            'payment_method', 'payment_reference', 'status', 'payment_date', 'payer_name',
            'payer_email', 'notes', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class InvoiceStatsSerializer(serializers.Serializer):
    total_invoices = serializers.IntegerField()
    draft = serializers.IntegerField()
    sent = serializers.IntegerField()
    paid = serializers.IntegerField()
    overdue = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)


class PaymentStatsSerializer(serializers.Serializer):
    total_payments = serializers.IntegerField()
    pending = serializers.IntegerField()
    completed = serializers.IntegerField()
    failed = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
