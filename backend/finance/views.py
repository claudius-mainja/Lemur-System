from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'payment_terms']
    search_fields = ['invoice_number', 'customer_name', 'customer_email']
    ordering_fields = ['created_at', 'invoice_number', 'total_amount', 'due_date']

    def get_queryset(self):
        user = self.request.user
        queryset = Invoice.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            organization_id=self.request.user.organization_id,
            created_by=self.request.user.id
        )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_invoices': queryset.count(),
            'draft': queryset.filter(status='draft').count(),
            'sent': queryset.filter(status='sent').count(),
            'paid': queryset.filter(status='paid').count(),
            'overdue': queryset.filter(status='overdue').count(),
            'total_revenue': queryset.filter(status='paid').aggregate(
                total=Sum('total_amount')
            )['total'] or 0,
        })


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'payment_method']
    search_fields = ['invoice_number', 'payer_name', 'payer_email', 'payment_reference']
    ordering_fields = ['created_at', 'payment_date', 'amount']

    def get_queryset(self):
        user = self.request.user
        queryset = Payment.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        invoice_id = serializer.validated_data.get('invoice')
        if invoice_id:
            invoice = Invoice.objects.get(id=invoice_id.id)
            serializer.save(
                organization_id=self.request.user.organization_id,
                created_by=self.request.user.id,
                invoice_number=invoice.invoice_number
            )
        else:
            serializer.save(
                organization_id=self.request.user.organization_id,
                created_by=self.request.user.id
            )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_payments': queryset.count(),
            'pending': queryset.filter(status='pending').count(),
            'completed': queryset.filter(status='completed').count(),
            'failed': queryset.filter(status='failed').count(),
            'total_amount': queryset.filter(status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0,
        })
