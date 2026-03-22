from django.db import models
from django.conf import settings
from decimal import Decimal
import uuid


class SalaryComponent(models.Model):
    TYPE_CHOICES = [
        ('earning', 'Earning'),
        ('deduction', 'Deduction'),
    ]
    
    CATEGORY_CHOICES = [
        ('basic', 'Basic Salary'),
        ('housing', 'Housing Allowance'),
        ('transport', 'Transportation'),
        ('meal', 'Meal Allowance'),
        ('medical', 'Medical Allowance'),
        ('bonus', 'Bonus'),
        ('overtime', 'Overtime'),
        ('commission', 'Commission'),
        ('tax', 'Tax'),
        ('insurance', 'Insurance'),
        ('pension', 'Pension'),
        ('loan', 'Loan Repayment'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    is_active = models.BooleanField(default=True)
    is_taxable = models.BooleanField(default=True)
    is_recurring = models.BooleanField(default=True)
    calculation_type = models.CharField(max_length=20, default='fixed', choices=[
        ('fixed', 'Fixed Amount'),
        ('percentage', 'Percentage'),
        ('formula', 'Formula Based'),
    ])
    default_amount = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    default_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='salary_components')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class EmployeeSalary(models.Model):
    employee = models.OneToOneField('hr.Employee', on_delete=models.CASCADE, related_name='salary_structure')
    basic_salary = models.DecimalField(max_digits=14, decimal_places=2)
    effective_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    components = models.ManyToManyField(SalaryComponent, through='EmployeeSalaryComponent', related_name='employee_salaries')
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='employee_salaries')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-effective_date']

    def __str__(self):
        return f"{self.employee} - Basic: {self.basic_salary}"


class EmployeeSalaryComponent(models.Model):
    employee_salary = models.ForeignKey(EmployeeSalary, on_delete=models.CASCADE, related_name='salary_components')
    component = models.ForeignKey(SalaryComponent, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['employee_salary', 'component']

    def __str__(self):
        return f"{self.employee_salary.employee} - {self.component.name}: {self.amount}"


class PayrollRun(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=200)
    run_number = models.CharField(max_length=50, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    pay_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_gross = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    employee_count = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='payroll_runs')
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='payroll_runs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.run_number} - {self.name}"

    def save(self, *args, **kwargs):
        if not self.run_number:
            self.run_number = f"PR-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class Payslip(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', 'Bank Transfer'),
        ('check', 'Check'),
        ('cash', 'Cash'),
        ('other', 'Other'),
    ]

    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, related_name='payslips')
    payroll_run = models.ForeignKey(PayrollRun, on_delete=models.CASCADE, related_name='payslips')
    basic_salary = models.DecimalField(max_digits=14, decimal_places=2)
    allowances = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    gross_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=True)
    bank_reference = models.CharField(max_length=100, blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='payslips')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['payroll_run', 'employee']

    def __str__(self):
        return f"{self.employee} - {self.payroll_run.run_number}"

    def save(self, *args, **kwargs):
        self.gross_salary = self.basic_salary + self.allowances
        self.net_salary = self.gross_salary - self.deductions - self.tax_amount
        super().save(*args, **kwargs)


class PayslipDetail(models.Model):
    TYPE_CHOICES = [
        ('earning', 'Earning'),
        ('deduction', 'Deduction'),
    ]

    payslip = models.ForeignKey(Payslip, on_delete=models.CASCADE, related_name='details')
    component_name = models.CharField(max_length=100)
    component_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    is_taxable = models.BooleanField(default=True)
    description = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.payslip} - {self.component_name}: {self.amount}"


class TaxBracket(models.Model):
    name = models.CharField(max_length=100)
    min_amount = models.DecimalField(max_digits=14, decimal_places=2)
    max_amount = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    effective_date = models.DateField()
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='tax_brackets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['min_amount']

    def __str__(self):
        max_str = f"${self.max_amount}" if self.max_amount else "Above"
        return f"{self.name}: ${self.min_amount} - {max_str} @ {self.rate}%"


class TaxWithholding(models.Model):
    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, related_name='tax_withholdings')
    tax_year = models.IntegerField()
    total_income = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_bracket = models.ForeignKey(TaxBracket, on_delete=models.SET_NULL, null=True, related_name='withholdings')
    tax_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    paid_tax = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='tax_withholdings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['employee', 'tax_year']
        ordering = ['-tax_year']

    def __str__(self):
        return f"{self.employee} - {self.tax_year}: {self.balance}"

    def save(self, *args, **kwargs):
        self.balance = self.tax_amount - self.paid_tax
        super().save(*args, **kwargs)


class BankDetail(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
    ]

    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, related_name='bank_details')
    bank_name = models.CharField(max_length=200)
    account_number = models.CharField(max_length=50)
    routing_number = models.CharField(max_length=50, blank=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, default='checking')
    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='employee_bank_details')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_primary', '-created_at']

    def __str__(self):
        return f"{self.employee} - {self.bank_name} ({self.account_number[-4:]})"

    def save(self, *args, **kwargs):
        if self.is_primary:
            BankDetail.objects.filter(employee=self.employee, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)


class DirectDeposit(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    payslip = models.ForeignKey(Payslip, on_delete=models.CASCADE, related_name='direct_deposits')
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    bank_account = models.ForeignKey(BankDetail, on_delete=models.SET_NULL, null=True, related_name='deposits')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    failure_reason = models.TextField(blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='direct_deposits')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.payslip} - {self.amount}"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = f"DD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class ComplianceSetting(models.Model):
    name = models.CharField(max_length=200, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=[
        ('labor_law', 'Labor Law'),
        ('tax', 'Tax Compliance'),
        ('benefits', 'Benefits'),
        ('reporting', 'Reporting'),
        ('other', 'Other'),
    ], default='other')
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='compliance_settings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} = {self.value[:50]}"


class PayrollSummary(models.Model):
    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, related_name='payroll_summaries')
    year = models.IntegerField()
    month = models.IntegerField()
    total_gross = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_net = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    ytd_gross = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    ytd_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    ytd_tax = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    ytd_net = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='payroll_summaries')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['employee', 'year', 'month']
        ordering = ['-year', '-month']

    def __str__(self):
        return f"{self.employee} - {self.year}/{self.month}"


class PayrollCostCenter(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    manager = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='cost_centers')
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='payroll_cost_centers')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"
