"""
CRM Module Models
=================
Customer Relationship Management: Customers, Leads, Deals, Activities, Contacts.
Manages sales pipeline, customer interactions, and business relationships.
"""
import uuid
from django.db import models


class Customer(models.Model):
    """
    Customer records with spending history and contact management.
    Tracks customer lifecycle from prospect to active customer.
    """
    TYPE_CHOICES = [('customer', 'Customer'), ('prospect', 'Prospect')]
    STATUS_CHOICES = [('active', 'Active'), ('inactive', 'Inactive')]
    SOURCE_CHOICES = [('manual', 'Manual'), ('website', 'Website'), ('referral', 'Referral'), ('social', 'Social Media')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=3, default='ZA')
    service_type = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='customer')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='manual')
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_contact = models.DateTimeField(blank=True, null=True)
    assigned_to = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customers'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Lead(models.Model):
    """
    Sales leads that may convert to customers.
    Tracks lead source, value estimation, and qualification status.
    """
    STATUS_CHOICES = [('new', 'New'), ('contacted', 'Contacted'), ('qualified', 'Qualified'), ('lost', 'Lost')]
    SOURCE_CHOICES = [('website', 'Website'), ('referral', 'Referral'), ('social', 'Social Media'), ('cold_call', 'Cold Call')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='website')
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    assigned_to = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Deal(models.Model):
    """
    Sales opportunities in the pipeline.
    Tracks deal value, stage, probability, and expected close date.
    """
    STAGE_CHOICES = [('prospecting', 'Prospecting'), ('proposal', 'Proposal'), ('negotiation', 'Negotiation'), ('won', 'Won'), ('lost', 'Lost')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    title = models.CharField(max_length=255)
    customer_id = models.UUIDField(db_index=True, blank=True, null=True)
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='ZAR')
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='prospecting')
    probability = models.IntegerField(default=10)
    expected_close = models.DateField(blank=True, null=True)
    closed_at = models.DateTimeField(blank=True, null=True)
    assigned_to = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'deals'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Activity(models.Model):
    """
    Customer interactions and follow-up tasks.
    Links to customers, leads, and deals for activity tracking.
    """
    TYPE_CHOICES = [('call', 'Call'), ('email', 'Email'), ('meeting', 'Meeting'), ('task', 'Task'), ('note', 'Note')]
    STATUS_CHOICES = [('pending', 'Pending'), ('completed', 'Completed')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    customer_id = models.UUIDField(db_index=True, blank=True, null=True)
    lead_id = models.UUIDField(db_index=True, blank=True, null=True)
    deal_id = models.UUIDField(db_index=True, blank=True, null=True)
    assigned_to = models.CharField(max_length=100, blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activities'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Contact(models.Model):
    """
    Contact persons associated with customers or companies.
    Used for communication and relationship management.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    customer_id = models.UUIDField(db_index=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'contacts'
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
