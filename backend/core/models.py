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
        ('admin', 'Admin'),
        ('hr', 'HR Manager'),
        ('finance', 'Finance Manager'),
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
        ('other', 'Other'),
    ]

    id = models.CharField(max_length=36, primary_key=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='employee')
    department = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    organization_id = models.CharField(max_length=36, blank=True, null=True)
    organization_name = models.CharField(max_length=200, blank=True, null=True)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, blank=True, null=True)
    subscription = models.CharField(max_length=50, choices=SUBSCRIPTION_CHOICES, default='starter')
    currency = models.CharField(max_length=10, default='USD')
    country = models.CharField(max_length=10, default='US')
    timezone = models.CharField(max_length=50, default='UTC')
    modules = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_on_trial = models.BooleanField(default=True)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
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


class Organization(models.Model):
    id = models.CharField(max_length=36, primary_key=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=10, default='US')
    industry = models.CharField(max_length=50, blank=True, null=True)
    subscription = models.CharField(max_length=50, default='starter')
    currency = models.CharField(max_length=10, default='USD')
    modules = models.JSONField(default=list)
    max_users = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'organizations'

    def __str__(self):
        return self.name
