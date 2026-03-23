from django.db import models
import uuid


class AutomationSetting(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='automation_settings')
    module = models.CharField(max_length=50)
    setting_name = models.CharField(max_length=100)
    setting_key = models.CharField(max_length=100)
    value = models.JSONField(default=dict)
    is_automated = models.BooleanField(default=True)
    is_enabled = models.BooleanField(default=True)
    schedule = models.JSONField(default=dict)
    notification = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'automation_settings'
        unique_together = ['organization', 'module', 'setting_key']

    def __str__(self):
        return f"{self.setting_name} - {self.module}"


class Workflow(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]
    
    TRIGGER_CHOICES = [
        ('manual', 'Manual'),
        ('scheduled', 'Scheduled'),
        ('event', 'Event Based'),
        ('condition', 'Condition Based'),
    ]

    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='auto_workflows')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    module = models.CharField(max_length=50)
    trigger_type = models.CharField(max_length=50, choices=TRIGGER_CHOICES, default='manual')
    trigger_config = models.JSONField(default=dict)
    actions = models.JSONField(default=list)
    conditions = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_automated = models.BooleanField(default=True)
    run_count = models.IntegerField(default=0)
    last_run_at = models.DateTimeField(null=True, blank=True)
    next_run_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey('core.User', on_delete=models.SET_NULL, null=True, related_name='created_workflows')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'automation_workflows'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.module}"


class WorkflowLog(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='logs')
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='workflow_logs')
    trigger_data = models.JSONField(default=dict)
    execution_data = models.JSONField(default=dict)
    result_data = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration_ms = models.IntegerField(default=0)

    class Meta:
        db_table = 'automation_workflow_logs'
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.workflow.name} - {self.status}"


class ScheduledTask(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    TASK_TYPE_CHOICES = [
        ('email', 'Email'),
        ('report', 'Report Generation'),
        ('sync', 'Data Sync'),
        ('backup', 'Backup'),
        ('cleanup', 'Cleanup'),
        ('notification', 'Notification'),
        ('payroll', 'Payroll Processing'),
        ('invoice', 'Invoice Generation'),
        ('reminder', 'Reminder'),
        ('custom', 'Custom'),
    ]

    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='scheduled_tasks')
    name = models.CharField(max_length=200)
    task_type = models.CharField(max_length=50, choices=TASK_TYPE_CHOICES)
    module = models.CharField(max_length=50, blank=True)
    config = models.JSONField(default=dict)
    cron_expression = models.CharField(max_length=100, blank=True)
    interval_minutes = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_automated = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    last_run_at = models.DateTimeField(null=True, blank=True)
    next_run_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey('core.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'automation_scheduled_tasks'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.task_type}"


class NotificationTemplate(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='notification_templates')
    name = models.CharField(max_length=200)
    template_type = models.CharField(max_length=50)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    variables = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'automation_notification_templates'

    def __str__(self):
        return self.name


class AutomationAction(models.Model):
    ACTION_TYPES = [
        ('email', 'Send Email'),
        ('create', 'Create Record'),
        ('update', 'Update Record'),
        ('delete', 'Delete Record'),
        ('notify', 'Send Notification'),
        ('webhook', 'Call Webhook'),
        ('approve', 'Request Approval'),
        ('assign', 'Assign Task'),
    ]

    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='workflow_actions')
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    config = models.JSONField(default=dict)
    order = models.IntegerField(default=0)
    is_automated = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'automation_actions'
        ordering = ['order']

    def __str__(self):
        return f"{self.get_action_type_display()} - Order: {self.order}"
