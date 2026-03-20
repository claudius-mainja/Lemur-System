"""
Document Management Module Models
==================================
Handles file storage, versioning, and document organization.
Supports folders, tags, and access control.
"""
import uuid
from django.db import models


class Document(models.Model):
    """
    Document/file storage with metadata and versioning.
    Supports various document types and folder organization.
    """
    DOC_TYPE_CHOICES = [
        ('contract', 'Contract'),
        ('invoice', 'Invoice'),
        ('report', 'Report'),
        ('policy', 'Policy'),
        ('procedure', 'Procedure'),
        ('form', 'Form'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    doc_type = models.CharField(max_length=20, choices=DOC_TYPE_CHOICES, default='other')
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    file_size = models.BigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True, null=True)
    version = models.CharField(max_length=20, default='1.0')
    is_public = models.BooleanField(default=False)
    folder = models.CharField(max_length=255, blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    uploaded_by = models.UUIDField(db_index=True, blank=True, null=True)
    uploaded_by_name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'documents'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
