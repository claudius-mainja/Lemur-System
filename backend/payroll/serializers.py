from rest_framework import serializers
from django.db.models import Sum, Count
from datetime import date
from decimal import Decimal
from .models import (
    SalaryComponent, EmployeeSalary, EmployeeSalaryComponent, PayrollRun, Payslip,
    PayslipDetail, TaxBracket, TaxWithholding, BankDetail, DirectDeposit,
    ComplianceSetting, PayrollSummary, PayrollCostCenter
)


class SalaryComponentSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = SalaryComponent
        fields = [
            'id', 'name', 'type', 'type_display', 'category', 'category_display',
            'is_active', 'is_taxable', 'is_recurring', 'calculation_type',
            'default_amount', 'default_percentage', 'description', 'created_at', 'updated_at'
        ]


class EmployeeSalaryComponentSerializer(serializers.ModelSerializer):
    component_name = serializers.CharField(source='component.name', read_only=True)
    component_type = serializers.CharField(source='component.type', read_only=True)

    class Meta:
        model = EmployeeSalaryComponent
        fields = ['id', 'component', 'component_name', 'component_type', 'amount', 'is_active']


class EmployeeSalarySerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    salary_components = EmployeeSalaryComponentSerializer(source='salary_components', many=True, read_only=True)
    total_earnings = serializers.SerializerMethodField()
    total_deductions = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeSalary
        fields = [
            'id', 'employee', 'employee_name', 'basic_salary', 'effective_date',
            'end_date', 'salary_components', 'total_earnings', 'total_deductions',
            'created_at', 'updated_at'
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.user.get_full_name()}"

    def get_total_earnings(self, obj):
        return sum(
            sc.amount for sc in obj.salary_components.filter(is_active=True, component__type='earning')
        )

    def get_total_deductions(self, obj):
        return sum(
            sc.amount for sc in obj.salary_components.filter(is_active=True, component__type='deduction')
        )


class PayslipDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayslipDetail
        fields = ['id', 'component_name', 'component_type', 'amount', 'is_taxable', 'description']


class PayslipSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    payroll_run_name = serializers.CharField(source='payroll_run.name', read_only=True)
    payroll_run_number = serializers.CharField(source='payroll_run.run_number', read_only=True)
    details = PayslipDetailSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Payslip
        fields = [
            'id', 'employee', 'employee_name', 'payroll_run', 'payroll_run_name',
            'payroll_run_number', 'basic_salary', 'allowances', 'deductions',
            'tax_amount', 'gross_salary', 'net_salary', 'status', 'status_display',
            'payment_date', 'payment_method', 'bank_reference', 'details',
            'created_at', 'updated_at'
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.user.get_full_name()}"


class PayslipCreateSerializer(serializers.ModelSerializer):
    details_data = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)

    class Meta:
        model = Payslip
        fields = [
            'employee', 'payroll_run', 'basic_salary', 'allowances', 'deductions',
            'tax_amount', 'details_data'
        ]

    def create(self, validated_data):
        details_data = validated_data.pop('details_data', [])
        payslip = Payslip.objects.create(**validated_data)
        
        for detail_data in details_data:
            PayslipDetail.objects.create(payslip=payslip, **detail_data)
        
        return payslip


class PayrollRunSerializer(serializers.ModelSerializer):
    payslips_count = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = PayrollRun
        fields = [
            'id', 'name', 'run_number', 'start_date', 'end_date', 'pay_date',
            'status', 'status_display', 'total_amount', 'total_gross', 'total_deductions',
            'employee_count', 'payslips_count', 'notes', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]

    def get_payslips_count(self, obj):
        return obj.payslips.count()


class PayrollRunDetailSerializer(PayrollRunSerializer):
    payslips = PayslipSerializer(many=True, read_only=True)

    class Meta(PayrollRunSerializer.Meta):
        fields = PayrollRunSerializer.Meta.fields + ['payslips']


class TaxBracketSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxBracket
        fields = [
            'id', 'name', 'min_amount', 'max_amount', 'rate', 'effective_date',
            'is_active', 'description', 'created_at', 'updated_at'
        ]


class TaxWithholdingSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    tax_year = serializers.IntegerField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = TaxWithholding
        fields = [
            'id', 'employee', 'employee_name', 'tax_year', 'total_income',
            'tax_bracket', 'tax_amount', 'paid_tax', 'balance', 'status', 'created_at', 'updated_at'
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.user.get_full_name()}"

    def get_status(self, obj):
        if obj.balance <= 0:
            return 'settled'
        return 'outstanding'


class BankDetailSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    account_type_display = serializers.CharField(source='get_account_type_display', read_only=True)
    masked_account = serializers.SerializerMethodField()

    class Meta:
        model = BankDetail
        fields = [
            'id', 'employee', 'employee_name', 'bank_name', 'account_number',
            'masked_account', 'routing_number', 'account_type', 'account_type_display',
            'is_primary', 'is_active', 'created_at', 'updated_at'
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.user.get_full_name()}"

    def get_masked_account(self, obj):
        if len(obj.account_number) >= 4:
            return f"****{obj.account_number[-4:]}"
        return '****'


class DirectDepositSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    payslip_reference = serializers.CharField(source='payslip.payroll_run.run_number', read_only=True)
    bank_info = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = DirectDeposit
        fields = [
            'id', 'payslip', 'employee_name', 'payslip_reference', 'amount',
            'bank_account', 'bank_info', 'status', 'status_display', 'reference',
            'processed_at', 'failure_reason', 'created_at', 'updated_at'
        ]

    def get_employee_name(self, obj):
        return f"{obj.payslip.employee.user.get_full_name()}"

    def get_bank_info(self, obj):
        if obj.bank_account:
            return f"{obj.bank_account.bank_name} - ****{obj.bank_account.account_number[-4:]}"
        return None


class ComplianceSettingSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = ComplianceSetting
        fields = [
            'id', 'name', 'value', 'description', 'category', 'category_display',
            'is_active', 'created_at', 'updated_at'
        ]


class PayrollSummarySerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    month_name = serializers.SerializerMethodField()

    class Meta:
        model = PayrollSummary
        fields = [
            'id', 'employee', 'employee_name', 'year', 'month', 'month_name',
            'total_gross', 'total_deductions', 'total_tax', 'total_net',
            'ytd_gross', 'ytd_deductions', 'ytd_tax', 'ytd_net', 'created_at', 'updated_at'
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.user.get_full_name()}"

    def get_month_name(self, obj):
        import calendar
        return calendar.month_name[obj.month]


class PayrollCostCenterSerializer(serializers.ModelSerializer):
    manager_name = serializers.SerializerMethodField()
    total_employees = serializers.SerializerMethodField()

    class Meta:
        model = PayrollCostCenter
        fields = [
            'id', 'name', 'code', 'description', 'manager', 'manager_name',
            'total_employees', 'is_active', 'created_at', 'updated_at'
        ]

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.user.get_full_name()}"
        return None

    def get_total_employees(self, obj):
        return obj.employee_salaries.filter(end_date__isnull=True).count()


class PayrollReportSerializer(serializers.Serializer):
    total_gross = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_deductions = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_tax = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_net = serializers.DecimalField(max_digits=14, decimal_places=2)
    employee_count = serializers.IntegerField()
    average_salary = serializers.DecimalField(max_digits=14, decimal_places=2)


class TaxReportSerializer(serializers.Serializer):
    tax_year = serializers.IntegerField()
    total_income = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_tax_assessed = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_tax_paid = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_balance = serializers.DecimalField(max_digits=14, decimal_places=2)
    employee_count = serializers.IntegerField()


class YTDReportSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    employee_count = serializers.IntegerField()
    total_gross_ytd = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_deductions_ytd = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_tax_ytd = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_net_ytd = serializers.DecimalField(max_digits=14, decimal_places=2)
    by_month = serializers.ListField()
