from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, F
from django.db import models
from django.utils import timezone
from datetime import date
import uuid

from .models import (
    Category, Product, ProductVariant, Warehouse, WarehouseLocation,
    Stock, StockMovement, Vendor, VendorContact, VendorPerformance,
    PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, StockAlert,
    StockTransfer, StockTransferItem, ReorderRule
)
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer,
    ProductVariantSerializer, WarehouseSerializer, WarehouseLocationSerializer,
    StockSerializer, StockMovementSerializer, VendorSerializer, VendorDetailSerializer,
    VendorContactSerializer, VendorPerformanceSerializer, PurchaseOrderSerializer,
    PurchaseOrderDetailSerializer, PurchaseOrderItemSerializer, PurchaseReceiptSerializer,
    StockAlertSerializer, StockTransferSerializer, StockTransferDetailSerializer,
    StockTransferItemSerializer, ReorderRuleSerializer, ReorderSuggestionSerializer
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

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['sku', 'name', 'description']
    ordering_fields = ['name', 'selling_price', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Product.objects.filter(organization=org).select_related('category').prefetch_related('variants', 'stock_items')
        return Product.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org)

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        product = self.get_object()
        quantity = request.data.get('quantity')
        notes = request.data.get('notes', '')
        movement_type = request.data.get('movement_type', 'adjustment')

        if not quantity:
            return Response({'error': 'quantity is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = float(quantity)
        except ValueError:
            return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

        product.current_stock += quantity
        product.save()

        StockMovement.objects.create(
            product=product,
            quantity=abs(quantity),
            movement_type=movement_type,
            notes=notes,
            created_by=request.user,
            organization=product.organization
        )

        return Response(ProductSerializer(product).data)


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'product__name']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return ProductVariant.objects.filter(product__organization=org).select_related('product')
        return ProductVariant.objects.none()


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'city', 'country']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Warehouse.objects.filter(organization=org).prefetch_related('stock_items', 'locations')
        return Warehouse.objects.none()

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org)


class WarehouseLocationViewSet(viewsets.ModelViewSet):
    queryset = WarehouseLocation.objects.all()
    serializer_class = WarehouseLocationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['warehouse__name', 'zone', 'aisle', 'rack', 'bin']
    ordering_fields = ['warehouse', 'zone', 'aisle', 'rack', 'bin']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return WarehouseLocation.objects.filter(warehouse__organization=org).select_related('warehouse')
        return WarehouseLocation.objects.none()


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
            organization=org,
            available_quantity__lte=models.F('product__reorder_point')
        ).select_related('product', 'warehouse')
        return Response(StockSerializer(stocks, many=True).data)


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product__name', 'reference_type', 'reference_id']
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return StockMovement.objects.filter(organization=org).select_related('product', 'created_by')
        return StockMovement.objects.none()

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(created_by=self.request.user, organization=org)


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'email', 'phone']
    ordering_fields = ['name', 'rating', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Vendor.objects.filter(organization=org).prefetch_related('contacts', 'performances')
        return Vendor.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VendorDetailSerializer
        return VendorSerializer

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org)


class VendorContactViewSet(viewsets.ModelViewSet):
    queryset = VendorContact.objects.all()
    serializer_class = VendorContactSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'is_primary']

    def get_queryset(self):
        return VendorContact.objects.filter(vendor__organization=getattr(self.request.user, 'organization', None))


class VendorPerformanceViewSet(viewsets.ModelViewSet):
    queryset = VendorPerformance.objects.all()
    serializer_class = VendorPerformanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['vendor__name', 'notes']
    ordering_fields = ['date', 'rating']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return VendorPerformance.objects.filter(vendor__organization=org).select_related('vendor')
        return VendorPerformance.objects.none()


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['order_number', 'vendor__name', 'notes']
    ordering_fields = ['order_date', 'created_at', 'status']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return PurchaseOrder.objects.filter(organization=org).select_related('vendor', 'created_by').prefetch_related('items', 'receipts')
        return PurchaseOrder.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PurchaseOrderDetailSerializer
        return PurchaseOrderSerializer

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        order_number = f"PO-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(
            organization=org,
            created_by=self.request.user,
            order_number=order_number
        )

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        purchase_order = self.get_object()
        serializer = PurchaseOrderItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(purchase_order=purchase_order)
        
        purchase_order.subtotal = sum(item.total for item in purchase_order.items.all())
        purchase_order.total = purchase_order.subtotal + purchase_order.tax
        purchase_order.save()
        
        return Response(PurchaseOrderDetailSerializer(purchase_order).data)

    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        purchase_order = self.get_object()
        items_data = request.data.get('items', [])
        
        receipt_number = f"PR-{uuid.uuid4().hex[:8].upper()}"
        receipt = PurchaseReceipt.objects.create(
            purchase_order=purchase_order,
            receipt_number=receipt_number,
            received_date=date.today(),
            notes=request.data.get('notes', ''),
            created_by=request.user,
            organization=purchase_order.organization
        )
        
        for item_data in items_data:
            item = PurchaseOrderItem.objects.get(
                id=item_data.get('purchase_order_item'),
                purchase_order=purchase_order
            )
            received_qty = float(item_data.get('quantity', 0))
            item.received_quantity += received_qty
            item.save()
            
            stock, _ = Stock.objects.get_or_create(
                product=item.product,
                warehouse=Warehouse.objects.filter(
                    organization=purchase_order.organization,
                    is_primary=True
                ).first() or Warehouse.objects.filter(
                    organization=purchase_order.organization
                ).first(),
                organization=purchase_order.organization
            )
            stock.quantity += received_qty
            stock.save()
            
            item.product.current_stock += received_qty
            item.product.save()
            
            StockMovement.objects.create(
                product=item.product,
                quantity=received_qty,
                movement_type='in',
                reference_type='PurchaseReceipt',
                reference_id=str(receipt.id),
                notes=f"Received from PO {purchase_order.order_number}",
                created_by=request.user,
                organization=purchase_order.organization
            )
        
        all_received = all(
            item.quantity == item.received_quantity 
            for item in purchase_order.items.all()
        )
        any_received = any(
            item.received_quantity > 0 
            for item in purchase_order.items.all()
        )
        
        if all_received:
            purchase_order.status = 'received'
        elif any_received:
            purchase_order.status = 'partially_received'
        purchase_order.save()
        
        return Response(PurchaseReceiptSerializer(receipt).data)


