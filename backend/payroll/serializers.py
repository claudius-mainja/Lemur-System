from rest_framework import serializers
from .models import Payroll, Payslip


class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = [
            'id', 'organization_id', 'payroll_number', 'pay_period', 'period_start',
            'period_end', 'payment_date', 'total_gross', 'total_deductions', 'total_net',
            'total_employees', 'currency', 'status', 'notes', 'processed_by',
            'approved_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PayslipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payslip
        fields = [
            'id', 'organization_id', 'payroll', 'employee_id', 'employee_name',
            'employee_email', 'department', 'position', 'basic_salary', 'allowances',
            'overtime_pay', 'bonuses', 'gross_salary', 'tax_deduction', 'pension_contribution',
            'medical_aid', 'other_deductions', 'total_deductions', 'net_salary', 'currency',
            'status', 'payment_date', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PayrollStatsSerializer(serializers.Serializer):
    total_payrolls = serializers.IntegerField()
    draft = serializers.IntegerField()
    processing = serializers.IntegerField()
    completed = serializers.IntegerField()
    total_paid = serializers.DecimalField(max_digits=14, decimal_places=2)


class PayslipStatsSerializer(serializers.Serializer):
    total_payslips = serializers.IntegerField()
    pending = serializers.IntegerField()
    processed = serializers.IntegerField()
    paid = serializers.IntegerField()
