"""
Productivity Module Models
===========================
Task management, project tracking, and meeting scheduling.
Supports team collaboration and time tracking.
"""
import uuid
from django.db import models


class Task(models.Model):
    """
    Task assignments for team members.
    Tracks priority, status, time estimates, and completion.
    """
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'Review'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='tasks', blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.UUIDField(db_index=True, blank=True, null=True)
    assigned_name = models.CharField(max_length=255, blank=True, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    due_date = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    estimated_hours = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    actual_hours = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    created_by = models.UUIDField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Meeting(models.Model):
    """
    Meeting/scheduler for team collaboration.
    Supports video calls, in-person, and recurring meetings.
    """
    MEETING_TYPE_CHOICES = [
        ('video', 'Video Call'),
        ('audio', 'Audio Call'),
        ('in_person', 'In Person'),
        ('conference', 'Conference'),
    ]

    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    RECURRENCE_CHOICES = [
        ('none', 'None'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('biweekly', 'Bi-Weekly'),
        ('monthly', 'Monthly'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    meeting_type = models.CharField(max_length=20, choices=MEETING_TYPE_CHOICES, default='video')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    timezone = models.CharField(max_length=50, default='UTC')
    location = models.CharField(max_length=255, blank=True, null=True)
    meeting_link = models.URLField(blank=True, null=True)
    organizer_id = models.UUIDField(db_index=True)
    organizer_name = models.CharField(max_length=255)
    attendees = models.JSONField(blank=True, null=True)
    recurring = models.CharField(max_length=20, choices=RECURRENCE_CHOICES, default='none')
    project = models.ForeignKey('Project', on_delete=models.SET_NULL, related_name='meetings', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True, null=True)
    agenda = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'meetings'
        ordering = ['-start_time']

    def __str__(self):
        return self.title


class Project(models.Model):
    """
    Project management with budget tracking and team assignments.
    Tracks project lifecycle from planning to completion.
    """
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    project_code = models.CharField(max_length=50, db_index=True, blank=True, null=True)
    client_name = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    budget = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    owner_id = models.UUIDField(db_index=True, blank=True, null=True)
    owner_name = models.CharField(max_length=255, blank=True, null=True)
    team_members = models.JSONField(blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    progress = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    created_by = models.UUIDField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']

    def __str__(self):
        return self.name
