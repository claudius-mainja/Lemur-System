from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TicketViewSet, SLAConfigViewSet, KnowledgeBaseCategoryViewSet,
    KnowledgeBaseArticleViewSet, EscalationRuleViewSet, ServiceReportViewSet,
    SatisfactionSurveyViewSet
)

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'sla-configs', SLAConfigViewSet, basename='sla-config')
router.register(r'kb-categories', KnowledgeBaseCategoryViewSet, basename='kb-category')
router.register(r'kb-articles', KnowledgeBaseArticleViewSet, basename='kb-article')
router.register(r'escalation-rules', EscalationRuleViewSet, basename='escalation-rule')
router.register(r'reports', ServiceReportViewSet, basename='service-report')
router.register(r'surveys', SatisfactionSurveyViewSet, basename='survey')

urlpatterns = [
    path('', include(router.urls)),
]
