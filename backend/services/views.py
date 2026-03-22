from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum, Avg
from datetime import timedelta

from .models import (
    Ticket, TicketReply, TicketComment, SLAConfig, SLAViolation,
    KnowledgeBaseCategory, KnowledgeBaseArticle, ArticleFeedback,
    EscalationRule, EscalationHistory, ServiceReport, CustomerPortal, SatisfactionSurvey
)
from .serializers import (
    TicketSerializer, TicketListSerializer, TicketReplySerializer,
    SLAConfigSerializer, SLAViolationSerializer,
    KnowledgeBaseCategorySerializer, KnowledgeBaseArticleSerializer, ArticleFeedbackSerializer,
    EscalationRuleSerializer, EscalationHistorySerializer, ServiceReportSerializer,
    SatisfactionSurveySerializer
)


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['ticket_number', 'subject', 'customer_name', 'customer_email']
    ordering_fields = ['created_at', 'priority']

    def get_serializer_class(self):
        if self.action == 'list':
            return TicketListSerializer
        return TicketSerializer

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Ticket.objects.filter(organization=org).prefetch_related('replies')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            priority = self.request.query_params.get('priority')
            if priority:
                queryset = queryset.filter(priority=priority)
            
            assigned_to = self.request.query_params.get('assigned_to')
            if assigned_to:
                queryset = queryset.filter(assigned_to_id=assigned_to)
            
            return queryset
        return Ticket.objects.none()

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        ticket = self.get_object()
        ticket.assigned_to_id = request.data.get('user_id')
        ticket.save()
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        reply = TicketReply.objects.create(
            ticket=ticket,
            author=request.user,
            content=request.data.get('content'),
            is_internal=request.data.get('is_internal', False)
        )
        if not ticket.first_response_at:
            ticket.first_response_at = timezone.now()
        if ticket.status == 'open':
            ticket.status = 'in_progress'
        ticket.save()
        return Response(TicketReplySerializer(reply).data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'resolved'
        ticket.resolved_at = timezone.now()
        ticket.save()
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'closed'
        ticket.closed_at = timezone.now()
        ticket.save()
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'])
    def reopen(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'open'
        ticket.resolved_at = None
        ticket.closed_at = None
        ticket.save()
        return Response(TicketSerializer(ticket).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        tickets = Ticket.objects.filter(organization=org)
        today = timezone.now().date()
        
        open_tickets = tickets.filter(status__in=['open', 'in_progress', 'pending_customer']).count()
        resolved_today = tickets.filter(resolved_at__date=today).count()
        closed_today = tickets.filter(closed_at__date=today).count()
        
        return Response({
            'total': tickets.count(),
            'open': open_tickets,
            'resolved_today': resolved_today,
            'closed_today': closed_today,
            'by_priority': tickets.values('priority').annotate(count=Count('id')),
            'by_status': tickets.values('status').annotate(count=Count('id')),
        })


class SLAConfigViewSet(viewsets.ModelViewSet):
    queryset = SLAConfig.objects.all()
    serializer_class = SLAConfigSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return SLAConfig.objects.filter(organization=org)
        return SLAConfig.objects.none()


class KnowledgeBaseCategoryViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeBaseCategory.objects.all()
    serializer_class = KnowledgeBaseCategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return KnowledgeBaseCategory.objects.filter(organization=org).prefetch_related('children')
        return KnowledgeBaseCategory.objects.none()


class KnowledgeBaseArticleViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeBaseArticle.objects.all()
    serializer_class = KnowledgeBaseArticleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['title', 'created_at', 'view_count']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = KnowledgeBaseArticle.objects.filter(organization=org)
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            else:
                queryset = queryset.filter(status='published')
            
            category = self.request.query_params.get('category')
            if category:
                queryset = queryset.filter(category_id=category)
            
            return queryset
        return KnowledgeBaseArticle.objects.none()

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        article = self.get_object()
        article.status = 'published'
        article.save()
        return Response(KnowledgeBaseArticleSerializer(article).data)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        article = self.get_object()
        article.view_count += 1
        article.save()
        return Response({'view_count': article.view_count})

    @action(detail=True, methods=['post'])
    def feedback(self, request, pk=None):
        article = self.get_object()
        helpful = request.data.get('helpful', True)
        if helpful:
            article.helpful_yes += 1
        else:
            article.helpful_no += 1
        article.save()
        ArticleFeedback.objects.create(
            article=article,
            helpful=helpful,
            ip_address=request.META.get('REMOTE_ADDR')
        )
        return Response({'helpful_yes': article.helpful_yes, 'helpful_no': article.helpful_no})


class EscalationRuleViewSet(viewsets.ModelViewSet):
    queryset = EscalationRule.objects.all()
    serializer_class = EscalationRuleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return EscalationRule.objects.filter(organization=org)
        return EscalationRule.objects.none()


class ServiceReportViewSet(viewsets.ModelViewSet):
    queryset = ServiceReport.objects.all()
    serializer_class = ServiceReportSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return ServiceReport.objects.filter(organization=org)
        return ServiceReport.objects.none()

    @action(detail=False, methods=['post'])
    def generate(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        report_type = request.data.get('type', 'summary')
        date_from = request.data.get('date_from')
        date_to = request.data.get('date_to')
        
        tickets = Ticket.objects.filter(organization=org)
        if date_from:
            tickets = tickets.filter(created_at__date__gte=date_from)
        if date_to:
            tickets = tickets.filter(created_at__date__lte=date_to)
        
        data = {
            'total_tickets': tickets.count(),
            'open_tickets': tickets.filter(status__in=['open', 'in_progress']).count(),
            'resolved_tickets': tickets.filter(status='resolved').count(),
            'avg_resolution_time': '24h',
            'by_priority': list(tickets.values('priority').annotate(count=Count('id'))),
            'by_status': list(tickets.values('status').annotate(count=Count('id'))),
        }
        
        report = ServiceReport.objects.create(
            name=f"{report_type.title()} Report - {timezone.now().date()}",
            report_type=report_type,
            date_from=date_from,
            date_to=date_to,
            data=data,
            generated_by=request.user,
            organization=org
        )
        
        return Response(ServiceReportSerializer(report).data)


class SatisfactionSurveyViewSet(viewsets.ModelViewSet):
    queryset = SatisfactionSurvey.objects.all()
    serializer_class = SatisfactionSurveySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return SatisfactionSurvey.objects.filter(ticket__organization=org)
        return SatisfactionSurvey.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        surveys = SatisfactionSurvey.objects.filter(ticket__organization=org)
        return Response({
            'total_responses': surveys.count(),
            'avg_rating': surveys.aggregate(avg=Avg('rating'))['avg'] or 0,
            'avg_response_time_rating': surveys.aggregate(avg=Avg('response_time_rating'))['avg'] or 0,
            'avg_resolution_rating': surveys.aggregate(avg=Avg('resolution_rating'))['avg'] or 0,
        })
