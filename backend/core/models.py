import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


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
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'super_admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('hr', 'HR Manager'),
        ('finance', 'Finance Manager'),
        ('accountant', 'Accountant'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
        ('ordinary', 'Ordinary User'),
    ]

    PLAN_CHOICES = [
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
        ('other', 'Other'),
    ]

    COUNTRY_CHOICES = [
        ('ZA', 'South Africa'),
        ('ZM', 'Zambia'),
        ('ZW', 'Zimbabwe'),
        ('BW', 'Botswana'),
        ('MW', 'Malawi'),
        ('MZ', 'Mozambique'),
        ('NA', 'Namibia'),
        ('NG', 'Nigeria'),
        ('KE', 'Kenya'),
        ('GH', 'Ghana'),
        ('US', 'United States'),
        ('GB', 'United Kingdom'),
        ('AU', 'Australia'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    department = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    organization_id = models.UUIDField(db_index=True, blank=True, null=True)
    organization_name = models.CharField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=30, choices=INDUSTRY_CHOICES, default='other')
    subscription = models.CharField(max_length=20, choices=PLAN_CHOICES, default='starter')
    currency = models.CharField(max_length=3, default='ZAR')
    country = models.CharField(max_length=3, choices=COUNTRY_CHOICES, default='ZA')
    is_active = models.BooleanField(default=True)
    is_on_trial = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def is_admin(self):
        return self.role in ['admin', 'super_admin']

    def is_hr(self):
        return self.role in ['admin', 'hr', 'super_admin']

    def is_finance(self):
        return self.role in ['admin', 'finance', 'accountant', 'super_admin']


class Organization(models.Model):
    PLAN_CHOICES = [
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
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=3, default='ZA')
    industry = models.CharField(max_length=30, choices=INDUSTRY_CHOICES, default='other')
    subscription = models.CharField(max_length=20, choices=PLAN_CHOICES, default='starter')
    currency = models.CharField(max_length=3, default='ZAR')
    is_active = models.BooleanField(default=True)
    is_on_trial = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'organizations'
        verbose_name_plural = 'Organizations'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('password_change', 'Password Change'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    organization_id = models.UUIDField(db_index=True, blank=True, null=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100, blank=True, null=True)
    object_id = models.CharField(max_length=100, blank=True, null=True)
    details = models.JSONField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.action} - {self.created_at}"
