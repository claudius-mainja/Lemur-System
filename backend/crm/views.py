from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Customer, Lead, Deal, Activity, Contact
from .serializers import CustomerSerializer, LeadSerializer, DealSerializer, ActivitySerializer, ContactSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'type', 'source']
    search_fields = ['name', 'email', 'company']
    ordering_fields = ['created_at', 'name', 'total_spent']

    def get_queryset(self):
        return Customer.objects.filter(organization_id=self.request.user.organization_id)

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_customers': queryset.count(),
            'active_customers': queryset.filter(status='active').count(),
            'total_revenue': float(queryset.aggregate(total=models.Sum('total_spent'))['total'] or 0),
        })


class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'source']
    search_fields = ['name', 'email', 'company']
    ordering_fields = ['created_at', 'value']

    def get_queryset(self):
        return Lead.objects.filter(organization_id=self.request.user.organization_id)

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_leads': queryset.count(),
            'new_leads': queryset.filter(status='new').count(),
            'qualified_leads': queryset.filter(status='qualified').count(),
            'total_value': float(queryset.aggregate(total=models.Sum('value'))['total'] or 0),
        })


class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['stage']
    search_fields = ['title']
    ordering_fields = ['created_at', 'value']

    def get_queryset(self):
        return Deal.objects.filter(organization_id=self.request.user.organization_id)

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_deals': queryset.count(),
            'won_deals': queryset.filter(stage='won').count(),
            'lost_deals': queryset.filter(stage='lost').count(),
            'total_value': float(queryset.aggregate(total=models.Sum('value'))['total'] or 0),
        })


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['type', 'status']

    def get_queryset(self):
        return Activity.objects.filter(organization_id=self.request.user.organization_id)

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['first_name', 'last_name', 'email', 'company']
    ordering_fields = ['first_name', 'last_name']

    def get_queryset(self):
        return Contact.objects.filter(organization_id=self.request.user.organization_id)

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)
