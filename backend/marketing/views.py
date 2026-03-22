from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum, Avg

from .models import (
    EmailTemplate, AudienceSegment, EmailCampaign, CampaignVariant,
    Workflow, WorkflowStep, LandingPage, LandingPageSubmission,
    FormTemplate, MarketingAsset, ABTest
)
from .serializers import (
    EmailTemplateSerializer, AudienceSegmentSerializer, EmailCampaignSerializer,
    CampaignVariantSerializer, WorkflowSerializer, WorkflowStepSerializer,
    LandingPageSerializer, LandingPageSubmissionSerializer,
    FormTemplateSerializer, MarketingAssetSerializer, ABTestSerializer
)


class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'subject']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = EmailTemplate.objects.filter(organization=org)
            category = self.request.query_params.get('category')
            if category:
                queryset = queryset.filter(category=category)
            return queryset
        return EmailTemplate.objects.none()


class AudienceSegmentViewSet(viewsets.ModelViewSet):
    queryset = AudienceSegment.objects.all()
    serializer_class = AudienceSegmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return AudienceSegment.objects.filter(organization=org)
        return AudienceSegment.objects.none()


class EmailCampaignViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all()
    serializer_class = EmailCampaignSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'subject']
    ordering_fields = ['created_at', 'sent_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = EmailCampaign.objects.filter(organization=org)
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            return queryset
        return EmailCampaign.objects.none()

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        campaign = self.get_object()
        campaign.status = 'sending'
        campaign.save()
        return Response({'status': 'Campaign sending started'})

    @action(detail=True, methods=['post'])
    def schedule(self, request, pk=None):
        campaign = self.get_object()
        scheduled_at = request.data.get('scheduled_at')
        if not scheduled_at:
            return Response({'error': 'scheduled_at is required'}, status=status.HTTP_400_BAD_REQUEST)
        campaign.status = 'scheduled'
        campaign.scheduled_at = scheduled_at
        campaign.save()
        return Response(EmailCampaignSerializer(campaign).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        campaign = self.get_object()
        campaign.status = 'cancelled'
        campaign.save()
        return Response(EmailCampaignSerializer(campaign).data)

    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        campaign = self.get_object()
        campaign.status = 'paused'
        campaign.save()
        return Response(EmailCampaignSerializer(campaign).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        campaigns = EmailCampaign.objects.filter(organization=org)
        return Response({
            'total_campaigns': campaigns.count(),
            'total_sent': campaigns.aggregate(total=Sum('sent_count'))['total'] or 0,
            'total_opened': campaigns.aggregate(total=Sum('opened_count'))['total'] or 0,
            'total_clicked': campaigns.aggregate(total=Sum('clicked_count'))['total'] or 0,
            'avg_open_rate': campaigns.aggregate(avg=Avg('sent_count'))['avg'] or 0,
        })


class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Workflow.objects.filter(organization=org).prefetch_related('steps')
        return Workflow.objects.none()

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        workflow = self.get_object()
        workflow.status = 'active'
        workflow.save()
        return Response(WorkflowSerializer(workflow).data)

    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        workflow = self.get_object()
        workflow.status = 'paused'
        workflow.save()
        return Response(WorkflowSerializer(workflow).data)


class LandingPageViewSet(viewsets.ModelViewSet):
    queryset = LandingPage.objects.all()
    serializer_class = LandingPageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'title']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = LandingPage.objects.filter(organization=org)
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            return queryset
        return LandingPage.objects.none()

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        page = self.get_object()
        page.status = 'published'
        page.save()
        return Response(LandingPageSerializer(page).data)

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        page = self.get_object()
        page.status = 'archived'
        page.save()
        return Response(LandingPageSerializer(page).data)

    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        page = self.get_object()
        submissions = page.submissions.all()
        return Response(LandingPageSubmissionSerializer(submissions, many=True).data)


class FormTemplateViewSet(viewsets.ModelViewSet):
    queryset = FormTemplate.objects.all()
    serializer_class = FormTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return FormTemplate.objects.filter(organization=org)
        return FormTemplate.objects.none()


class MarketingAssetViewSet(viewsets.ModelViewSet):
    queryset = MarketingAsset.objects.all()
    serializer_class = MarketingAssetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tags']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = MarketingAsset.objects.filter(organization=org)
            asset_type = self.request.query_params.get('type')
            if asset_type:
                queryset = queryset.filter(asset_type=asset_type)
            return queryset
        return MarketingAsset.objects.none()


class ABTestViewSet(viewsets.ModelViewSet):
    queryset = ABTest.objects.all()
    serializer_class = ABTestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return ABTest.objects.filter(organization=org)
        return ABTest.objects.none()

    @action(detail=True, methods=['post'])
    def decide_winner(self, request, pk=None):
        test = self.get_object()
        winner = request.data.get('winner')
        if winner not in ['A', 'B']:
            return Response({'error': 'Winner must be A or B'}, status=status.HTTP_400_BAD_REQUEST)
        test.winner_subject = test.subject_a if winner == 'A' else test.subject_b
        test.status = 'completed'
        test.decided_at = timezone.now()
        test.save()
        return Response(ABTestSerializer(test).data)
