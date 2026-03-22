from django.db import models
from django.conf import settings


class OrganizationSettings(models.Model):
    organization = models.OneToOneField('core.Organization', on_delete=models.CASCADE, related_name='admin_settings')
    max_users = models.IntegerField(default=10)
    max_modules = models.IntegerField(default=5)
    allow_custom_branding = models.BooleanField(default=False)
    audit_logging_enabled = models.BooleanField(default=True)
    two_factor_required = models.BooleanField(default=False)
    session_timeout_minutes = models.IntegerField(default=60)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admin_organization_settings'

    def __str__(self):
        return f"Settings for {self.organization.name}"


class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=dict)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='admin_roles')
    is_system_role = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admin_roles'
        unique_together = ['name', 'organization']

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class UserActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_activities')
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='admin_activities')
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=100)
    resource_id = models.CharField(max_length=100, blank=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'admin_user_activities'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.created_at}"


class SystemAnnouncement(models.Model):
    ANNOUNCEMENT_TYPES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
        ('maintenance', 'Maintenance'),
    ]
    title = models.CharField(max_length=255)
    message = models.TextField()
    announcement_type = models.CharField(max_length=20, choices=ANNOUNCEMENT_TYPES, default='info')
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='announcements', null=True, blank=True)
    is_global = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_announcements')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'admin_announcements'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.announcement_type})"


class BackupRecord(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='backups')
    backup_type = models.CharField(max_length=50, default='manual')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'admin_backup_records'
        ordering = ['-created_at']

    def __str__(self):
        return f"Backup {self.id} - {self.status}"
