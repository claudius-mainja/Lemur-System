import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from .models import AuditLog

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data['status_code'] = response.status_code
        
        if response.status_code == 401:
            response.data['message'] = 'Authentication credentials were not provided or are invalid.'
        elif response.status_code == 403:
            response.data['message'] = 'You do not have permission to perform this action.'
        elif response.status_code == 404:
            response.data['message'] = 'The requested resource was not found.'
        elif response.status_code == 400:
            if 'detail' in response.data:
                response.data['message'] = str(response.data['detail'])
        elif response.status_code == 500:
            logger.error(f"Server Error: {exc}", exc_info=True)
            response.data['message'] = 'An internal server error occurred.'
    else:
        logger.error(f"Unhandled Exception: {exc}", exc_info=True)
        response = Response({
            'status_code': 500,
            'message': 'An internal server error occurred.',
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response


def create_audit_log(user, action, request=None, model_name=None, object_id=None, details=None):
    try:
        ip_address = None
        user_agent = None
        if request:
            ip_address = request.META.get('REMOTE_ADDR')
            user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        
        AuditLog.objects.create(
            user=user,
            organization_id=user.organization_id if user else None,
            action=action,
            model_name=model_name,
            object_id=str(object_id) if object_id else None,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent,
        )
    except Exception as e:
        logger.error(f"Failed to create audit log: {e}")
