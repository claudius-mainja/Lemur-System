from rest_framework import serializers
from .models import Category, Product, Warehouse, Stock, StockMovement


class StockSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)

    class Meta:
        model = Stock
        fields = [
            'id', 'product', 'product_name', 'warehouse', 'warehouse_name',
            'quantity', 'reserved_quantity', 'available_quantity',
            'created_at', 'updated_at'
        ]


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            'id', 'product', 'product_name', 'warehouse', 'warehouse_name',
            'movement_type', 'quantity', 'reference', 'notes',
            'created_at'
        ]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    total_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'description', 'category', 'category_name',
            'unit_price', 'cost_price', 'unit', 'reorder_level', 'status',
            'total_stock', 'created_at', 'updated_at'
        ]

    def get_total_stock(self, obj):
        return float(sum(s.available_quantity for s in obj.stock_items.all()))


class ProductDetailSerializer(ProductSerializer):
    stock_items = StockSerializer(many=True, read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['stock_items']


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    subcategory_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'parent', 'product_count',
            'subcategory_count', 'created_at', 'updated_at'
        ]

    def get_product_count(self, obj):
        return obj.products.count()

    def get_subcategory_count(self, obj):
        return obj.subcategories.count()


class WarehouseSerializer(serializers.ModelSerializer):
    stock_count = serializers.SerializerMethodField()

    class Meta:
        model = Warehouse
        fields = [
            'id', 'name', 'address', 'city', 'country', 'is_default',
            'stock_count', 'created_at', 'updated_at'
        ]

    def get_stock_count(self, obj):
        return obj.stock_items.count()
