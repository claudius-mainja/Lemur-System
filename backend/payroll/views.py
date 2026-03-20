from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Payroll, Payslip
from .serializers import PayrollSerializer, PayslipSerializer


class PayrollViewSet(viewsets.ModelViewSet):
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'pay_period']
    search_fields = ['payroll_number']
    ordering_fields = ['created_at', 'payroll_number', 'payment_date']

    def get_queryset(self):
        user = self.request.user
        queryset = Payroll.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            organization_id=self.request.user.organization_id,
            processed_by=self.request.user.id
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        payroll = self.get_object()
        payroll.status = 'completed'
        payroll.approved_by = request.user.id
        payroll.save()
        return Response({'message': 'Payroll approved and completed'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_payrolls': queryset.count(),
            'draft': queryset.filter(status='draft').count(),
            'processing': queryset.filter(status='processing').count(),
            'completed': queryset.filter(status='completed').count(),
            'total_paid': queryset.filter(status='completed').aggregate(
                total=Sum('total_net')
            )['total'] or 0,
        })


class PayslipViewSet(viewsets.ModelViewSet):
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'department']
    search_fields = ['employee_name', 'employee_email']
    ordering_fields = ['created_at', 'net_salary', 'payment_date']

    def get_queryset(self):
        user = self.request.user
        queryset = Payslip.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_payslips': queryset.count(),
            'pending': queryset.filter(status='pending').count(),
            'processed': queryset.filter(status='processed').count(),
            'paid': queryset.filter(status='paid').count(),
        })

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        payslip = self.get_object()
        payslip.status = 'paid'
        payslip.save()
        return Response({'message': 'Payslip marked as paid'})
