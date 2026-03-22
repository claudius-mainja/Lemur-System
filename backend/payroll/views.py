from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import PayrollRun, Payslip, DeductionType
from .serializers import PayrollRunSerializer, PayslipSerializer, DeductionTypeSerializer


class PayrollRunViewSet(viewsets.ModelViewSet):
    queryset = PayrollRun.objects.all()
    serializer_class = PayrollRunSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['run_number']
    ordering_fields = ['pay_period_end', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return PayrollRun.objects.filter(organization=org).prefetch_related('payslips')
        return PayrollRun.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        runs = PayrollRun.objects.filter(organization=org)
        return Response({
            'total_runs': runs.count(),
            'total_gross_paid': float(runs.aggregate(total=Sum('total_gross'))['total'] or 0),
            'total_net_paid': float(runs.aggregate(total=Sum('total_net'))['total'] or 0),
            'by_status': {
                'draft': runs.filter(status='draft').count(),
                'processing': runs.filter(status='processing').count(),
                'completed': runs.filter(status='completed').count(),
            }
        })


class PayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__user__first_name', 'employee__user__last_name']
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Payslip.objects.filter(organization=org).select_related('employee', 'employee__user', 'payroll_run')
        return Payslip.objects.none()


class DeductionTypeViewSet(viewsets.ModelViewSet):
    queryset = DeductionType.objects.all()
    serializer_class = DeductionTypeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return DeductionType.objects.filter(organization=org)
        return DeductionType.objects.none()
