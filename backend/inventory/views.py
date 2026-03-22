from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from .models import Category, Product, Warehouse, Stock, StockMovement
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer,
    WarehouseSerializer, StockSerializer, StockMovementSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Category.objects.filter(organization=org).prefetch_related('subcategories', 'products')
        return Category.objects.none()


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['sku', 'name', 'description']
    ordering_fields = ['name', 'unit_price', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Product.objects.filter(organization=org).select_related('category').prefetch_related('stock_items')
        return Product.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        products = Product.objects.filter(organization=org)
        return Response({
            'total_products': products.count(),
            'active_products': products.filter(status='active').count(),
            'low_stock': Stock.objects.filter(
                organization=org,
                available_quantity__lte=models.F('product__reorder_level')
            ).count(),
            'out_of_stock': Stock.objects.filter(
                organization=org,
                available_quantity=0
            ).count(),
        })

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        product = self.get_object()
        warehouse_id = request.data.get('warehouse')
        quantity = request.data.get('quantity')
        notes = request.data.get('notes', '')

        if not warehouse_id or not quantity:
            return Response({'error': 'warehouse and quantity are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            warehouse = Warehouse.objects.get(id=warehouse_id, organization=product.organization)
        except Warehouse.DoesNotExist:
            return Response({'error': 'Warehouse not found'}, status=status.HTTP_400_BAD_REQUEST)

        stock, _ = Stock.objects.get_or_create(
            product=product,
            warehouse=warehouse,
            organization=product.organization
        )
        stock.quantity += float(quantity)
        stock.save()

        StockMovement.objects.create(
            product=product,
            warehouse=warehouse,
            movement_type='adjustment',
            quantity=quantity,
            notes=notes,
            organization=product.organization
        )

        return Response(StockSerializer(stock).data)


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'country']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Warehouse.objects.filter(organization=org).prefetch_related('stock_items')
        return Warehouse.objects.none()


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product__name', 'product__sku', 'warehouse__name']
    ordering_fields = ['quantity', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Stock.objects.filter(organization=org).select_related('product', 'warehouse')
        return Stock.objects.none()

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        stocks = Stock.objects.filter(
            organization=org
        ).select_related('product', 'warehouse').filter(
            available_quantity__lte=models.F('product__reorder_level')
        )
        return Response(StockSerializer(stocks, many=True).data)


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product__name', 'reference']
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return StockMovement.objects.filter(organization=org).select_related('product', 'warehouse')
        return StockMovement.objects.none()
