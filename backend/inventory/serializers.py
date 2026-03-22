from rest_framework import serializers
from .models import (
    Category, Product, ProductVariant, Warehouse, WarehouseLocation,
    Stock, StockMovement, Vendor, VendorContact, VendorPerformance,
    PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, StockAlert,
    StockTransfer, StockTransferItem, ReorderRule
)


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    subcategory_count = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True, allow_null=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'parent', 'parent_name',
            'product_count', 'subcategory_count', 'created_at', 'updated_at'
        ]

    def get_product_count(self, obj):
        return obj.products.count()

    def get_subcategory_count(self, obj):
        return obj.subcategories.count()


class ProductVariantSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'product_name', 'name', 'sku', 'attributes', 'stock', 'price']

    def validate_sku(self, value):
        product = self.initial_data.get('product')
        if ProductVariant.objects.filter(product_id=product, sku=value).exists():
            raise serializers.ValidationError("SKU already exists for this product")
        return value


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'description', 'category', 'category_name',
            'unit', 'cost_price', 'selling_price', 'reorder_point',
            'current_stock', 'is_active', 'created_at'
        ]


class ProductDetailSerializer(ProductListSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    total_stock = serializers.SerializerMethodField()

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ['variants', 'total_stock', 'updated_at']

    def get_total_stock(self, obj):
        total = sum(item.available_quantity for item in obj.stock_items.all())
        return float(total)


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    variants_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'description', 'category', 'category_name',
            'unit', 'cost_price', 'selling_price', 'reorder_point',
            'current_stock', 'is_active', 'variants_count', 'organization',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['organization', 'created_at', 'updated_at']

    def get_variants_count(self, obj):
        return obj.variants.count()

    def validate_sku(self, value):
        org = self.context.get('organization')
        if Product.objects.filter(sku=value, organization=org).exists():
            raise serializers.ValidationError("SKU already exists in this organization")
        return value


class WarehouseLocationSerializer(serializers.ModelSerializer):
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    location_code = serializers.SerializerMethodField()

    class Meta:
        model = WarehouseLocation
        fields = [
            'id', 'warehouse', 'warehouse_name', 'zone', 'aisle', 'rack',
            'bin', 'capacity', 'current_stock', 'location_code'
        ]

    def get_location_code(self, obj):
        return f"{obj.zone}-{obj.aisle}-{obj.rack}-{obj.bin}"


class WarehouseSerializer(serializers.ModelSerializer):
    stock_count = serializers.SerializerMethodField()
    location_count = serializers.SerializerMethodField()

    class Meta:
        model = Warehouse
        fields = [
            'id', 'name', 'code', 'address', 'city', 'state', 'country',
            'is_primary', 'stock_count', 'location_count', 'organization',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['organization', 'created_at', 'updated_at']

    def get_stock_count(self, obj):
        return obj.stock_items.count()

    def get_location_count(self, obj):
        return obj.locations.count()


class StockSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    available_quantity = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Stock
        fields = [
            'id', 'product', 'product_name', 'product_sku', 'warehouse',
            'warehouse_name', 'quantity', 'reserved_quantity', 'available_quantity',
            'created_at', 'updated_at'
        ]


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)
    movement_type_display = serializers.CharField(source='get_movement_type_display', read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            'id', 'product', 'product_name', 'quantity', 'movement_type',
            'movement_type_display', 'reference_type', 'reference_id',
            'notes', 'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['created_by', 'organization', 'created_at']


class VendorContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorContact
        fields = ['id', 'vendor', 'name', 'email', 'phone', 'position', 'is_primary']

    def validate_is_primary(self, value):
        if value:
            vendor = self.initial_data.get('vendor')
            if VendorContact.objects.filter(vendor_id=vendor, is_primary=True).exists():
                raise serializers.ValidationError("Primary contact already exists for this vendor")
        return value


class VendorPerformanceSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)

    class Meta:
        model = VendorPerformance
        fields = [
            'id', 'vendor', 'vendor_name', 'rating', 'on_time_delivery',
            'quality_score', 'response_time', 'date', 'notes'
        ]


class VendorSerializer(serializers.ModelSerializer):
    contact_count = serializers.SerializerMethodField()
    performance_count = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = [
            'id', 'name', 'code', 'email', 'phone', 'address', 'city',
            'state', 'country', 'postal_code', 'tax_id', 'payment_terms',
            'rating', 'is_active', 'contact_count', 'performance_count',
            'organization', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organization', 'created_at', 'updated_at']

    def get_contact_count(self, obj):
        return obj.contacts.count()

    def get_performance_count(self, obj):
        return obj.performances.count()

    def validate_code(self, value):
        org = self.context.get('organization')
        if Vendor.objects.filter(code=value, organization=org).exists():
            raise serializers.ValidationError("Vendor code already exists in this organization")
        return value


class VendorDetailSerializer(VendorSerializer):
    contacts = VendorContactSerializer(many=True, read_only=True)
    performances = VendorPerformanceSerializer(many=True, read_only=True)

    class Meta(VendorSerializer.Meta):
        fields = VendorSerializer.Meta.fields + ['contacts', 'performances']


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)

    class Meta:
        model = PurchaseOrderItem
        fields = [
            'id', 'purchase_order', 'product', 'product_name', 'product_sku',
            'description', 'quantity', 'unit_price', 'received_quantity', 'total'
        ]


class PurchaseOrderListSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'order_number', 'vendor', 'vendor_name', 'status', 'status_display',
            'order_date', 'expected_date', 'subtotal', 'tax', 'total', 'notes',
            'created_by_name', 'item_count', 'created_at'
        ]

    def get_item_count(self, obj):
        return obj.items.count()


