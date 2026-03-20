from rest_framework import serializers
from .models import Product, Vendor


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'organization_id', 'sku', 'name', 'description', 'category', 'unit',
            'cost_price', 'selling_price', 'quantity_in_stock', 'reorder_level', 'reorder_quantity',
            'max_stock_level', 'warehouse_location', 'barcode', 'weight', 'dimensions',
            'is_taxable', 'tax_rate', 'status', 'image_url', 'notes', 'created_by',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            'id', 'organization_id', 'vendor_code', 'name', 'contact_person', 'email',
            'phone', 'website', 'address', 'city', 'country', 'tax_id', 'payment_terms',
            'bank_details', 'notes', 'rating', 'status', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductStatsSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    active_products = serializers.IntegerField()
    inactive_products = serializers.IntegerField()
    low_stock_count = serializers.IntegerField()
    total_value = serializers.DecimalField(max_digits=14, decimal_places=2)


class VendorStatsSerializer(serializers.Serializer):
    total_vendors = serializers.IntegerField()
    active_vendors = serializers.IntegerField()
    inactive_vendors = serializers.IntegerField()
