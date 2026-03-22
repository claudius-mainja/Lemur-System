from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, ProductVariantViewSet,
    WarehouseViewSet, WarehouseLocationViewSet, StockViewSet,
    StockMovementViewSet, VendorViewSet, VendorContactViewSet,
    VendorPerformanceViewSet, PurchaseOrderViewSet, PurchaseReceiptViewSet,
    StockAlertViewSet, StockTransferViewSet, ReorderRuleViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'product-variants', ProductVariantViewSet, basename='product-variant')
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'warehouse-locations', WarehouseLocationViewSet, basename='warehouse-location')
router.register(r'stock', StockViewSet, basename='stock')
router.register(r'stock-movements', StockMovementViewSet, basename='stock-movement')
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'vendor-contacts', VendorContactViewSet, basename='vendor-contact')
router.register(r'vendor-performances', VendorPerformanceViewSet, basename='vendor-performance')
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'purchase-receipts', PurchaseReceiptViewSet, basename='purchase-receipt')
router.register(r'stock-alerts', StockAlertViewSet, basename='stock-alert')
router.register(r'stock-transfers', StockTransferViewSet, basename='stock-transfer')
router.register(r'reorder-rules', ReorderRuleViewSet, basename='reorder-rule')

urlpatterns = [
    path('', include(router.urls)),
]