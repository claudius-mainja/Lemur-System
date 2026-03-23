from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
import uuid

from .models import User, Organization, UserGroup, AuditLog
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer, OrganizationSerializer,
    CreateUserSerializer, UpdateUserSerializer, UserGroupSerializer,
    CreateUserGroupSerializer, AuditLogSerializer, SubscriptionPlanSerializer
)


PLAN_MODULES = {
    'starter': ['hr', 'finance', 'inventory'],
    'professional': ['hr', 'finance', 'crm', 'payroll', 'productivity', 'inventory', 'marketing', 'services'],
    'enterprise': ['hr', 'finance', 'crm', 'payroll', 'productivity', 'inventory', 'marketing', 'services', 'operations'],
}

PLAN_MAX_USERS = {
    'starter': 5,
    'professional': 25,
    'enterprise': 100,
}

EXTRA_USER_COST = 5.00


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
    }


def is_admin(user):
    return user.role in ['admin', 'super_admin']


def is_super_admin(user):
    return user.role == 'super_admin'


def log_audit(user, action, resource_type, resource_id=None, details=None):
    AuditLog.objects.create(
        organization=user.organization,
        user=user,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id or '',
        details=details or {}
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token'],
            'user': UserSerializer(user).data,
            'server_time': datetime.utcnow().isoformat(),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.check_password(password):
            return Response(
                {'detail': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'detail': 'Account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        tokens = get_tokens_for_user(user)
        return Response({
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token'],
            'user': UserSerializer(user).data,
            'server_time': datetime.utcnow().isoformat(),
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'detail': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh = RefreshToken(refresh_token)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        })
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return Response(UserSerializer(request.user).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_current_user(request):
    user = request.user
    data = request.data
    
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'department' in data:
        user.department = data['department']
    
    user.save()
    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'detail': 'Logged out successfully'})
    except Exception:
        return Response({'detail': 'Logout successful'})


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


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def organization_detail(request):
    if request.method == 'GET':
        if request.user.organization:
            return Response(OrganizationSerializer(request.user.organization).data)
        return Response({'detail': 'No organization found'}, status=404)
    
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    org = request.user.organization
    data = request.data
    
    if 'name' in data:
        org.name = data['name']
    if 'email' in data:
        org.email = data['email']
    if 'phone' in data:
        org.phone = data['phone']
    if 'address' in data:
        org.address = data['address']
    if 'city' in data:
        org.city = data['city']
    if 'state' in data:
        org.state = data['state']
    if 'country' in data:
        org.country = data['country']
    if 'currency' in data:
        org.currency = data['currency']
    
    org.save()
    log_audit(request.user, 'update_organization', 'Organization', org.id)
    return Response(OrganizationSerializer(org).data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def users_list(request):
    if not hasattr(request.user, 'organization') or not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org_id = request.user.organization.id
    
    if request.method == 'GET':
        users = User.objects.filter(organization_id=org_id).order_by('-date_joined')
        return Response(UserSerializer(users, many=True).data)
    
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    org = request.user.organization
    current_count = org.get_active_user_count()
    max_users = org.get_max_users_total()
    
    if current_count >= max_users:
        return Response({
            'detail': f'User limit reached. You have {max_users} users. To add more, purchase extra users at $5/month each.'
        }, status=400)
    
    serializer = CreateUserSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    
    data = serializer.validated_data
    
    if User.objects.filter(email=data['email'], organization=org).exists():
        return Response({'detail': 'User with this email already exists'}, status=400)
    
    user = User.objects.create(
        id=str(uuid.uuid4()),
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        role=data['role'],
        department=data.get('department', ''),
        phone=data.get('phone', ''),
        organization=org,
        modules=data.get('modules', []),
        user_groups=data.get('user_groups', []),
        currency=org.currency,
        country=org.country,
        subscription=org.subscription,
    )
    user.set_password(data['password'])
    user.save()
    
    log_audit(request.user, 'create_user', 'User', user.id, {'email': user.email, 'role': user.role})
    return Response(UserSerializer(user).data, status=201)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, user_id):
    if not hasattr(request.user, 'organization') or not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org_id = request.user.organization.id
    
    try:
        user = User.objects.get(id=user_id, organization_id=org_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)
    
    if request.method == 'GET':
        return Response(UserSerializer(user).data)
    
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    if request.method == 'DELETE':
        if user.role == 'super_admin':
            return Response({'detail': 'Cannot delete super admin'}, status=400)
        
        log_audit(request.user, 'delete_user', 'User', user.id, {'email': user.email})
        user.delete()
        return Response(status=204)
    
    serializer = UpdateUserSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    
    data = serializer.validated_data
    
    for field in ['first_name', 'last_name', 'role', 'department', 'phone', 'modules', 'user_groups']:
        if field in data:
            setattr(user, field, data[field])
    
    if 'is_active' in data:
        user.is_active = data['is_active']
    
    if 'password' in data and data['password']:
        user.set_password(data['password'])
    
    user.save()
    log_audit(request.user, 'update_user', 'User', user.id, {'updated_fields': list(data.keys())})
    return Response(UserSerializer(user).data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_groups(request):
    if not hasattr(request.user, 'organization') or not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org_id = request.user.organization.id
    
    if request.method == 'GET':
        groups = UserGroup.objects.filter(organization_id=org_id).order_by('name')
        return Response(UserGroupSerializer(groups, many=True).data)
    
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    serializer = CreateUserGroupSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    
    data = serializer.validated_data
    
    group = UserGroup.objects.create(
        id=str(uuid.uuid4()),
        organization_id=org_id,
        name=data['name'],
        description=data.get('description', ''),
        module=data.get('module', 'general'),
        permissions=data.get('permissions', {}),
        modules_access=data.get('modules_access', []),
    )
    
    log_audit(request.user, 'create_user_group', 'UserGroup', group.id, {'name': group.name})
    return Response(UserGroupSerializer(group).data, status=201)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_group_detail(request, group_id):
    if not hasattr(request.user, 'organization') or not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org_id = request.user.organization.id
    
    try:
        group = UserGroup.objects.get(id=group_id, organization_id=org_id)
    except UserGroup.DoesNotExist:
        return Response({'detail': 'Group not found'}, status=404)
    
    if request.method == 'GET':
        return Response(UserGroupSerializer(group).data)
    
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    if request.method == 'DELETE':
        log_audit(request.user, 'delete_user_group', 'UserGroup', group.id, {'name': group.name})
        group.delete()
        return Response(status=204)
    
    data = request.data
    
    if 'name' in data:
        group.name = data['name']
    if 'description' in data:
        group.description = data['description']
    if 'module' in data:
        group.module = data['module']
    if 'permissions' in data:
        group.permissions = data['permissions']
    if 'modules_access' in data:
        group.modules_access = data['modules_access']
    if 'members' in data:
        group.members = data['members']
    if 'is_active' in data:
        group.is_active = data['is_active']
    
    group.save()
    log_audit(request.user, 'update_user_group', 'UserGroup', group.id)
    return Response(UserGroupSerializer(group).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user_to_group(request, group_id):
    if not hasattr(request.user, 'organization') or not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    try:
        group = UserGroup.objects.get(id=group_id, organization_id=request.user.organization.id)
    except UserGroup.DoesNotExist:
        return Response({'detail': 'Group not found'}, status=404)
    
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'detail': 'user_id required'}, status=400)
    
    try:
        user = User.objects.get(id=user_id, organization_id=request.user.organization.id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)
    
    members = group.members or []
    if user_id not in members:
        members.append(user_id)
        group.members = members
        group.save()
        
        user_groups = user.user_groups or []
        if group_id not in user_groups:
            user_groups.append(group_id)
            user.user_groups = user_groups
            user.save()
    
    log_audit(request.user, 'add_user_to_group', 'UserGroup', group.id, {'user_id': user_id})
    return Response({'detail': 'User added to group', 'group': UserGroupSerializer(group).data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_user_from_group(request, group_id):
    if not hasattr(request.user, 'organization') or not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    try:
        group = UserGroup.objects.get(id=group_id, organization_id=request.user.organization.id)
    except UserGroup.DoesNotExist:
        return Response({'detail': 'Group not found'}, status=404)
    
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'detail': 'user_id required'}, status=400)
    
    members = group.members or []
    if user_id in members:
        members.remove(user_id)
        group.members = members
        group.save()
        
        try:
            user = User.objects.get(id=user_id, organization_id=request.user.organization.id)
            user_groups = user.user_groups or []
            if group_id in user_groups:
                user_groups.remove(group_id)
                user.user_groups = user_groups
                user.save()
        except User.DoesNotExist:
            pass
    
    log_audit(request.user, 'remove_user_from_group', 'UserGroup', group.id, {'user_id': user_id})
    return Response({'detail': 'User removed from group', 'group': UserGroupSerializer(group).data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def audit_logs(request):
    if not hasattr(request.user, 'organization') or not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    logs = AuditLog.objects.filter(organization_id=request.user.organization.id)[:100]
    return Response(AuditLogSerializer(logs, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def subscription_plans(request):
    plans = [
        {
            'code': 'starter',
            'name': 'Starter',
            'modules': PLAN_MODULES['starter'],
            'max_users': PLAN_MAX_USERS['starter'],
            'price_monthly': 10.60,
            'price_yearly': 99.00,
            'extra_user_cost': EXTRA_USER_COST,
            'features': [
                'Human Resources',
                'Finance & Accounting',
                'Inventory Management',
                'Email Support',
                'Basic Reporting',
            ],
        },
        {
            'code': 'professional',
            'name': 'Professional',
            'modules': PLAN_MODULES['professional'],
            'max_users': PLAN_MAX_USERS['professional'],
            'price_monthly': 20.50,
            'price_yearly': 199.00,
            'extra_user_cost': EXTRA_USER_COST,
            'features': [
                'All Starter Features',
                'Customer Relations (CRM)',
                'Payroll Management',
                'Productivity Tools',
                'Marketing Automation',
                'Help Desk',
                'Priority Support',
                'Advanced Analytics',
            ],
        },
        {
            'code': 'enterprise',
            'name': 'Enterprise',
            'modules': PLAN_MODULES['enterprise'],
            'max_users': PLAN_MAX_USERS['enterprise'],
            'price_monthly': 50.00,
            'price_yearly': 499.00,
            'extra_user_cost': EXTRA_USER_COST,
            'features': [
                'All Professional Features',
                'Operations Management',
                '24/7 Dedicated Support',
                'Custom Integrations',
                'Advanced Security',
                'Dedicated Account Manager',
                'Custom Training',
                'SLA Guarantee',
            ],
        },
    ]
    return Response({'plans': plans})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_extra_users(request):
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    org = request.user.organization
    extra_count = request.data.get('extra_users', 1)
    
    if extra_count < 1:
        return Response({'detail': 'Invalid extra_users count'}, status=400)
    
    org.extra_users += extra_count
    org.extra_users_cost = org.extra_users * EXTRA_USER_COST
    org.save()
    
    log_audit(request.user, 'purchase_extra_users', 'Organization', org.id, {
        'extra_users': extra_count,
        'total_extra_users': org.extra_users,
        'cost': org.extra_users_cost,
    })
    
    return Response({
        'detail': f'Successfully added {extra_count} extra users',
        'extra_users': org.extra_users,
        'extra_users_cost': float(org.extra_users_cost),
        'max_users': org.get_max_users_total(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def organization_stats(request):
    if not hasattr(request.user, 'organization') or not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org = request.user.organization
    total_users = User.objects.filter(organization=org).count()
    active_users = User.objects.filter(organization=org, is_active=True).count()
    
    return Response({
        'total_users': total_users,
        'active_users': active_users,
        'max_users': org.max_users,
        'extra_users': org.extra_users,
        'max_users_total': org.get_max_users_total(),
        'extra_users_cost': float(org.get_extra_users_cost()),
        'subscription': org.subscription,
        'modules': org.modules,
        'currency': org.currency,
    })
