from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SalaryComponentViewSet, EmployeeSalaryViewSet, PayrollRunViewSet, PayslipViewSet,
    TaxBracketViewSet, TaxWithholdingViewSet, BankDetailViewSet, DirectDepositViewSet,
    ComplianceSettingViewSet, PayrollSummaryViewSet, PayrollCostCenterViewSet,
    PayrollReportsViewSet
)

router = DefaultRouter()
router.register(r'salary-components', SalaryComponentViewSet, basename='salary-component')
router.register(r'employee-salaries', EmployeeSalaryViewSet, basename='employee-salary')
router.register(r'payroll-runs', PayrollRunViewSet, basename='payroll-run')
router.register(r'payslips', PayslipViewSet, basename='payslip')
router.register(r'tax-brackets', TaxBracketViewSet, basename='tax-bracket')
router.register(r'tax-withholdings', TaxWithholdingViewSet, basename='tax-withholding')
router.register(r'bank-details', BankDetailViewSet, basename='bank-detail')
router.register(r'direct-deposits', DirectDepositViewSet, basename='direct-deposit')
router.register(r'compliance-settings', ComplianceSettingViewSet, basename='compliance-setting')
router.register(r'payroll-summaries', PayrollSummaryViewSet, basename='payroll-summary')
router.register(r'cost-centers', PayrollCostCenterViewSet, basename='cost-center')
router.register(r'reports', PayrollReportsViewSet, basename='payroll-reports')

urlpatterns = [
    path('', include(router.urls)),
]
