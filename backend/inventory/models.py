"""
Inventory Module Models
========================
Manages products, stock levels, and vendor relationships.
Supports stock alerts and reorder management.
"""
import uuid
from django.db import models


class Product(models.Model):
    """
    Product catalog with inventory tracking.
    Manages stock levels, pricing, and warehouse locations.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('discontinued', 'Discontinued'),
    ]

    CATEGORY_CHOICES = [
        ('raw_materials', 'Raw Materials'),
        ('finished_goods', 'Finished Goods'),
        ('components', 'Components'),
        ('packaging', 'Packaging'),
        ('consumables', 'Consumables'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    sku = models.CharField(max_length=100, db_index=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    unit = models.CharField(max_length=50, default='unit')
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    quantity_in_stock = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)
    reorder_quantity = models.IntegerField(default=20)
    max_stock_level = models.IntegerField(blank=True, null=True)
    warehouse_location = models.CharField(max_length=100, blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    dimensions = models.CharField(max_length=100, blank=True, null=True)
    is_taxable = models.BooleanField(default=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    image_url = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_by = models.UUIDField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['name']
        verbose_name_plural = 'Products'

    def __str__(self):
        return f"{self.name} ({self.sku})"


class Vendor(models.Model):
    """
    Supplier/vendor records for procurement.
    Tracks vendor details, payment terms, and ratings.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('blocked', 'Blocked'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    vendor_code = models.CharField(max_length=50, db_index=True)
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    payment_terms = models.CharField(max_length=50, blank=True, null=True)
    bank_details = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_by = models.UUIDField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vendors'
        ordering = ['name']

    def __str__(self):
        return self.name
