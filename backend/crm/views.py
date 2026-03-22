from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Avg, F, Q
from django.db.models.functions import Coalesce
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from .models import (
    Lead, LeadActivity, Contact, ContactHistory, Opportunity,
    StageConfiguration, DealHistory, EmailTemplate, EmailCampaign,
    EmailLog, SalesDashboard
)
from .serializers import (
    LeadSerializer, LeadDetailSerializer, LeadActivitySerializer,
    ContactSerializer, ContactDetailSerializer, ContactHistorySerializer,
    OpportunitySerializer, OpportunityDetailSerializer,
    StageConfigurationSerializer, DealHistorySerializer,
    EmailTemplateSerializer, EmailCampaignSerializer, EmailLogSerializer,
    SalesDashboardSerializer, PipelineStageSerializer,
    SalesAnalyticsSerializer, ForecastSerializer
)


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'company', 'phone']
    ordering_fields = ['name', 'score', 'status', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Lead.objects.filter(organization=org).select_related('assigned_to').prefetch_related('activities')
        return Lead.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LeadDetailSerializer
        return LeadSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        leads = Lead.objects.filter(organization=org)
        return Response({
            'total': leads.count(),
            'new': leads.filter(status='new').count(),
            'contacted': leads.filter(status='contacted').count(),
            'qualified': leads.filter(status='qualified').count(),
            'proposal': leads.filter(status='proposal').count(),
            'negotiation': leads.filter(status='negotiation').count(),
            'won': leads.filter(status='won').count(),
            'lost': leads.filter(status='lost').count(),
            'average_score': leads.aggregate(avg=Avg('score'))['avg'] or 0,
        })

    @action(detail=True, methods=['post'])
    def calculate_score(self, request, pk=None):
        lead = self.get_object()
        new_score = lead.calculate_score()
        return Response({'score': new_score})

    @action(detail=True, methods=['post'])
    def add_activity(self, request, pk=None):
        lead = self.get_object()
        serializer = LeadActivitySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(lead=lead, organization=lead.organization, created_by=request.user)
            lead.calculate_score()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        lead = self.get_object()
        user_id = request.data.get('assigned_to')
        if user_id is None:
            return Response({'error': 'assigned_to is required'}, status=status.HTTP_400_BAD_REQUEST)
        lead.assigned_to_id = user_id
        lead.save()
        return Response(LeadSerializer(lead).data)

    @action(detail=True, methods=['post'])
    def convert_to_opportunity(self, request, pk=None):
        lead = self.get_object()
        opportunity = Opportunity.objects.create(
            name=f"Opportunity from {lead.name}",
            customer=None,
            contact=None,
            value=request.data.get('value', 0),
            probability=10,
            stage='prospecting',
            expected_close_date=request.data.get('expected_close_date'),
            notes=f"Converted from lead: {lead.name}\n{lead.notes}",
            assigned_to=lead.assigned_to,
            organization=lead.organization
        )
        lead.status = 'won'
        lead.save()
        return Response(OpportunitySerializer(opportunity).data, status=status.HTTP_201_CREATED)


class LeadActivityViewSet(viewsets.ModelViewSet):
    queryset = LeadActivity.objects.all()
    serializer_class = LeadActivitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['subject', 'description', 'lead__name']
    ordering_fields = ['scheduled_at', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return LeadActivity.objects.filter(organization=org).select_related('lead', 'created_by')
        return LeadActivity.objects.none()

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org, created_by=self.request.user)


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone', 'company']
    ordering_fields = ['first_name', 'last_name', 'company', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Contact.objects.filter(organization=org).prefetch_related('opportunities', 'email_logs', 'history')
        return Contact.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ContactDetailSerializer
        return ContactSerializer

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        contact = serializer.save(organization=org)
        ContactHistory.objects.create(
            contact=contact,
            action='created',
            description='Contact created',
            created_by=self.request.user,
            organization=org
        )

    @action(detail=True, methods=['post'])
    def update_history(self, request, pk=None):
        contact = self.get_object()
        serializer = ContactHistorySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(contact=contact, organization=contact.organization, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def primary_contacts(self, request):
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        contacts = Contact.objects.filter(organization=org, is_primary=True)
        return Response(ContactSerializer(contacts, many=True).data)


class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'customer__name', 'contact__first_name', 'contact__last_name']
    ordering_fields = ['value', 'probability', 'expected_close_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Opportunity.objects.filter(organization=org).select_related(
                'customer', 'contact', 'assigned_to'
            ).prefetch_related('history')
        return Opportunity.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OpportunityDetailSerializer
        return OpportunitySerializer

    @action(detail=False, methods=['get'])
    def pipeline(self, request):
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        stages = StageConfiguration.objects.filter(organization=org, is_active=True).order_by('order')
        pipeline_data = []
        
        for stage in stages:
            opps = Opportunity.objects.filter(organization=org, stage=stage.stage_key)
            pipeline_data.append({
                'stage': stage.stage_key,
                'stage_name': stage.name,
                'count': opps.count(),
                'value': float(opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or 0),
                'probability': stage.probability,
                'color': stage.color,
            })
        
        return Response(pipeline_data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        opps = Opportunity.objects.filter(organization=org)
        active_opps = opps.exclude(stage__in=['closed_won', 'closed_lost'])
        won_opps = opps.filter(stage='closed_won')
        lost_opps = opps.filter(stage='closed_lost')
        
        total_closed = won_opps.count() + lost_opps.count()
        win_rate = Decimal('0')
        if total_closed > 0:
            win_rate = Decimal(str(round((won_opps.count() / total_closed) * 100, 2)))
        
        return Response({
            'total': opps.count(),
            'active': active_opps.count(),
            'closed_won_count': won_opps.count(),
            'closed_lost_count': lost_opps.count(),
            'pipeline_value': float(active_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or 0),
            'weighted_pipeline_value': float(sum(o.weighted_value for o in active_opps)),
            'closed_won_value': float(won_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or 0),
            'closed_lost_value': float(lost_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or 0),
            'average_deal_size': float(won_opps.aggregate(avg=Coalesce(Avg('value'), Decimal('0')))['avg'] or 0),
            'win_rate': win_rate,
        })

    @action(detail=True, methods=['post'])
    def change_stage(self, request, pk=None):
        opportunity = self.get_object()
        new_stage = request.data.get('stage')
        if not new_stage:
            return Response({'error': 'stage is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        old_stage = opportunity.stage
        old_probability = opportunity.probability
        
        opportunity.stage = new_stage
        opportunity.update_probability()
        
        DealHistory.objects.create(
            opportunity=opportunity,
            action='stage_changed',
            description=f'Stage changed from {old_stage} to {new_stage}',
            old_value=old_stage,
            new_value=new_stage,
            created_by=request.user,
            organization=opportunity.organization
        )
        
        if new_stage == 'closed_won':
            opportunity.actual_close_date = timezone.now().date()
            opportunity.probability = 100
            opportunity.save()
            DealHistory.objects.create(
                opportunity=opportunity,
                action='closed_won',
                description='Deal closed as won',
                created_by=request.user,
                organization=opportunity.organization
            )
        elif new_stage == 'closed_lost':
            opportunity.actual_close_date = timezone.now().date()
            opportunity.probability = 0
            opportunity.save()
            DealHistory.objects.create(
                opportunity=opportunity,
                action='closed_lost',
                description='Deal closed as lost',
                created_by=request.user,
                organization=opportunity.organization
            )
        
        return Response(OpportunitySerializer(opportunity).data)

    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        opportunity = self.get_object()
        note = request.data.get('note', '')
        DealHistory.objects.create(
            opportunity=opportunity,
            action='note_added',
            description=note,
            created_by=request.user,
            organization=opportunity.organization
        )
        return Response({'message': 'Note added successfully'})

    @action(detail=True, methods=['post'])
    def update_value(self, request, pk=None):
        opportunity = self.get_object()
        new_value = request.data.get('value')
        if new_value is None:
            return Response({'error': 'value is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        old_value = str(opportunity.value)
        opportunity.value = new_value
        opportunity.save()
        
        DealHistory.objects.create(
            opportunity=opportunity,
            action='value_changed',
            description=f'Value changed from {old_value} to {new_value}',
            old_value=old_value,
            new_value=str(new_value),
            created_by=request.user,
            organization=opportunity.organization
        )
        
        return Response(OpportunitySerializer(opportunity).data)


class StageConfigurationViewSet(viewsets.ModelViewSet):
    queryset = StageConfiguration.objects.all()
    serializer_class = StageConfigurationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'stage_key']
    ordering_fields = ['order', 'name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return StageConfiguration.objects.filter(organization=org)
        return StageConfiguration.objects.none()

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org)

    @action(detail=False, methods=['post'])
    def create_defaults(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        StageConfiguration.create_defaults(org)
        return Response({'message': 'Default stages created successfully'})

    @action(detail=False, methods=['get'])
    def initialize_if_empty(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        if not StageConfiguration.objects.filter(organization=org).exists():
            StageConfiguration.create_defaults(org)
            return Response({'message': 'Default stages created'})
        return Response({'message': 'Stages already exist'})


class DealHistoryViewSet(viewsets.ModelViewSet):
    queryset = DealHistory.objects.all()
    serializer_class = DealHistorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['opportunity__name', 'description']
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return DealHistory.objects.filter(organization=org).select_related('opportunity', 'created_by')
        return DealHistory.objects.none()


class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'subject']
    ordering_fields = ['name', 'category', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return EmailTemplate.objects.filter(organization=org)
        return EmailTemplate.objects.none()

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org)


class EmailCampaignViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all()
    serializer_class = EmailCampaignSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'subject']
    ordering_fields = ['name', 'status', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return EmailCampaign.objects.filter(organization=org).select_related('template', 'created_by')
        return EmailCampaign.objects.none()

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org, created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        campaign = self.get_object()
        if campaign.status not in ['draft', 'scheduled']:
            return Response({'error': 'Campaign cannot be sent in current status'}, status=status.HTTP_400_BAD_REQUEST)
        
        campaign.status = 'sending'
        campaign.save()
        
        return Response({'message': 'Campaign sending initiated'})

    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        campaign = self.get_object()
        if campaign.status == 'sending':
            campaign.status = 'paused'
            campaign.save()
            return Response({'message': 'Campaign paused'})
        return Response({'error': 'Campaign cannot be paused in current status'}, status=status.HTTP_400_BAD_REQUEST)


class EmailLogViewSet(viewsets.ModelViewSet):
    queryset = EmailLog.objects.all()
    serializer_class = EmailLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['recipient_email', 'subject']
    ordering_fields = ['created_at', 'status']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return EmailLog.objects.filter(organization=org).select_related(
                'campaign', 'template', 'lead', 'contact', 'created_by'
            )
        return EmailLog.objects.none()

    def perform_create(self, serializer):
        org = getattr(self.request.user, 'organization', None)
        serializer.save(organization=org, created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def by_campaign(self, request):
        campaign_id = request.query_params.get('campaign_id')
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        logs = EmailLog.objects.filter(organization=org)
        if campaign_id:
            logs = logs.filter(campaign_id=campaign_id)
        
        return Response(EmailLogSerializer(logs, many=True).data)


class SalesDashboardViewSet(viewsets.ModelViewSet):
    queryset = SalesDashboard.objects.all()
    serializer_class = SalesDashboardSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return SalesDashboard.objects.filter(organization=org)
        return SalesDashboard.objects.none()

    @action(detail=False, methods=['get'])
    def today(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        dashboard = SalesDashboard.update_daily_metrics(org)
        return Response(SalesDashboardSerializer(dashboard).data)

    @action(detail=False, methods=['get'])
    def range(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        dashboards = SalesDashboard.objects.filter(organization=org)
        if start_date:
            dashboards = dashboards.filter(date__gte=start_date)
        if end_date:
            dashboards = dashboards.filter(date__lte=end_date)
        
        return Response(SalesDashboardSerializer(dashboards, many=True).data)


class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        leads = Lead.objects.filter(organization=org)
        opportunities = Opportunity.objects.filter(organization=org)
        active_opps = opportunities.exclude(stage__in=['closed_won', 'closed_lost'])
        won_opps = opportunities.filter(stage='closed_won')
        lost_opps = opportunities.filter(stage='closed_lost')
        
        total_closed = won_opps.count() + lost_opps.count()
        win_rate = Decimal('0')
        if total_closed > 0:
            win_rate = Decimal(str(round((won_opps.count() / total_closed) * 100, 2)))
        
        pipeline_value = active_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or Decimal('0')
        weighted_value = sum(o.weighted_value for o in active_opps)
        
        data = {
            'total_leads': leads.count(),
            'new_leads': leads.filter(status='new').count(),
            'qualified_leads': leads.filter(status__in=['qualified', 'proposal', 'negotiation']).count(),
            'total_opportunities': opportunities.count(),
            'active_opportunities': active_opps.count(),
            'closed_won_count': won_opps.count(),
            'closed_lost_count': lost_opps.count(),
            'pipeline_value': pipeline_value,
            'weighted_pipeline_value': Decimal(str(round(weighted_value, 2))),
            'closed_won_value': won_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or Decimal('0'),
            'closed_lost_value': lost_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or Decimal('0'),
            'average_deal_size': won_opps.aggregate(avg=Coalesce(Avg('value'), Decimal('0')))['avg'] or Decimal('0'),
            'conversion_rate': Decimal(str(round((active_opps.count() / opportunities.count() * 100) if opportunities.count() > 0 else 0, 2))),
            'win_rate': win_rate,
        }
        
        return Response(data)

    @action(detail=False, methods=['get'])
    def pipeline_forecast(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        months = int(request.query_params.get('months', 6))
        today = timezone.now().date()
        forecasts = []
        
        for i in range(months):
            month_start = today.replace(day=1) + timedelta(days=32 * i)
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            opps = Opportunity.objects.filter(
                organization=org,
                expected_close_date__gte=month_start,
                expected_close_date__lte=month_end
            ).exclude(stage__in=['closed_won', 'closed_lost'])
            
            expected_value = sum(o.weighted_value for o in opps)
            best_case_value = sum(o.value for o in opps)
            
            forecasts.append({
                'month': month_start.strftime('%Y-%m'),
                'expected_value': Decimal(str(round(expected_value, 2))),
                'best_case_value': Decimal(str(round(best_case_value, 2))),
                'opportunity_count': opps.count(),
            })
        
        return Response(forecasts)

    @action(detail=False, methods=['get'])
    def win_loss_analysis(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        won_opps = Opportunity.objects.filter(organization=org, stage='closed_won')
        lost_opps = Opportunity.objects.filter(organization=org, stage='closed_lost')
        
        won_by_stage = {}
        lost_by_reason = {}
        
        for opp in won_opps:
            won_by_stage[opp.stage] = won_by_stage.get(opp.stage, 0) + 1
        
        for opp in lost_opps:
            reason = 'unknown'
            if 'lost to competitor' in opp.notes.lower():
                reason = 'competitor'
            elif 'budget' in opp.notes.lower():
                reason = 'budget'
            elif 'timing' in opp.notes.lower():
                reason = 'timing'
            elif 'no response' in opp.notes.lower():
                reason = 'no_response'
            lost_by_reason[reason] = lost_by_reason.get(reason, 0) + 1
        
        return Response({
            'total_won': won_opps.count(),
            'total_lost': lost_opps.count(),
            'total_won_value': float(won_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or 0),
            'total_lost_value': float(lost_opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or 0),
            'won_by_stage': won_by_stage,
            'lost_by_reason': lost_by_reason,
            'average_time_to_close': 0,
        })

    @action(detail=False, methods=['get'])
    def sales_by_source(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        leads = Lead.objects.filter(organization=org)
        sources = {}
        
        for source, _ in Lead.SOURCE_CHOICES:
            count = leads.filter(source=source).count()
            if count > 0:
                sources[source] = count
        
        return Response(sources)

    @action(detail=False, methods=['get'])
    def sales_by_stage(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        opportunities = Opportunity.objects.filter(organization=org)
        stages = {}
        
        for stage_key, stage_name in Opportunity.STAGE_CHOICES:
            opps = opportunities.filter(stage=stage_key)
            stages[stage_key] = {
                'name': stage_name,
                'count': opps.count(),
                'value': float(opps.aggregate(total=Coalesce(Sum('value'), Decimal('0')))['total'] or 0),
            }
        
        return Response(stages)
