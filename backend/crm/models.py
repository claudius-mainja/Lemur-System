from django.db import models
from django.conf import settings
from django.utils import timezone


class Lead(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]

    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('social_media', 'Social Media'),
        ('email_campaign', 'Email Campaign'),
        ('cold_call', 'Cold Call'),
        ('trade_show', 'Trade Show'),
        ('partner', 'Partner'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    score = models.IntegerField(default=0)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_leads'
    )
    notes = models.TextField(blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='leads')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def converted_contact(self):
        return hasattr(self, 'converted_to_contact') and self.converted_to_contact

    def calculate_score(self):
        score = 0
        if self.email:
            score += 10
        if self.phone:
            score += 10
        if self.company:
            score += 15
        
        activities_count = self.activities.count()
        if activities_count > 0:
            score += min(activities_count * 5, 30)
        
        score += {
            'new': 0,
            'contacted': 15,
            'qualified': 30,
            'proposal': 50,
            'negotiation': 70,
            'won': 100,
            'lost': 0,
        }.get(self.status, 0)
        
        self.score = score
        self.save()
        return score


class LeadActivity(models.Model):
    ACTIVITY_TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
        ('task', 'Task'),
        ('sms', 'SMS'),
        ('demo', 'Demo'),
    ]

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES)
    subject = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    outcome = models.CharField(max_length=100, blank=True)
    duration = models.IntegerField(default=0, help_text='Duration in minutes')
    scheduled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='lead_activities'
    )
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='lead_activities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.lead.name} - {self.subject}"


class Contact(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, blank=True)
    position = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='crm_contacts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_primary', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class ContactHistory(models.Model):
    ACTION_CHOICES = [
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('email_sent', 'Email Sent'),
        ('email_opened', 'Email Opened'),
        ('email_clicked', 'Email Clicked'),
        ('call_made', 'Call Made'),
        ('call_received', 'Call Received'),
        ('meeting_scheduled', 'Meeting Scheduled'),
        ('meeting_completed', 'Meeting Completed'),
        ('note_added', 'Note Added'),
        ('status_changed', 'Status Changed'),
        ('assigned', 'Assigned'),
        ('converted_from_lead', 'Converted from Lead'),
    ]

    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    description = models.TextField(blank=True)
    old_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='contact_history_entries'
    )
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='contact_history')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.contact.full_name} - {self.action}"


class Opportunity(models.Model):
    STAGE_CHOICES = [
        ('prospecting', 'Prospecting'),
        ('qualification', 'Qualification'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('closed_won', 'Closed Won'),
        ('closed_lost', 'Closed Lost'),
    ]

    name = models.CharField(max_length=200)
    customer = models.ForeignKey('finance.Customer', on_delete=models.CASCADE, related_name='crm_opportunities', null=True, blank=True)
    contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, null=True, blank=True, related_name='opportunities')
    value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    probability = models.IntegerField(default=0)
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='prospecting')
    expected_close_date = models.DateField(null=True, blank=True)
    actual_close_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_opportunities'
    )
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='crm_opportunities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def weighted_value(self):
        return self.value * (self.probability / 100)

    def update_probability(self):
        stage_probabilities = {
            'prospecting': 10,
            'qualification': 25,
            'proposal': 50,
            'negotiation': 75,
            'closed_won': 100,
            'closed_lost': 0,
        }
        self.probability = stage_probabilities.get(self.stage, 0)
        self.save()
        return self.probability


class StageConfiguration(models.Model):
    name = models.CharField(max_length=100)
    stage_key = models.CharField(max_length=30, unique=True)
    probability = models.IntegerField(default=0)
    color = models.CharField(max_length=7, default='#808080')
    order = models.IntegerField(default=0)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='stage_configurations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        unique_together = ['organization', 'stage_key']

    def __str__(self):
        return self.name

    @classmethod
    def create_defaults(cls, organization):
        defaults = [
            {'name': 'Prospecting', 'stage_key': 'prospecting', 'probability': 10, 'color': '#6c757d', 'order': 1},
            {'name': 'Qualification', 'stage_key': 'qualification', 'probability': 25, 'color': '#17a2b8', 'order': 2},
            {'name': 'Proposal', 'stage_key': 'proposal', 'probability': 50, 'color': '#007bff', 'order': 3},
            {'name': 'Negotiation', 'stage_key': 'negotiation', 'probability': 75, 'color': '#ffc107', 'order': 4},
            {'name': 'Closed Won', 'stage_key': 'closed_won', 'probability': 100, 'color': '#28a745', 'order': 5},
            {'name': 'Closed Lost', 'stage_key': 'closed_lost', 'probability': 0, 'color': '#dc3545', 'order': 6},
        ]
        for default in defaults:
            cls.objects.get_or_create(
                organization=organization,
                stage_key=default['stage_key'],
                defaults={
                    'name': default['name'],
                    'probability': default['probability'],
                    'color': default['color'],
                    'order': default['order'],
                    'is_default': True,
                }
            )


