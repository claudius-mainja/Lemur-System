from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from datetime import datetime

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        'status': 'healthy',
        'service': 'LemurSystem API',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat(),
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def api_info(request):
    return Response({
        'name': 'LemurSystem ERP API',
        'version': '1.0.0',
        'description': 'Multi-tenant ERP system for organizations',
        'endpoints': {
            'auth': '/api/v1/auth/',
            'users': '/api/v1/users/',
            'tenants': '/api/v1/tenants/',
            'hr': '/api/v1/hr/',
            'crm': '/api/v1/crm/',
            'finance': '/api/v1/finance/',
            'inventory': '/api/v1/inventory/',
            'payroll': '/api/v1/payroll/',
            'productivity': '/api/v1/productivity/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health_check, name='health-check'),
    path('api/v1/', api_info, name='api-info'),
    path('api/v1/auth/', include('core.urls.auth_urls')),
    path('api/v1/users/', include('core.urls.user_urls')),
    path('api/v1/tenants/', include('core.urls.tenant_urls')),
    path('api/v1/hr/', include('hr.urls')),
    path('api/v1/crm/', include('crm.urls')),
    path('api/v1/finance/', include('finance.urls')),
    path('api/v1/inventory/', include('inventory.urls')),
    path('api/v1/payroll/', include('payroll.urls')),
    path('api/v1/productivity/', include('productivity.urls')),
    path('api/v1/documents/', include('documents.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
