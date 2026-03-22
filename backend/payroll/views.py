from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Sum, Count, Q, Avg
from django.db import transaction
from datetime import datetime, timedelta
from decimal import Decimal
import io
import calendar

from .models import (
    SalaryComponent, EmployeeSalary, EmployeeSalaryComponent, PayrollRun, Payslip,
    PayslipDetail, TaxBracket, TaxWithholding, BankDetail, DirectDeposit,
    ComplianceSetting, PayrollSummary, PayrollCostCenter
)
from hr.models import Employee
from .serializers import (
    SalaryComponentSerializer, EmployeeSalarySerializer, EmployeeSalaryComponentSerializer,
    PayrollRunSerializer, PayrollRunDetailSerializer, PayslipSerializer, PayslipCreateSerializer,
    PayslipDetailSerializer, TaxBracketSerializer, TaxWithholdingSerializer,
    BankDetailSerializer, DirectDepositSerializer, ComplianceSettingSerializer,
    PayrollSummarySerializer, PayrollCostCenterSerializer
)


class SalaryComponentViewSet(viewsets.ModelViewSet):
    queryset = SalaryComponent.objects.all()
    serializer_class = SalaryComponentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = SalaryComponent.objects.filter(organization=org)
            
            component_type = self.request.query_params.get('type')
            if component_type:
                queryset = queryset.filter(type=component_type)
            
            is_active = self.request.query_params.get('is_active')
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
            return queryset
        return SalaryComponent.objects.none()


