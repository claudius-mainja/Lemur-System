from django.db import models
import uuid


class UserGroup(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='user_groups')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=list)
    modules = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_groups'
        unique_together = ['organization', 'name']

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class ModulePermission(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='module_permissions')
    module_name = models.CharField(max_length=50)
    module_display_name = models.CharField(max_length=100)
    features = models.JSONField(default=list)
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'module_permissions'
        unique_together = ['organization', 'module_name']

    def __str__(self):
        return f"{self.module_display_name} - {self.organization.name}"


class SubscriptionPlan(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    modules = models.JSONField(default=list)
    features = models.JSONField(default=list)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_users = models.IntegerField(default=1)
    max_storage_gb = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    is_trial_available = models.BooleanField(default=True)
    trial_days = models.IntegerField(default=14)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subscription_plans'

    def __str__(self):
        return self.name


class TenantSubscription(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    organization = models.OneToOneField('core.Organization', on_delete=models.CASCADE, related_name='tenant_subscription')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, default='trial')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    auto_renew = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenant_subscriptions'

    def __str__(self):
        return f"{self.organization.name} - {self.plan.name}"


class AuditLog(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    organization = models.ForeignKey('core.Organization', on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    user = models.ForeignKey('core.User', on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=50)
    resource_id = models.CharField(max_length=36, blank=True)
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} - {self.resource_type} by {self.user}"
