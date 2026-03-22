from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LeadViewSet, LeadActivityViewSet, ContactViewSet,
    OpportunityViewSet, StageConfigurationViewSet, DealHistoryViewSet,
    EmailTemplateViewSet, EmailCampaignViewSet, EmailLogViewSet,
    SalesDashboardViewSet, AnalyticsViewSet
)

router = DefaultRouter()
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'lead-activities', LeadActivityViewSet, basename='lead-activity')
router.register(r'contacts', ContactViewSet, basename='crm-contact')
router.register(r'opportunities', OpportunityViewSet, basename='crm-opportunity')
router.register(r'stages', StageConfigurationViewSet, basename='stage-configuration')
router.register(r'deal-history', DealHistoryViewSet, basename='deal-history')
router.register(r'email-templates', EmailTemplateViewSet, basename='email-template')
router.register(r'email-campaigns', EmailCampaignViewSet, basename='email-campaign')
router.register(r'email-logs', EmailLogViewSet, basename='email-log')
router.register(r'sales-dashboard', SalesDashboardViewSet, basename='sales-dashboard')
router.register(r'analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', include(router.urls)),
]
