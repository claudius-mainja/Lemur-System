from django.db import models
from django.conf import settings
import uuid


class EmailTemplate(models.Model):
    CATEGORY_CHOICES = [
        ('welcome', 'Welcome'),
        ('promotional', 'Promotional'),
        ('newsletter', 'Newsletter'),
        ('announcement', 'Announcement'),
        ('follow_up', 'Follow Up'),
        ('abandoned_cart', 'Abandoned Cart'),
        ('reengagement', 'Re-engagement'),
    ]

    name = models.CharField(max_length=200)
    subject = models.CharField(max_length=300)
    body = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, blank=True)
    preheader_text = models.CharField(max_length=200, blank=True)
    footer_text = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='email_templates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class AudienceSegment(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    criteria = models.JSONField(default=dict)
    contact_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='audience_segments')
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
    subject = models.CharField(max_length=300)
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaigns')
    segment = models.ForeignKey(AudienceSegment, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaigns')
    body = models.TextField()
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    sent_count = models.IntegerField(default=0)
    delivered_count = models.IntegerField(default=0)
    opened_count = models.IntegerField(default=0)
    clicked_count = models.IntegerField(default=0)
    unsubscribed_count = models.IntegerField(default=0)
    bounced_count = models.IntegerField(default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='email_campaigns')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def open_rate(self):
        if self.delivered_count > 0:
            return round((self.opened_count / self.delivered_count) * 100, 2)
        return 0

    @property
    def click_rate(self):
        if self.delivered_count > 0:
            return round((self.clicked_count / self.delivered_count) * 100, 2)
        return 0


class CampaignVariant(models.Model):
    campaign = models.ForeignKey(EmailCampaign, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=300)
    body = models.TextField()
    test_percentage = models.IntegerField(default=50)
    sent_count = models.IntegerField(default=0)
    opened_count = models.IntegerField(default=0)
    clicked_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.campaign.name} - {self.name}"


class Workflow(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    trigger_type = models.CharField(max_length=50)
    trigger_config = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    enrolled_count = models.IntegerField(default=0)
    completed_count = models.IntegerField(default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='workflows')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class WorkflowStep(models.Model):
    ACTION_CHOICES = [
        ('email', 'Send Email'),
        ('wait', 'Wait'),
        ('condition', 'Condition'),
        ('tag', 'Add Tag'),
        ('webhook', 'Webhook'),
    ]

    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='steps')
    name = models.CharField(max_length=200)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    config = models.JSONField(default=dict)
    delay_minutes = models.IntegerField(default=0)
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ['position']


class LandingPage(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    name = models.CharField(max_length=200)
    slug = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    headline = models.CharField(max_length=300, blank=True)
    subheadline = models.TextField(blank=True)
    body_content = models.TextField(blank=True)
    hero_image = models.URLField(blank=True)
    call_to_action_text = models.CharField(max_length=100, default='Get Started')
    call_to_action_url = models.URLField(blank=True)
    form_fields = models.JSONField(default=list)
    thank_you_message = models.TextField(blank=True)
    meta_description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    view_count = models.IntegerField(default=0)
    submission_count = models.IntegerField(default=0)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='landing_pages')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class LandingPageSubmission(models.Model):
    landing_page = models.ForeignKey(LandingPage, on_delete=models.CASCADE, related_name='submissions')
    form_data = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class FormTemplate(models.Model):
    name = models.CharField(max_length=200)
    fields = models.JSONField(default=list)
    style_config = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='form_templates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class MarketingAsset(models.Model):
    ASSET_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('document', 'Document'),
        ('template', 'Template'),
    ]

    name = models.CharField(max_length=200)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPE_CHOICES)
    file = models.FileField(upload_to='marketing/assets/')
    url = models.URLField(blank=True)
    size = models.IntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True)
    tags = models.TextField(blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='marketing_assets')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class ABTest(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('running', 'Running'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=200)
    campaign = models.ForeignKey(EmailCampaign, on_delete=models.CASCADE, related_name='ab_tests')
    subject_a = models.CharField(max_length=300)
    subject_b = models.CharField(max_length=300)
    test_percentage = models.IntegerField(default=20)
    winner_subject = models.CharField(max_length=300, blank=True)
    opens_a = models.IntegerField(default=0)
    opens_b = models.IntegerField(default=0)
    clicks_a = models.IntegerField(default=0)
    clicks_b = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    decided_at = models.DateTimeField(null=True, blank=True)
    organization = models.ForeignKey('core.Organization', on_delete=models.CASCADE, related_name='ab_tests')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def open_rate_a(self):
        return round((self.opens_a / (self.campaign.sent_count * self.test_percentage / 100) * 0.5) * 100, 2) if self.opens_a else 0

    @property
    def open_rate_b(self):
        return round((self.opens_b / (self.campaign.sent_count * self.test_percentage / 100) * 0.5) * 100, 2) if self.opens_b else 0
