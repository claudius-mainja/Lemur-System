from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayrollRunViewSet, PayslipViewSet, DeductionTypeViewSet

router = DefaultRouter()
router.register(r'payroll-runs', PayrollRunViewSet, basename='payroll-run')
router.register(r'payslips', PayslipViewSet, basename='payslip')
router.register(r'deduction-types', DeductionTypeViewSet, basename='deduction-type')

urlpatterns = [
    path('', include(router.urls)),
]
