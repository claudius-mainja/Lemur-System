from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, LeadViewSet, DealViewSet, ActivityViewSet, ContactViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'contacts', ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]
