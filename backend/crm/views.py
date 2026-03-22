from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Customer, Contact, Opportunity, Activity
from .serializers import CustomerSerializer, ContactSerializer, OpportunitySerializer, ActivitySerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'company', 'phone']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Customer.objects.filter(organization=org).prefetch_related('contacts', 'opportunities')
        return Customer.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        customers = Customer.objects.filter(organization=org)
        return Response({
            'total': customers.count(),
            'leads': customers.filter(status='lead').count(),
            'prospects': customers.filter(status='prospect').count(),
            'active': customers.filter(status='active').count(),
            'inactive': customers.filter(status='inactive').count(),
        })


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone', 'customer__name']
    ordering_fields = ['first_name', 'last_name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Contact.objects.filter(organization=org).select_related('customer')
        return Contact.objects.none()


class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'customer__name']
    ordering_fields = ['amount', 'probability', 'expected_close_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Opportunity.objects.filter(organization=org).select_related('customer', 'contact')
        return Opportunity.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        opps = Opportunity.objects.filter(organization=org)
        won = opps.filter(stage='closed_won')
        lost = opps.filter(stage='closed_lost')
        
        return Response({
            'total': opps.count(),
            'total_value': float(opps.aggregate(total=models.Sum('amount'))['total'] or 0),
            'won_count': won.count(),
            'won_value': float(won.aggregate(total=models.Sum('amount'))['total'] or 0),
            'lost_count': lost.count(),
            'lost_value': float(lost.aggregate(total=models.Sum('amount'))['total'] or 0),
            'by_stage': {
                'qualification': opps.filter(stage='qualification').count(),
                'needs_analysis': opps.filter(stage='needs_analysis').count(),
                'proposal': opps.filter(stage='proposal').count(),
                'negotiation': opps.filter(stage='negotiation').count(),
                'closed_won': won.count(),
                'closed_lost': lost.count(),
            }
        })

    @action(detail=True, methods=['post'])
    def close_won(self, request, pk=None):
        opp = self.get_object()
        opp.stage = 'closed_won'
        opp.actual_close_date = timezone.now().date()
        opp.probability = 100
        opp.save()
        return Response(OpportunitySerializer(opp).data)

    @action(detail=True, methods=['post'])
    def close_lost(self, request, pk=None):
        opp = self.get_object()
        opp.stage = 'closed_lost'
        opp.actual_close_date = timezone.now().date()
        opp.probability = 0
        opp.save()
        return Response(OpportunitySerializer(opp).data)


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['subject', 'description', 'customer__name']
    ordering_fields = ['due_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Activity.objects.filter(organization=org).select_related('customer', 'opportunity')
        return Activity.objects.none()

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        activity = self.get_object()
        activity.is_completed = True
        activity.completed_at = timezone.now()
        activity.save()
        return Response(ActivitySerializer(activity).data)
