from django.db import models
import uuid


class PayrollRun(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    run_number = models.CharField(max_length=50, unique=True)
    pay_period_start = models.DateField()
    pay_period_end = models.DateField()
    payment_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_gross = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_net = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='payroll_runs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-pay_period_end']

    def __str__(self):
        return self.run_number

    def save(self, *args, **kwargs):
        if not self.run_number:
            self.run_number = f"PR-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class Payslip(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('paid', 'Paid'),
    ]

    payroll_run = models.ForeignKey(PayrollRun, on_delete=models.CASCADE, related_name='payslips')
    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, related_name='payslips')
    basic_salary = models.DecimalField(max_digits=14, decimal_places=2)
    allowances = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    overtime = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    bonuses = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    gross_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_deduction = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    insurance_deduction = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    other_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='payslips')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['payroll_run', 'employee']

    def __str__(self):
        return f"{self.employee} - {self.payroll_run.run_number}"

    def save(self, *args, **kwargs):
        self.gross_salary = self.basic_salary + self.allowances + self.overtime + self.bonuses
        self.total_deductions = self.tax_deduction + self.insurance_deduction + self.other_deductions
        self.net_salary = self.gross_salary - self.total_deductions
        super().save(*args, **kwargs)


class DeductionType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_tax = models.BooleanField(default=False)
    rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='deduction_types')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
