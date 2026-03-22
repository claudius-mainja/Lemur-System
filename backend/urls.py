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
        'description': 'Multi-tenant ERP system',
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health_check, name='health-check'),
    path('api/v1/', api_info, name='api-info'),
    path('api/v1/auth/', include('core.urls')),
    path('api/v1/hr/', include('hr.urls')),
    path('api/v1/crm/', include('crm.urls')),
    path('api/v1/finance/', include('finance.urls')),
    path('api/v1/inventory/', include('inventory.urls')),
    path('api/v1/payroll/', include('payroll.urls')),
    path('api/v1/productivity/', include('productivity.urls')),
    path('api/v1/marketing/', include('marketing.urls')),
    path('api/v1/services/', include('services.urls')),
    path('api/v1/superadmin/', include('superadmin.urls')),
    path('api/v1/admin/', include('orgadmin.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
