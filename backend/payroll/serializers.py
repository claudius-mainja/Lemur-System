from rest_framework import serializers
from .models import PayrollRun, Payslip, DeductionType


class PayslipSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = Payslip
        fields = [
            'id', 'payroll_run', 'employee', 'employee_name', 'basic_salary',
            'allowances', 'overtime', 'bonuses', 'gross_salary', 'tax_deduction',
            'insurance_deduction', 'other_deductions', 'total_deductions', 'net_salary',
            'status', 'payment_date', 'created_at', 'updated_at'
        ]


class PayrollRunSerializer(serializers.ModelSerializer):
    payslips = PayslipSerializer(many=True, read_only=True)
    payslip_count = serializers.SerializerMethodField()

    class Meta:
        model = PayrollRun
        fields = [
            'id', 'run_number', 'pay_period_start', 'pay_period_end', 'payment_date',
            'status', 'total_gross', 'total_deductions', 'total_net', 'payslip_count',
            'payslips', 'created_at', 'updated_at'
        ]

    def get_payslip_count(self, obj):
        return obj.payslips.count()


class DeductionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeductionType
        fields = ['id', 'name', 'description', 'is_tax', 'rate', 'created_at', 'updated_at']