class EmployeeSalaryViewSet(viewsets.ModelViewSet):
    queryset = EmployeeSalary.objects.all()
    serializer_class = EmployeeSalarySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['effective_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = EmployeeSalary.objects.filter(organization=org).select_related('employee', 'employee__user')
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            is_current = self.request.query_params.get('is_current')
            if is_current == 'true':
                today = timezone.now().date()
                queryset = queryset.filter(effective_date__lte=today).filter(
                    Q(end_date__isnull=True) | Q(end_date__gte=today)
                )
            
            return queryset
        return EmployeeSalary.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))

    @action(detail=True, methods=['post'])
    def add_component(self, request, pk=None):
        salary = self.get_object()
        component_id = request.data.get('component_id')
        amount = Decimal(request.data.get('amount', 0))
        
        try:
            component = SalaryComponent.objects.get(id=component_id)
        except SalaryComponent.DoesNotExist:
            return Response({'error': 'Component not found'}, status=status.HTTP_404_NOT_FOUND)
        
        salary_component, created = EmployeeSalaryComponent.objects.get_or_create(
            employee_salary=salary,
            component=component,
            defaults={'amount': amount, 'is_active': True}
        )
        
        if not created:
            salary_component.amount = amount
            salary_component.is_active = True
            salary_component.save()
        
        return Response(EmployeeSalarySerializer(salary).data)

    @action(detail=True, methods=['post'])
    def remove_component(self, request, pk=None):
        salary = self.get_object()
        component_id = request.data.get('component_id')
        
        try:
            salary_component = EmployeeSalaryComponent.objects.get(
                employee_salary=salary,
                component_id=component_id
            )
            salary_component.is_active = False
            salary_component.save()
        except EmployeeSalaryComponent.DoesNotExist:
            return Response({'error': 'Component not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(EmployeeSalarySerializer(salary).data)


class PayrollRunViewSet(viewsets.ModelViewSet):
    queryset = PayrollRun.objects.all()
    serializer_class = PayrollRunSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'run_number']
    ordering_fields = ['start_date', 'pay_date', 'created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PayrollRunDetailSerializer
        return PayrollRunSerializer

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = PayrollRun.objects.filter(organization=org).prefetch_related('payslips')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            start_date = self.request.query_params.get('start_date')
            if start_date:
                queryset = queryset.filter(start_date__gte=start_date)
            
            end_date = self.request.query_params.get('end_date')
            if end_date:
                queryset = queryset.filter(end_date__lte=end_date)
            
            return queryset
        return PayrollRun.objects.none()

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            organization=getattr(self.request.user, 'organization', None)
        )

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        payroll_run = self.get_object()
        
        if payroll_run.status != 'draft':
            return Response({'error': 'Can only process payroll runs in draft status'},
                          status=status.HTTP_400_BAD_REQUEST)
        
        payroll_run.status = 'processing'
        payroll_run.save()
        
        employees = EmployeeSalary.objects.filter(
            organization=payroll_run.organization,
            effective_date__lte=payroll_run.end_date
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=payroll_run.start_date)
        ).select_related('employee')
        
        total_gross = Decimal('0')
        total_deductions = Decimal('0')
        total_net = Decimal('0')
        employee_count = 0
        
        for emp_salary in employees:
            earnings = emp_salary.salary_components.filter(is_active=True, component__type='earning').aggregate(total=Sum('amount'))['total'] or Decimal('0')
            deductions = emp_salary.salary_components.filter(is_active=True, component__type='deduction').aggregate(total=Sum('amount'))['total'] or Decimal('0')
            
            basic = emp_salary.basic_salary
            allowances = earnings - basic
            gross = basic + allowances
            tax = self._calculate_tax(gross, payroll_run.organization)
            net = gross - deductions - tax
            
            payslip = Payslip.objects.create(
                employee=emp_salary.employee,
                payroll_run=payroll_run,
                basic_salary=basic,
                allowances=allowances,
                deductions=deductions,
                tax_amount=tax,
                status='processed',
                organization=payroll_run.organization
            )
            
            PayslipDetail.objects.create(
                payslip=payslip,
                component_name='Basic Salary',
                component_type='earning',
                amount=basic,
                is_taxable=True
            )
            
            for sc in emp_salary.salary_components.filter(is_active=True):
                PayslipDetail.objects.create(
                    payslip=payslip,
                    component_name=sc.component.name,
                    component_type=sc.component.type,
                    amount=sc.amount,
                    is_taxable=sc.component.is_taxable
                )
            
            total_gross += gross
            total_deductions += deductions + tax
            total_net += net
            employee_count += 1
        
        payroll_run.total_gross = total_gross
        payroll_run.total_deductions = total_deductions
        payroll_run.total_amount = total_net
        payroll_run.employee_count = employee_count
        payroll_run.status = 'completed'
        payroll_run.save()
        
        return Response(PayrollRunDetailSerializer(payroll_run).data)

    def _calculate_tax(self, gross_amount, organization):
        year = timezone.now().year
        brackets = TaxBracket.objects.filter(
            organization=organization,
            effective_date__lte=timezone.now().date(),
            is_active=True
        ).order_by('min_amount')
        
        annual_gross = gross_amount * 12
        tax = Decimal('0')
        remaining = annual_gross
        
        for bracket in brackets:
            if remaining <= 0:
                break
            bracket_range = bracket.max_amount - bracket.min_amount if bracket.max_amount else remaining
            taxable_in_bracket = min(remaining, bracket_range)
            if annual_gross >= bracket.min_amount:
                taxable = min(taxable_in_bracket, annual_gross - bracket.min_amount)
                if taxable > 0:
                    tax += taxable * (bracket.rate / 100)
            remaining -= bracket_range
        
        return (tax / 12).quantize(Decimal('0.01'))

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        payroll_run = self.get_object()
        
        if payroll_run.status == 'completed':
            return Response({'error': 'Cannot cancel a completed payroll run'},
                          status=status.HTTP_400_BAD_REQUEST)
        
        payroll_run.status = 'cancelled'
        payroll_run.save()
        
        return Response(PayrollRunSerializer(payroll_run).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        payroll_run = self.get_object()
        
        if payroll_run.status != 'completed':
            return Response({'error': 'Can only approve completed payroll runs'},
                          status=status.HTTP_400_BAD_REQUEST)
        
        for payslip in payroll_run.payslips.filter(status='processed'):
            payslip.status = 'paid'
            payslip.payment_date = payroll_run.pay_date
            payslip.payment_method = request.data.get('payment_method', 'bank_transfer')
            payslip.bank_reference = request.data.get('bank_reference', '')
            payslip.save()
        
        payroll_run.status = 'completed'
        payroll_run.save()
        
        return Response(PayrollRunSerializer(payroll_run).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        runs = PayrollRun.objects.filter(organization=org)
        
        return Response({
            'total_runs': runs.count(),
            'total_gross': float(runs.aggregate(total=Sum('total_gross'))['total'] or 0),
            'total_deductions': float(runs.aggregate(total=Sum('total_deductions'))['total'] or 0),
            'total_net': float(runs.aggregate(total=Sum('total_amount'))['total'] or 0),
            'by_status': {
                'draft': runs.filter(status='draft').count(),
                'processing': runs.filter(status='processing').count(),
                'completed': runs.filter(status='completed').count(),
                'cancelled': runs.filter(status='cancelled').count(),
            }
        })


class PayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__user__first_name', 'employee__user__last_name', 'payroll_run__run_number']
    ordering_fields = ['created_at', 'payment_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return PayslipCreateSerializer
        return PayslipSerializer

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Payslip.objects.filter(organization=org).select_related(
                'employee', 'employee__user', 'payroll_run'
            ).prefetch_related('details')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            payroll_run = self.request.query_params.get('payroll_run')
            if payroll_run:
                queryset = queryset.filter(payroll_run_id=payroll_run)
            
            return queryset
        return Payslip.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))

    @action(detail=True, methods=['get'])
    def generate_pdf(self, request, pk=None):
        payslip = self.get_object()
        
        try:
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib.units import inch
        except ImportError:
            return Response({'error': 'PDF generation requires reportlab package'},
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=20,
            alignment=1
        )
        
        elements.append(Paragraph(f"PAYSLIP", title_style))
        elements.append(Spacer(1, 0.25 * inch))
        
        employee_name = payslip.employee.user.get_full_name()
        employee_id = payslip.employee.employee_id
        pay_period = f"{payslip.payroll_run.start_date.strftime('%b %d, %Y')} - {payslip.payroll_run.end_date.strftime('%b %d, %Y')}"
        
        header_data = [
            ['Employee Name:', employee_name, 'Employee ID:', employee_id],
            ['Pay Period:', pay_period, 'Pay Date:', payslip.payroll_run.pay_date.strftime('%b %d, %Y') if payslip.payroll_run.pay_date else 'N/A'],
            ['Payroll Run:', payslip.payroll_run.run_number, 'Status:', payslip.get_status_display()],
        ]
        
        header_table = Table(header_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 2*inch])
        header_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(header_table)
        elements.append(Spacer(1, 0.25 * inch))
        
        earnings_data = [['EARNINGS', '', '']]
        earnings_data.append(['Basic Salary', '', f"${payslip.basic_salary:,.2f}"])
        for detail in payslip.details.filter(component_type='earning'):
            earnings_data.append([detail.component_name, '', f"${detail.amount:,.2f}"])
        
        deductions_data = [['DEDUCTIONS', '', '']]
        for detail in payslip.details.filter(component_type='deduction'):
            deductions_data.append([detail.component_name, '', f"${detail.amount:,.2f}"])
        deductions_data.append(['Tax', '', f"${payslip.tax_amount:,.2f}"])
        
        summary_data = [
            ['Total Earnings:', f"${payslip.gross_salary:,.2f}"],
            ['Total Deductions:', f"${(payslip.deductions + payslip.tax_amount):,.2f}"],
            ['NET PAY:', f"${payslip.net_salary:,.2f}"],
        ]
        
        all_data = earnings_data + [['']] + deductions_data + [['']] + summary_data
        
        main_table = Table(all_data, colWidths=[3*inch, 2*inch, 1.5*inch])
        main_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BACKGROUND', (0, len(earnings_data)), (-1, len(earnings_data)), colors.lightgrey),
            ('SPAN', (0, 0), (2, 0)),
            ('SPAN', (0, len(earnings_data)), (2, len(earnings_data))),
            ('SPAN', (0, len(earnings_data) + 1), (2, len(earnings_data) + 1)),
            ('SPAN', (0, -3), (1, -3)),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.green),
            ('TEXTCOLOR', (0, -1), (-1, -1), colors.whitesmoke),
            ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(main_table)
        
        doc.build(elements)
        buffer.seek(0)
        
        from django.http import HttpResponse
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="payslip_{payslip.id}.pdf"'
        return response

    @action(detail=False, methods=['get'])
    def employee_payslips(self, request):
        employee_id = request.query_params.get('employee_id')
        if not employee_id:
            return Response({'error': 'employee_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        payslips = self.get_queryset().filter(employee_id=employee_id)
        return Response(PayslipSerializer(payslips, many=True).data)


class TaxBracketViewSet(viewsets.ModelViewSet):
    queryset = TaxBracket.objects.all()
    serializer_class = TaxBracketSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['min_amount', 'effective_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = TaxBracket.objects.filter(organization=org)
            
            is_active = self.request.query_params.get('is_active')
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
            return queryset
        return TaxBracket.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))


class TaxWithholdingViewSet(viewsets.ModelViewSet):
    queryset = TaxWithholding.objects.all()
    serializer_class = TaxWithholdingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['tax_year', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = TaxWithholding.objects.filter(organization=org).select_related(
                'employee', 'employee__user', 'tax_bracket'
            )
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            tax_year = self.request.query_params.get('tax_year')
            if tax_year:
                queryset = queryset.filter(tax_year=int(tax_year))
            
            return queryset
        return TaxWithholding.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))

    @action(detail=False, methods=['get'])
    def by_year(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        tax_year = int(request.query_params.get('tax_year', timezone.now().year))
        
        withholdings = TaxWithholding.objects.filter(
            organization=org,
            tax_year=tax_year
        )
        
        total_income = withholdings.aggregate(total=Sum('total_income'))['total'] or Decimal('0')
        total_tax = withholdings.aggregate(total=Sum('tax_amount'))['total'] or Decimal('0')
        total_paid = withholdings.aggregate(total=Sum('paid_tax'))['total'] or Decimal('0')
        total_balance = withholdings.aggregate(total=Sum('balance'))['total'] or Decimal('0')
        
        return Response({
            'tax_year': tax_year,
            'employee_count': withholdings.count(),
            'total_income': float(total_income),
            'total_tax_assessed': float(total_tax),
            'total_tax_paid': float(total_paid),
            'total_balance': float(total_balance),
        })


class BankDetailViewSet(viewsets.ModelViewSet):
    queryset = BankDetail.objects.all()
    serializer_class = BankDetailSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['bank_name', 'employee__user__first_name', 'employee__user__last_name']
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = BankDetail.objects.filter(organization=org).select_related('employee', 'employee__user')
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            is_primary = self.request.query_params.get('is_primary')
            if is_primary is not None:
                queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
            
            return queryset
        return BankDetail.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))


