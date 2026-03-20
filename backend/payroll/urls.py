from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayrollViewSet, PayslipViewSet

router = DefaultRouter()
router.register(r'payrolls', PayrollViewSet, basename='payroll')
router.register(r'payslips', PayslipViewSet, basename='payslip')

urlpatterns = [
    path('', include(router.urls)),
]
