from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone as tz


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'super_admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Organization Admin'),
        ('hr', 'HR Manager'),
        ('finance', 'Finance Manager'),
        ('accounting', 'Accountant'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
        ('ordinary', 'Ordinary User'),
    ]

    SUBSCRIPTION_CHOICES = [
        ('starter', 'Starter'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
    ]

    INDUSTRY_CHOICES = [
        ('technology', 'Technology'),
        ('retail', 'Retail'),
        ('manufacturing', 'Manufacturing'),
        ('healthcare', 'Healthcare'),
        ('education', 'Education'),
        ('finance', 'Finance'),
        ('construction', 'Construction'),
        ('hospitality', 'Hospitality'),
        ('transportation', 'Transportation'),
        ('agriculture', 'Agriculture'),
        ('mining', 'Mining'),
        ('telecommunications', 'Telecommunications'),
        ('realestate', 'Real Estate'),
        ('legal', 'Legal'),
        ('consulting', 'Consulting'),
        ('marketing', 'Marketing'),
        ('other', 'Other'),
    ]

    id = models.CharField(max_length=36, primary_key=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='employee')
    department = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, related_name='users', null=True, blank=True)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, blank=True, null=True)
    subscription = models.CharField(max_length=50, choices=SUBSCRIPTION_CHOICES, default='starter')
    currency = models.CharField(max_length=10, default='USD')
    country = models.CharField(max_length=10, default='US')
    timezone = models.CharField(max_length=50, default='UTC')
    modules = models.JSONField(default=list)
    user_groups = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_on_trial = models.BooleanField(default=True)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    extra_users = models.IntegerField(default=0)
    extra_users_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date_joined = models.DateTimeField(default=tz.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    def get_organization_id(self):
        return self.organization.id if self.organization else None
    
    def get_max_users(self):
        if not self.organization:
            return 0
        return self.organization.max_users + self.extra_users
    
    def get_current_user_count(self):
        if not self.organization:
            return 0
        return self.organization.users.filter(is_active=True).count()
    
    def can_add_user(self):
        return self.get_current_user_count() < self.get_max_users()
    
    def get_extra_user_cost(self):
        return self.extra_users * 5.00


class Organization(models.Model):
    SUBSCRIPTION_CHOICES = [
        ('starter', 'Starter'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
    ]
    
    MODULE_CHOICES = [
        ('hr', 'Human Resources'),
        ('finance', 'Finance & Accounting'),
        ('crm', 'Customer Relations'),
        ('payroll', 'Payroll'),
        ('productivity', 'Productivity'),
        ('inventory', 'Inventory & Supply Chain'),
        ('marketing', 'Marketing'),
        ('services', 'Help Desk'),
        ('operations', 'Operations'),
    ]

    id = models.CharField(max_length=36, primary_key=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=10, default='US')
    industry = models.CharField(max_length=50, blank=True, null=True)
    subscription = models.CharField(max_length=50, choices=SUBSCRIPTION_CHOICES, default='starter')
    currency = models.CharField(max_length=10, default='USD')
    modules = models.JSONField(default=list)
    max_users = models.IntegerField(default=5)
    extra_users = models.IntegerField(default=0)
    extra_users_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    is_on_trial = models.BooleanField(default=True)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'organizations'

    def __str__(self):
        return self.name
    
    def get_active_user_count(self):
        return self.users.filter(is_active=True).count()
    
    def get_max_users_total(self):
        return self.max_users + self.extra_users
    
    def can_add_user(self):
        return self.get_active_user_count() < self.get_max_users_total()
    
    def get_extra_users_cost(self):
        return self.extra_users * 5.00


class UserGroup(models.Model):
    id = models.CharField(max_length=36, primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='groups')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    module = models.CharField(max_length=50, default='general')
    permissions = models.JSONField(default=dict)
    modules_access = models.JSONField(default=list)
    members = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_user_groups'
        unique_together = ['organization', 'name']

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class AuditLog(models.Model):
    id = models.CharField(max_length=36, primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=50)
    resource_id = models.CharField(max_length=36, blank=True)
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'core_audit_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} - {self.resource_type} by {self.user}"
