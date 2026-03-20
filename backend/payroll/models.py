"""
Payroll Module Models
======================
Manages employee payroll processing, payslips, and salary calculations.
Handles various deductions including tax, pension, and medical aid.
"""
import uuid
from django.db import models


class Payroll(models.Model):
    """
    Payroll batch records for pay periods.
    Aggregates totals for all employees in a pay run.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    PAY_PERIOD_CHOICES = [
        ('monthly', 'Monthly'),
        ('bi_weekly', 'Bi-Weekly'),
        ('weekly', 'Weekly'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    payroll_number = models.CharField(max_length=50, db_index=True)
    pay_period = models.CharField(max_length=20, choices=PAY_PERIOD_CHOICES, default='monthly')
    period_start = models.DateField()
    period_end = models.DateField()
    payment_date = models.DateField()
    total_gross = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_net = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_employees = models.IntegerField(default=0)
    currency = models.CharField(max_length=3, default='ZAR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True, null=True)
    processed_by = models.UUIDField(blank=True, null=True)
    approved_by = models.UUIDField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payrolls'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payroll {self.payroll_number} - {self.period_start} to {self.period_end}"


class Payslip(models.Model):
    """
    Individual employee payslip with salary breakdown.
    Includes earnings, deductions, and net pay calculation.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    payroll = models.ForeignKey(Payroll, on_delete=models.CASCADE, related_name='payslips', blank=True, null=True)
    employee_id = models.UUIDField(db_index=True)
    employee_name = models.CharField(max_length=255)
    employee_email = models.EmailField(blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    overtime_pay = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bonuses = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pension_contribution = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    medical_aid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    other_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='ZAR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payslips'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payslip {self.employee_name} - {self.payroll}"