class DirectDepositViewSet(viewsets.ModelViewSet):
    queryset = DirectDeposit.objects.all()
    serializer_class = DirectDepositSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['reference', 'payslip__employee__user__first_name', 'payslip__employee__user__last_name']
    ordering_fields = ['created_at', 'processed_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = DirectDeposit.objects.filter(organization=org).select_related(
                'payslip', 'payslip__employee', 'payslip__employee__user', 'bank_account'
            )
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            return queryset
        return DirectDeposit.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        deposit = self.get_object()
        
        if deposit.status != 'pending':
            return Response({'error': 'Can only process pending deposits'},
                          status=status.HTTP_400_BAD_REQUEST)
        
        deposit.status = 'processing'
        deposit.save()
        
        deposit.status = 'completed'
        deposit.processed_at = timezone.now()
        deposit.save()
        
        payslip = deposit.payslip
        payslip.status = 'paid'
        payslip.payment_date = deposit.processed_at.date()
        payslip.payment_method = 'bank_transfer'
        payslip.bank_reference = deposit.reference
        payslip.save()
        
        return Response(DirectDepositSerializer(deposit).data)

    @action(detail=True, methods=['post'])
    def fail(self, request, pk=None):
        deposit = self.get_object()
        
        deposit.status = 'failed'
        deposit.failure_reason = request.data.get('reason', 'Unknown error')
        deposit.save()
        
        return Response(DirectDepositSerializer(deposit).data)