class PurchaseReceiptViewSet(viewsets.ModelViewSet):
    queryset = PurchaseReceipt.objects.all()
    serializer_class = PurchaseReceiptSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['receipt_number', 'purchase_order__order_number']
    ordering_fields = ['received_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return PurchaseReceipt.objects.filter(organization=org).select_related('purchase_order', 'created_by')
        return PurchaseReceipt.objects.none()

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        receipt_number = f"PR-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(
            created_by=self.request.user,
            organization=org,
            receipt_number=receipt_number
        )


class StockAlertViewSet(viewsets.ModelViewSet):
    queryset = StockAlert.objects.all()
    serializer_class = StockAlertSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product__name', 'alert_type']
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return StockAlert.objects.filter(product__organization=org, is_active=True).select_related('product')
        return StockAlert.objects.none()

    @action(detail=False, methods=['post'])
    def generate_alerts(self, request):
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)

        products = Product.objects.filter(organization=org, is_active=True)
        created_alerts = []

        for product in products:
            if product.current_stock <= 0:
                alert_type = 'out_of_stock'
            elif product.current_stock <= product.reorder_point:
                alert_type = 'low_stock'
            else:
                continue

            alert, created = StockAlert.objects.update_or_create(
                product=product,
                alert_type=alert_type,
                defaults={
                    'threshold': product.reorder_point,
                    'is_active': True
                }
            )
            if created:
                created_alerts.append(alert)

        return Response({
            'created': len(created_alerts),
            'message': f'Generated {len(created_alerts)} stock alerts'
        })


class StockTransferViewSet(viewsets.ModelViewSet):
    queryset = StockTransfer.objects.all()
    serializer_class = StockTransferSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['transfer_number', 'from_warehouse__name', 'to_warehouse__name']
    ordering_fields = ['transfer_date', 'created_at', 'status']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return StockTransfer.objects.filter(organization=org).select_related(
                'from_warehouse', 'to_warehouse', 'created_by'
            ).prefetch_related('items')
        return StockTransfer.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StockTransferDetailSerializer
        return StockTransferSerializer

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        transfer_number = f"ST-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(
            organization=org,
            created_by=self.request.user,
            transfer_number=transfer_number
        )

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        stock_transfer = self.get_object()
        serializer = StockTransferItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(stock_transfer=stock_transfer)
        return Response(StockTransferDetailSerializer(stock_transfer).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        stock_transfer = self.get_object()
        
        if stock_transfer.status == 'completed':
            return Response({'error': 'Transfer already completed'}, status=status.HTTP_400_BAD_REQUEST)

        for item in stock_transfer.items.all():
            from_stock = Stock.objects.filter(
                product=item.product,
                warehouse=stock_transfer.from_warehouse,
                organization=stock_transfer.organization
            ).first()
            
            if from_stock and from_stock.available_quantity >= item.quantity:
                from_stock.quantity -= item.quantity
                from_stock.save()
                
                to_stock, _ = Stock.objects.get_or_create(
                    product=item.product,
                    warehouse=stock_transfer.to_warehouse,
                    organization=stock_transfer.organization
                )
                to_stock.quantity += item.quantity
                to_stock.save()
                
                StockMovement.objects.create(
                    product=item.product,
                    quantity=item.quantity,
                    movement_type='out',
                    reference_type='StockTransfer',
                    reference_id=str(stock_transfer.id),
                    notes=f"Transfer out: {stock_transfer.transfer_number}",
                    created_by=request.user,
                    organization=stock_transfer.organization
                )
                
                StockMovement.objects.create(
                    product=item.product,
                    quantity=item.quantity,
                    movement_type='in',
                    reference_type='StockTransfer',
                    reference_id=str(stock_transfer.id),
                    notes=f"Transfer in: {stock_transfer.transfer_number}",
                    created_by=request.user,
                    organization=stock_transfer.organization
                )

        stock_transfer.status = 'completed'
        stock_transfer.save()
        
        return Response(StockTransferDetailSerializer(stock_transfer).data)


class ReorderRuleViewSet(viewsets.ModelViewSet):
    queryset = ReorderRule.objects.all()
    serializer_class = ReorderRuleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product__name', 'product__sku', 'vendor__name']
    ordering_fields = ['product', 'vendor']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return ReorderRule.objects.filter(
                product__organization=org,
                is_active=True
            ).select_related('product', 'vendor')
        return ReorderRule.objects.none()

    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)

        suggestions = []
        rules = ReorderRule.objects.filter(
            product__organization=org,
            is_active=True
        ).select_related('product', 'vendor')

        for rule in rules:
            if rule.product.current_stock <= rule.min_quantity:
                suggestions.append({
                    'product_id': rule.product.id,
                    'product_name': rule.product.name,
                    'product_sku': rule.product.sku,
                    'current_stock': rule.product.current_stock,
                    'reorder_point': rule.min_quantity,
                    'reorder_quantity': rule.reorder_quantity,
                    'vendor_name': rule.vendor.name if rule.vendor else None,
                    'lead_time_days': rule.lead_time_days
                })

        return Response(suggestions)