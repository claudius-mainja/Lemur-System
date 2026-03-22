from django.db import models
from django.conf import settings
import uuid


class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('pending_customer', 'Pending Customer'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    SOURCE_CHOICES = [
        ('email', 'Email'),
        ('portal', 'Portal'),
        ('chat', 'Live Chat'),
        ('phone', 'Phone'),
        ('api', 'API'),
    ]

    ticket_number = models.CharField(max_length=50, unique=True)
    subject = models.CharField(max_length=500)
    description = models.TextField()
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='portal')
    category = models.CharField(max_length=100, blank=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='tickets')
    first_response_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ticket_number} - {self.subject[:50]}"

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = f"TKT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class TicketReply(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='replies')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    is_internal = models.BooleanField(default=False)
    attachments = models.FileField(upload_to='tickets/attachments/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']


class TicketComment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']


class SLAConfig(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    response_time_hours = models.IntegerField()
    resolution_time_hours = models.IntegerField()
    priority = models.CharField(max_length=20, choices=Ticket.PRIORITY_CHOICES)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='sla_configs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['priority', 'name']

    def __str__(self):
        return f"{self.name} ({self.priority})"


class SLAViolation(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='sla_violations')
    sla_config = models.ForeignKey(SLAConfig, on_delete=models.CASCADE)
    violation_type = models.CharField(max_length=50)
    expected_time = models.DateTimeField()
    actual_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class KnowledgeBaseCategory(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    order = models.IntegerField(default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='kb_categories')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class KnowledgeBaseArticle(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=100, unique=True)
    content = models.TextField()
    summary = models.TextField(blank=True)
    category = models.ForeignKey(KnowledgeBaseCategory, on_delete=models.SET_NULL, null=True, related_name='articles')
    tags = models.TextField(blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    view_count = models.IntegerField(default=0)
    helpful_yes = models.IntegerField(default=0)
    helpful_no = models.IntegerField(default=0)
    related_articles = models.ManyToManyField('self', blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='kb_articles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class ArticleFeedback(models.Model):
    article = models.ForeignKey(KnowledgeBaseArticle, on_delete=models.CASCADE, related_name='feedbacks')
    helpful = models.BooleanField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class EscalationRule(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    trigger_condition = models.JSONField(default=dict)
    escalation_level = models.IntegerField(default=1)
    target_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    notify_manager = models.BooleanField(default=False)
    priority_boost = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='escalation_rules')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['escalation_level']

    def __str__(self):
        return f"{self.name} (Level {self.escalation_level})"


class EscalationHistory(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='escalations')
    rule = models.ForeignKey(EscalationRule, on_delete=models.CASCADE)
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='escalated_from')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='escalated_to')
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class ServiceReport(models.Model):
    name = models.CharField(max_length=200)
    report_type = models.CharField(max_length=50)
    date_from = models.DateField()
    date_to = models.DateField()
    data = models.JSONField(default=dict)
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='service_reports')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class CustomerPortal(models.Model):
    customer_email = models.EmailField()
    customer_name = models.CharField(max_length=200)
    access_token = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    last_access = models.DateTimeField(null=True, blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='customer_portals')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.access_token:
            self.access_token = uuid.uuid4().hex
        super().save(*args, **kwargs)

    def __str__(self):
        return self.customer_name


class SatisfactionSurvey(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='surveys')
    rating = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])
    feedback = models.TextField(blank=True)
    response_time_rating = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True, blank=True)
    resolution_rating = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True, blank=True)
    agent_rating = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
