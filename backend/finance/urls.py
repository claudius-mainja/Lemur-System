from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AccountViewSet, JournalEntryViewSet, VendorViewSet, BillViewSet,
    CustomerViewSet, InvoiceViewSet, QuotationViewSet,
    ExpenseViewSet, BankAccountViewSet, TaxRateViewSet,
    BudgetViewSet, FinanceDashboardViewSet
)

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'journal-entries', JournalEntryViewSet, basename='journal-entry')
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'bills', BillViewSet, basename='bill')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'quotations', QuotationViewSet, basename='quotation')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'bank-accounts', BankAccountViewSet, basename='bank-account')
router.register(r'tax-rates', TaxRateViewSet, basename='tax-rate')
router.register(r'budgets', BudgetViewSet, basename='budget')
router.register(r'dashboard', FinanceDashboardViewSet, basename='finance-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