class PurchaseOrderDetailSerializer(PurchaseOrderListSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    receipt_count = serializers.SerializerMethodField()

    class Meta(PurchaseOrderListSerializer.Meta):
        fields = PurchaseOrderListSerializer.Meta.fields + [
            'items', 'receipt_count', 'updated_at'
        ]

    def get_receipt_count(self, obj):
        return obj.receipts.count()


class PurchaseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'order_number', 'vendor', 'status', 'order_date',
            'expected_date', 'subtotal', 'tax', 'total', 'notes',
            'organization', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organization', 'created_at', 'updated_at']


class PurchaseReceiptItemSerializer(serializers.Serializer):
    purchase_order_item = serializers.IntegerField()
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)


class PurchaseReceiptSerializer(serializers.ModelSerializer):
    purchase_order_number = serializers.CharField(source='purchase_order.order_number', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = PurchaseReceipt
        fields = [
            'id', 'purchase_order', 'purchase_order_number', 'receipt_number',
            'received_date', 'notes', 'created_by', 'created_by_name',
            'organization', 'created_at'
        ]
        read_only_fields = ['created_by', 'organization', 'created_at']


class StockAlertSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    current_stock = serializers.SerializerMethodField()

    class Meta:
        model = StockAlert
        fields = [
            'id', 'product', 'product_name', 'alert_type', 'alert_type_display',
            'threshold', 'is_active', 'current_stock', 'created_at'
        ]

    def get_current_stock(self, obj):
        return float(obj.product.current_stock)


class StockTransferItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)

    class Meta:
        model = StockTransferItem
        fields = ['id', 'stock_transfer', 'product', 'product_name', 'product_sku', 'quantity']


class StockTransferListSerializer(serializers.ModelSerializer):
    from_warehouse_name = serializers.CharField(source='from_warehouse.name', read_only=True)
    to_warehouse_name = serializers.CharField(source='to_warehouse.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = StockTransfer
        fields = [
            'id', 'transfer_number', 'from_warehouse', 'from_warehouse_name',
            'to_warehouse', 'to_warehouse_name', 'status', 'status_display',
            'transfer_date', 'notes', 'created_by_name', 'item_count', 'created_at'
        ]

    def get_item_count(self, obj):
        return obj.items.count()


class StockTransferDetailSerializer(StockTransferListSerializer):
    items = StockTransferItemSerializer(many=True, read_only=True)

    class Meta(StockTransferListSerializer.Meta):
        fields = StockTransferListSerializer.Meta.fields + ['items', 'updated_at']


class StockTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransfer
        fields = [
            'id', 'transfer_number', 'from_warehouse', 'to_warehouse',
            'status', 'transfer_date', 'notes', 'organization',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['organization', 'created_at', 'updated_at']


class ReorderRuleSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    vendor_name = serializers.CharField(source='vendor.name', read_only=True, allow_null=True)
    current_stock = serializers.SerializerMethodField()

    class Meta:
        model = ReorderRule
        fields = [
            'id', 'product', 'product_name', 'product_sku', 'min_quantity',
            'max_quantity', 'reorder_quantity', 'vendor', 'vendor_name',
            'lead_time_days', 'is_active', 'current_stock'
        ]

    def get_current_stock(self, obj):
        return float(obj.product.current_stock)


class ReorderSuggestionSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    product_sku = serializers.CharField()
    current_stock = serializers.DecimalField(max_digits=10, decimal_places=2)
    reorder_point = serializers.IntegerField()
    reorder_quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    vendor_name = serializers.CharField(allow_null=True)
    lead_time_days = serializers.IntegerField()