class DealHistory(models.Model):
    ACTION_CHOICES = [
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('stage_changed', 'Stage Changed'),
        ('value_changed', 'Value Changed'),
        ('assigned', 'Assigned'),
        ('note_added', 'Note Added'),
        ('contact_added', 'Contact Added'),
        ('closed_won', 'Closed Won'),
        ('closed_lost', 'Closed Lost'),
        ('reopened', 'Reopened'),
    ]

    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    description = models.TextField(blank=True)
    old_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='deal_history_entries'
    )
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='deal_history')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.opportunity.name} - {self.action}"


class EmailTemplate(models.Model):
    CATEGORY_CHOICES = [
        ('welcome', 'Welcome'),
        ('follow_up', 'Follow Up'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('thank_you', 'Thank You'),
        ('reengagement', 'Reengagement'),
        ('newsletter', 'Newsletter'),
        ('announcement', 'Announcement'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    subject = models.CharField(max_length=500)
    body = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    variables = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='crm_email_templates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class EmailCampaign(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=200)
    subject = models.CharField(max_length=500)
    body = models.TextField()
    template = models.ForeignKey(
        EmailTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='campaigns'
    )
    target_segment = models.CharField(max_length=100, blank=True)
    sent_count = models.IntegerField(default=0)
    delivered_count = models.IntegerField(default=0)
    open_count = models.IntegerField(default=0)
    click_count = models.IntegerField(default=0)
    bounce_count = models.IntegerField(default=0)
    unsubscribe_count = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='email_campaigns'
    )
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='crm_email_campaigns')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def open_rate(self):
        if self.delivered_count == 0:
            return 0
        return round((self.open_count / self.delivered_count) * 100, 2)

    @property
    def click_rate(self):
        if self.delivered_count == 0:
            return 0
        return round((self.click_count / self.delivered_count) * 100, 2)


class EmailLog(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
        ('bounced', 'Bounced'),
        ('unsubscribed', 'Unsubscribed'),
        ('failed', 'Failed'),
    ]

    campaign = models.ForeignKey(
        EmailCampaign,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='logs'
    )
    template = models.ForeignKey(
        EmailTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='logs'
    )
    recipient_email = models.EmailField()
    recipient_name = models.CharField(max_length=200, blank=True)
    subject = models.CharField(max_length=500)
    body = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    bounced_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    lead = models.ForeignKey(
        Lead,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='email_logs'
    )
    contact = models.ForeignKey(
        Contact,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='email_logs'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='email_logs'
    )
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='email_logs')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient_email} - {self.status}"


class SalesDashboard(models.Model):
    date = models.DateField()
    total_leads = models.IntegerField(default=0)
    new_leads = models.IntegerField(default=0)
    qualified_leads = models.IntegerField(default=0)
    active_opportunities = models.IntegerField(default=0)
    pipeline_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    closed_won_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    closed_lost_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_deal_size = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='sales_dashboards')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['organization', 'date']

    def __str__(self):
        return f"Dashboard - {self.date}"

    @classmethod
    def update_daily_metrics(cls, organization):
        from django.db.models import Sum, Count, Avg
        from django.db.models.functions import Coalesce
        from decimal import Decimal
        
        today = timezone.now().date()
        
        leads = Lead.objects.filter(organization=organization)
        opportunities = Opportunity.objects.filter(organization=organization)
        
        won_opps = opportunities.filter(stage='closed_won', actual_close_date=today)
        lost_opps = opportunities.filter(stage='closed_lost', actual_close_date=today)
        
        total_closed = won_opps.count() + lost_opps.count()
        conversion_rate = Decimal('0')
        if total_closed > 0:
            conversion_rate = Decimal(str(round((won_opps.count() / total_closed) * 100, 2)))
        
        avg_deal = opportunities.filter(
            stage='closed_won'
        ).aggregate(avg=Coalesce(Avg('value'), Decimal('0')))['avg'] or Decimal('0')
        
        active_pipeline_value = opportunities.exclude(
            stage__in=['closed_won', 'closed_lost']
        ).aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or Decimal('0')
        
        dashboard, _ = cls.objects.update_or_create(
            organization=organization,
            date=today,
            defaults={
                'total_leads': leads.count(),
                'new_leads': leads.filter(status='new', created_at__date=today).count(),
                'qualified_leads': leads.filter(status__in=['qualified', 'proposal', 'negotiation']).count(),
                'active_opportunities': opportunities.exclude(
                    stage__in=['closed_won', 'closed_lost']
                ).count(),
                'pipeline_value': active_pipeline_value,
                'closed_won_value': won_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or Decimal('0'),
                'closed_lost_value': lost_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or Decimal('0'),
                'conversion_rate': conversion_rate,
                'average_deal_size': avg_deal,
            }
        )
        return dashboard
