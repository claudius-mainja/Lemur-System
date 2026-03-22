from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmailTemplateViewSet, AudienceSegmentViewSet, EmailCampaignViewSet,
    WorkflowViewSet, LandingPageViewSet, FormTemplateViewSet,
    MarketingAssetViewSet, ABTestViewSet
)

router = DefaultRouter()
router.register(r'email-templates', EmailTemplateViewSet, basename='email-template')
router.register(r'audiences', AudienceSegmentViewSet, basename='audience')
router.register(r'campaigns', EmailCampaignViewSet, basename='campaign')
router.register(r'workflows', WorkflowViewSet, basename='workflow')
router.register(r'landing-pages', LandingPageViewSet, basename='landing-page')
router.register(r'form-templates', FormTemplateViewSet, basename='form-template')
router.register(r'assets', MarketingAssetViewSet, basename='asset')
router.register(r'ab-tests', ABTestViewSet, basename='ab-test')

urlpatterns = [
    path('', include(router.urls)),
]