class ComplianceSettingViewSet(viewsets.ModelViewSet):
    queryset = ComplianceSetting.objects.all()
    serializer_class = ComplianceSettingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['category', 'name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = ComplianceSetting.objects.filter(organization=org)
            
            category = self.request.query_params.get('category')
            if category:
                queryset = queryset.filter(category=category)
            
            is_active = self.request.query_params.get('is_active')
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
            return queryset
        return ComplianceSetting.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        settings = ComplianceSetting.objects.filter(organization=org, is_active=True)
        by_category = {}
        
        for setting in settings:
            if setting.category not in by_category:
                by_category[setting.category] = []
            by_category[setting.category].append({
                'id': setting.id,
                'name': setting.name,
                'value': setting.value,
                'description': setting.description,
            })
        
        return Response(by_category)


class PayrollSummaryViewSet(viewsets.ModelViewSet):
    queryset = PayrollSummary.objects.all()
    serializer_class = PayrollSummarySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['year', 'month', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = PayrollSummary.objects.filter(organization=org).select_related('employee', 'employee__user')
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            year = self.request.query_params.get('year')
            if year:
                queryset = queryset.filter(year=int(year))
            
            return queryset
        return PayrollSummary.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))


class PayrollCostCenterViewSet(viewsets.ModelViewSet):
    queryset = PayrollCostCenter.objects.all()
    serializer_class = PayrollCostCenterSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['code', 'name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = PayrollCostCenter.objects.filter(organization=org).select_related('manager', 'manager__user')
            
            is_active = self.request.query_params.get('is_active')
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
            return queryset
        return PayrollCostCenter.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=getattr(self.request.user, 'organization', None))


class PayrollReportsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = Payslip.objects.filter(organization=org)
        if start_date:
            queryset = queryset.filter(payroll_run__start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(payroll_run__end_date__lte=end_date)
        
        total_gross = queryset.aggregate(total=Sum('gross_salary'))['total'] or Decimal('0')
        total_deductions = queryset.aggregate(total=Sum('deductions'))['total'] or Decimal('0')
        total_tax = queryset.aggregate(total=Sum('tax_amount'))['total'] or Decimal('0')
        total_net = queryset.aggregate(total=Sum('net_salary'))['total'] or Decimal('0')
        employee_count = queryset.values('employee').distinct().count()
        average_salary = total_net / employee_count if employee_count > 0 else Decimal('0')
        
        return Response({
            'total_gross': float(total_gross),
            'total_deductions': float(total_deductions),
            'total_tax': float(total_tax),
            'total_net': float(total_net),
            'employee_count': employee_count,
            'average_salary': float(average_salary),
        })

    @action(detail=False, methods=['get'])
    def tax_report(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        tax_year = int(request.query_params.get('tax_year', timezone.now().year))
        
        withholdings = TaxWithholding.objects.filter(
            organization=org,
            tax_year=tax_year
        )
        
        total_income = withholdings.aggregate(total=Sum('total_income'))['total'] or Decimal('0')
        total_tax = withholdings.aggregate(total=Sum('tax_amount'))['total'] or Decimal('0')
        total_paid = withholdings.aggregate(total=Sum('paid_tax'))['total'] or Decimal('0')
        total_balance = withholdings.aggregate(total=Sum('balance'))['total'] or Decimal('0')
        
        return Response({
            'tax_year': tax_year,
            'employee_count': withholdings.count(),
            'total_income': float(total_income),
            'total_tax_assessed': float(total_tax),
            'total_tax_paid': float(total_paid),
            'total_balance': float(total_balance),
        })

    @action(detail=False, methods=['get'])
    def ytd_report(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        year = int(request.query_params.get('year', timezone.now().year))
        employee_id = request.query_params.get('employee')
        
        queryset = PayrollSummary.objects.filter(organization=org, year=year)
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)
        
        totals = queryset.aggregate(
            gross=Sum('ytd_gross'),
            deductions=Sum('ytd_deductions'),
            tax=Sum('ytd_tax'),
            net=Sum('ytd_net')
        )
        
        by_month = []
        for month in range(1, 13):
            month_data = queryset.filter(month=month).first()
            if month_data:
                by_month.append({
                    'month': month,
                    'month_name': calendar.month_name[month],
                    'total_gross': float(month_data.total_gross),
                    'total_deductions': float(month_data.total_deductions),
                    'total_tax': float(month_data.total_tax),
                    'total_net': float(month_data.total_net),
                })
        
        return Response({
            'year': year,
            'employee_count': queryset.values('employee').distinct().count(),
            'total_gross_ytd': float(totals['gross'] or 0),
            'total_deductions_ytd': float(totals['deductions'] or 0),
            'total_tax_ytd': float(totals['tax'] or 0),
            'total_net_ytd': float(totals['net'] or 0),
            'by_month': by_month,
        })

    @action(detail=False, methods=['get'])
    def cost_analysis(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = Payslip.objects.filter(organization=org)
        if start_date:
            queryset = queryset.filter(payroll_run__start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(payroll_run__end_date__lte=end_date)
        
        by_department = queryset.values(
            'employee__department__name'
        ).annotate(
            employee_count=Count('employee', distinct=True),
            total_gross=Sum('gross_salary'),
            total_deductions=Sum('deductions'),
            total_tax=Sum('tax_amount'),
            total_net=Sum('net_salary'),
        ).order_by('-total_net')
        
        return Response({
            'total_cost': float(queryset.aggregate(total=Sum('gross_salary'))['total'] or 0),
            'total_deductions': float(queryset.aggregate(total=Sum('deductions'))['total'] or 0),
            'total_tax': float(queryset.aggregate(total=Sum('tax_amount'))['total'] or 0),
            'by_department': list(by_department),
        })
