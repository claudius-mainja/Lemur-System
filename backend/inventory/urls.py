from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, VendorViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'vendors', VendorViewSet, basename='vendor')

urlpatterns = [
    path('', include(router.urls)),
]
