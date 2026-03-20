from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, F
from .models import Product, Vendor
from .serializers import ProductSerializer, VendorSerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'category', 'is_taxable']
    search_fields = ['name', 'sku', 'description', 'barcode']
    ordering_fields = ['created_at', 'name', 'sku', 'selling_price', 'quantity_in_stock']

    def get_queryset(self):
        user = self.request.user
        queryset = Product.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            organization_id=self.request.user.organization_id,
            created_by=self.request.user.id
        )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_products': queryset.count(),
            'active_products': queryset.filter(status='active').count(),
            'inactive_products': queryset.filter(status__in=['inactive', 'discontinued']).count(),
            'low_stock_count': queryset.filter(quantity_in_stock__lte=F('reorder_level')).count(),
            'total_value': queryset.aggregate(
                total=Sum(F('quantity_in_stock') * F('selling_price'))
            )['total'] or 0,
        })

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        queryset = self.get_queryset().filter(quantity_in_stock__lte=F('reorder_level'))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class VendorViewSet(viewsets.ModelViewSet):
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'country']
    search_fields = ['name', 'vendor_code', 'email', 'contact_person']
    ordering_fields = ['created_at', 'name', 'rating']

    def get_queryset(self):
        user = self.request.user
        queryset = Vendor.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            organization_id=self.request.user.organization_id,
            created_by=self.request.user.id
        )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_vendors': queryset.count(),
            'active_vendors': queryset.filter(status='active').count(),
            'inactive_vendors': queryset.filter(status__in=['inactive', 'blocked']).count(),
        })
