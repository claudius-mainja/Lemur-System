from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
from django.db.models import Sum, Count, Q
from django.utils import timezone
import uuid

from .models import User, Organization, UserGroup, AuditLog
from .serializers import (
    UserSerializer, UserListSerializer, RegisterSerializer, LoginSerializer,
    OrganizationSerializer, CreateUserSerializer, UpdateUserSerializer,
    UserGroupSerializer, CreateUserGroupSerializer, AuditLogSerializer,
    OrganizationStatsSerializer, DashboardStatsSerializer, TeamMemberSerializer,
    ModuleAccessSerializer, PermissionSerializer, RolePermissionSerializer
)


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


def log_audit(user, action, resource_type, resource_id=None, details=None, request=None):
    ip_address = None
    user_agent = ''
    if request:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
    
    AuditLog.objects.create(
        organization=getattr(user, 'organization', None),
        user=user,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id or '',
        details=details or {},
        ip_address=ip_address,
        user_agent=user_agent
    )


def get_module_permissions(user):
    base_permissions = {
        'hr': {
            'name': 'Human Resources',
            'can_view': True,
            'can_create': user.role in ['admin', 'hr', 'manager'],
            'can_edit': user.role in ['admin', 'hr'],
            'can_delete': user.role == 'admin',
            'can_approve': user.role in ['admin', 'hr', 'manager'],
            'can_export': user.role in ['admin', 'hr', 'manager'],
        },
        'finance': {
            'name': 'Finance & Accounting',
            'can_view': True,
            'can_create': user.role in ['admin', 'finance', 'accounting'],
            'can_edit': user.role in ['admin', 'finance', 'accounting'],
            'can_delete': user.role in ['admin', 'finance'],
            'can_approve': user.role in ['admin', 'finance'],
            'can_export': user.role in ['admin', 'finance', 'accounting'],
        },
        'crm': {
            'name': 'Customer Relations',
            'can_view': True,
            'can_create': True,
            'can_edit': True,
            'can_delete': user.role in ['admin', 'manager'],
            'can_approve': user.role in ['admin', 'manager'],
            'can_export': True,
        },
        'payroll': {
            'name': 'Payroll',
            'can_view': user.role in ['admin', 'hr', 'finance'],
            'can_create': user.role in ['admin', 'finance'],
            'can_edit': user.role in ['admin', 'finance'],
            'can_delete': user.role == 'admin',
            'can_approve': user.role == 'admin',
            'can_export': user.role in ['admin', 'finance'],
        },
        'inventory': {
            'name': 'Inventory & Supply Chain',
            'can_view': True,
            'can_create': user.role in ['admin', 'manager'],
            'can_edit': user.role in ['admin', 'manager'],
            'can_delete': user.role in ['admin'],
            'can_approve': user.role in ['admin', 'manager'],
            'can_export': True,
        },
        'productivity': {
            'name': 'Productivity',
            'can_view': True,
            'can_create': True,
            'can_edit': True,
            'can_delete': True,
            'can_approve': user.role in ['admin', 'manager'],
            'can_export': True,
        },
        'marketing': {
            'name': 'Marketing',
            'can_view': True,
            'can_create': user.role in ['admin', 'manager'],
            'can_edit': user.role in ['admin', 'manager'],
            'can_delete': user.role in ['admin'],
            'can_approve': user.role in ['admin', 'manager'],
            'can_export': True,
        },
        'services': {
            'name': 'Help Desk',
            'can_view': True,
            'can_create': True,
            'can_edit': True,
            'can_delete': user.role in ['admin', 'manager'],
            'can_approve': user.role in ['admin', 'manager'],
            'can_export': True,
        },
        'operations': {
            'name': 'Operations',
            'can_view': user.role in ['admin', 'manager'],
            'can_create': user.role in ['admin', 'manager'],
            'can_edit': user.role in ['admin', 'manager'],
            'can_delete': user.role == 'admin',
            'can_approve': user.role == 'admin',
            'can_export': user.role in ['admin', 'manager'],
        },
    }
    return base_permissions


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
        log_audit(user, 'login', 'User', user.id, request=request)
        
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
    serializer = UserSerializer(request.user)
    user_modules = get_module_permissions(request.user)
    
    user_module_access = []
    for mod_code, mod_data in user_modules.items():
        if mod_code in request.user.modules:
            user_module_access.append({
                'module_code': mod_code,
                'module_name': mod_data['name'],
                'has_access': True,
                'permissions': mod_data,
            })
    
    return Response({
        'user': serializer.data,
        'module_access': user_module_access,
        'organization': OrganizationSerializer(request.user.organization).data if request.user.organization else None,
    })


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
        log_audit(request.user, 'logout', 'User', request.user.id, request=request)
        return Response({'detail': 'Logged out successfully'})
    except Exception:
        return Response({'detail': 'Logout successful'})


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        'status': 'healthy',
        'service': 'LemurSystem ERP API',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat(),
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_info(request):
    return Response({
        'name': 'LemurSystem ERP API',
        'version': '1.0.0',
        'description': 'Multi-tenant ERP system for African businesses',
        'modules': {
            'hr': 'Human Resources',
            'finance': 'Finance & Accounting',
            'crm': 'Customer Relations',
            'payroll': 'Payroll Management',
            'inventory': 'Inventory & Supply Chain',
            'productivity': 'Productivity Tools',
            'marketing': 'Marketing Automation',
            'services': 'Help Desk & Support',
            'operations': 'Operations Management',
        },
        'industries': {
            'retail': 'Retail & E-Commerce',
            'manufacturing': 'Manufacturing',
            'healthcare': 'Healthcare',
            'hospitality': 'Hospitality',
            'education': 'Education',
            'realestate': 'Real Estate',
            'professional_services': 'Professional Services',
            'logistics': 'Logistics & Transport',
        },
    })


@api_view(['GET', 'PUT'])
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
    if 'industry' in data:
        org.industry = data['industry']
    
    org.save()
    log_audit(request.user, 'update_organization', 'Organization', org.id)
    return Response(OrganizationSerializer(org).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def organization_stats(request):
    if not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org = request.user.organization
    total_users = User.objects.filter(organization=org).count()
    active_users = User.objects.filter(organization=org, is_active=True).count()
    inactive_users = total_users - active_users
    
    trial_remaining = 0
    if org.is_on_trial and org.trial_ends_at:
        remaining = org.trial_ends_at - timezone.now()
        trial_remaining = max(0, remaining.days)
    
    return Response({
        'total_users': total_users,
        'active_users': active_users,
        'inactive_users': inactive_users,
        'max_users': org.max_users,
        'extra_users': org.extra_users,
        'max_users_total': org.get_max_users_total(),
        'extra_users_cost': float(org.get_extra_users_cost()),
        'subscription': org.subscription,
        'modules': org.modules,
        'currency': org.currency,
        'user_limit_percentage': round((active_users / org.get_max_users_total()) * 100, 1) if org.get_max_users_total() > 0 else 0,
        'trial_remaining_days': trial_remaining,
        'is_on_trial': org.is_on_trial,
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def users_list(request):
    if not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org_id = request.user.organization.id
    
    if request.method == 'GET':
        search = request.GET.get('search', '')
        role = request.GET.get('role', '')
        is_active = request.GET.get('is_active', '')
        
        users = User.objects.filter(organization_id=org_id).order_by('-date_joined')
        
        if search:
            users = users.filter(
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        
        if role:
            users = users.filter(role=role)
        
        if is_active:
            is_active_bool = is_active.lower() == 'true'
            users = users.filter(is_active=is_active_bool)
        
        serializer = UserListSerializer(users, many=True)
        return Response({
            'users': serializer.data,
            'total': users.count(),
        })
    
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
        department=data.get('department') or '',
        phone=data.get('phone') or '',
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


@api_view(['GET', 'PUT', 'DELETE', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_detail(request, user_id):
    if not request.user.organization:
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
        
        if user.id == request.user.id:
            return Response({'detail': 'Cannot delete yourself'}, status=400)
        
        log_audit(request.user, 'delete_user', 'User', user.id, {'email': user.email})
        user.delete()
        return Response(status=204)
    
    if request.method == 'PATCH':
        data = request.data
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
    if not request.user.organization:
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
    
    if UserGroup.objects.filter(organization_id=org_id, name=data['name']).exists():
        return Response({'detail': 'Group with this name already exists'}, status=400)
    
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


@api_view(['GET', 'PUT', 'DELETE', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_group_detail(request, group_id):
    if not request.user.organization:
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
    
    if request.method == 'PATCH':
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
    if not request.user.organization:
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
    if not request.user.organization:
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
    if not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    resource_type = request.GET.get('resource_type', '')
    action = request.GET.get('action', '')
    limit = int(request.GET.get('limit', 100))
    
    logs = AuditLog.objects.filter(organization_id=request.user.organization.id)
    
    if resource_type:
        logs = logs.filter(resource_type=resource_type)
    if action:
        logs = logs.filter(action=action)
    
    logs = logs[:limit]
    
    return Response({
        'logs': AuditLogSerializer(logs, many=True).data,
        'total': logs.count(),
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def subscription_plans(request):
    plans = [
        {
            'code': 'starter',
            'name': 'Starter',
            'modules': ['hr', 'finance', 'inventory'],
            'max_users': 5,
            'price_monthly': 10.60,
            'price_yearly': 99.00,
            'extra_user_cost': 5.00,
            'features': [
                'Human Resources Management',
                'Finance & Accounting',
                'Inventory Management',
                'Basic Reporting',
                'Email Support',
                '5 Users Included',
            ],
            'industries': ['retail', 'manufacturing', 'professional_services'],
        },
        {
            'code': 'professional',
            'name': 'Professional',
            'modules': ['hr', 'finance', 'crm', 'payroll', 'productivity', 'inventory', 'marketing', 'services'],
            'max_users': 25,
            'price_monthly': 20.50,
            'price_yearly': 199.00,
            'extra_user_cost': 5.00,
            'features': [
                'All Starter Features',
                'Customer Relations (CRM)',
                'Payroll Management',
                'Productivity Tools',
                'Marketing Automation',
                'Help Desk Support',
                'Advanced Analytics',
                'Priority Support',
                '25 Users Included',
            ],
            'industries': ['retail', 'ecommerce', 'manufacturing', 'healthcare', 'hospitality', 'education', 'realestate', 'professional_services', 'logistics'],
        },
        {
            'code': 'enterprise',
            'name': 'Enterprise',
            'modules': ['hr', 'finance', 'crm', 'payroll', 'productivity', 'inventory', 'marketing', 'services', 'operations'],
            'max_users': 100,
            'price_monthly': 50.00,
            'price_yearly': 499.00,
            'extra_user_cost': 5.00,
            'features': [
                'All Professional Features',
                'Operations Management',
                'Custom Integrations',
                'Advanced Security',
                'Dedicated Account Manager',
                'Custom Training',
                'SLA Guarantee',
                '24/7 Priority Support',
                '100 Users Included',
            ],
            'industries': ['retail', 'ecommerce', 'manufacturing', 'healthcare', 'hospitality', 'education', 'realestate', 'professional_services', 'logistics', 'technology', 'finance', 'construction'],
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
    
    if extra_count < 1 or extra_count > 100:
        return Response({'detail': 'Invalid extra_users count (1-100)'}, status=400)
    
    org.extra_users += extra_count
    org.extra_users_cost = org.extra_users * 5.00
    org.save()
    
    log_audit(request.user, 'purchase_extra_users', 'Organization', org.id, {
        'extra_users': extra_count,
        'total_extra_users': org.extra_users,
        'cost': str(org.extra_users_cost),
    })
    
    return Response({
        'detail': f'Successfully added {extra_count} extra users',
        'extra_users': org.extra_users,
        'extra_users_cost': float(org.extra_users_cost),
        'max_users': org.get_max_users_total(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    if not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org = request.user.organization
    
    total_employees = 0
    total_revenue = 0
    total_expenses = 0
    pending_tasks = 0
    open_tickets = 0
    active_leads = 0
    
    try:
        from hr.models import Employee
        total_employees = Employee.objects.filter(organization=org, status='active').count()
    except:
        pass
    
    try:
        from finance.models import Invoice, Expense
        total_revenue = Invoice.objects.filter(
            organization=org,
            status='paid'
        ).aggregate(total=Sum('total'))['total'] or 0
        
        total_expenses = Expense.objects.filter(
            organization=org,
            status='paid'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
    except:
        pass
    
    try:
        from crm.models import Lead
        active_leads = Lead.objects.filter(
            organization=org,
            status__in=['new', 'contacted', 'qualified', 'proposal', 'negotiation']
        ).count()
    except:
        pass
    
    try:
        from services.models import Ticket
        open_tickets = Ticket.objects.filter(
            organization=org,
            status__in=['open', 'pending', 'in_progress']
        ).count()
    except:
        pass
    
    try:
        from productivity.models import Task
        pending_tasks = Task.objects.filter(
            organization=org,
            status__in=['todo', 'in_progress']
        ).count()
    except:
        pass
    
    net_profit = total_revenue - total_expenses if total_revenue else 0
    
    recent_activities = AuditLog.objects.filter(
        organization=org
    ).order_by('-created_at')[:10]
    
    return Response({
        'total_employees': total_employees,
        'total_revenue': float(total_revenue),
        'total_expenses': float(total_expenses),
        'net_profit': float(net_profit),
        'pending_tasks': pending_tasks,
        'open_tickets': open_tickets,
        'active_leads': active_leads,
        'recent_activities': AuditLogSerializer(recent_activities, many=True).data,
        'currency': org.currency,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def module_permissions(request):
    user_modules = get_module_permissions(request.user)
    
    module_access = []
    for mod_code, mod_data in user_modules.items():
        if mod_code in request.user.modules:
            module_access.append({
                'module_code': mod_code,
                'module_name': mod_data['name'],
                'has_access': True,
                'permissions': mod_data,
            })
        else:
            module_access.append({
                'module_code': mod_code,
                'module_name': mod_data['name'],
                'has_access': False,
                'permissions': {},
            })
    
    return Response({'module_access': module_access})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_user_action(request):
    if not is_admin(request.user):
        return Response({'detail': 'Unauthorized'}, status=403)
    
    user_ids = request.data.get('user_ids', [])
    action = request.data.get('action', '')
    
    if not user_ids or not action:
        return Response({'detail': 'user_ids and action required'}, status=400)
    
    org_id = request.user.organization.id
    
    if action == 'activate':
        User.objects.filter(id__in=user_ids, organization_id=org_id).update(is_active=True)
    elif action == 'deactivate':
        User.objects.filter(id__in=user_ids, organization_id=org_id).update(is_active=False)
    elif action == 'delete':
        User.objects.filter(id__in=user_ids, organization_id=org_id).exclude(id=request.user.id).delete()
    else:
        return Response({'detail': 'Invalid action'}, status=400)
    
    log_audit(request.user, f'bulk_{action}', 'User', None, {'user_ids': user_ids})
    
    return Response({'detail': f'Successfully performed {action} on {len(user_ids)} users'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_members(request):
    if not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org_id = request.user.organization.id
    users = User.objects.filter(organization_id=org_id).order_by('first_name', 'last_name')
    
    members = []
    for user in users:
        members.append({
            'id': user.id,
            'email': user.email,
            'full_name': user.get_full_name(),
            'role': user.role,
            'department': user.department,
            'modules': user.modules,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
        })
    
    return Response({
        'members': members,
        'total': len(members),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_log_summary(request):
    if not request.user.organization:
        return Response({'detail': 'No organization found'}, status=404)
    
    org_id = request.user.organization.id
    
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    
    daily_counts = []
    for i in range(7):
        date = week_ago + timedelta(days=i)
        count = AuditLog.objects.filter(
            organization_id=org_id,
            created_at__date=date
        ).count()
        daily_counts.append({
            'date': date.isoformat(),
            'count': count,
        })
    
    action_summary = AuditLog.objects.filter(
        organization_id=org_id,
        created_at__date__gte=week_ago
    ).values('action').annotate(count=Count('action')).order_by('-count')[:10]
    
    return Response({
        'daily_counts': daily_counts,
        'action_summary': list(action_summary),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def industries_and_modules(request):
    industries = [
        {'code': 'retail', 'name': 'Retail & E-Commerce', 'modules': ['hr', 'finance', 'inventory', 'crm', 'payroll', 'productivity']},
        {'code': 'ecommerce', 'name': 'E-Commerce', 'modules': ['hr', 'finance', 'inventory', 'crm', 'payroll', 'productivity', 'marketing']},
        {'code': 'manufacturing', 'name': 'Manufacturing', 'modules': ['hr', 'finance', 'inventory', 'payroll', 'productivity', 'operations']},
        {'code': 'healthcare', 'name': 'Healthcare', 'modules': ['hr', 'finance', 'inventory', 'payroll', 'services']},
        {'code': 'hospitality', 'name': 'Hospitality & Hotel', 'modules': ['hr', 'finance', 'inventory', 'crm', 'payroll', 'productivity']},
        {'code': 'education', 'name': 'Education', 'modules': ['hr', 'finance', 'crm', 'payroll', 'productivity']},
        {'code': 'realestate', 'name': 'Real Estate', 'modules': ['hr', 'finance', 'crm', 'payroll', 'productivity']},
        {'code': 'professional_services', 'name': 'Professional Services', 'modules': ['hr', 'finance', 'crm', 'payroll', 'productivity']},
        {'code': 'logistics', 'name': 'Logistics & Transport', 'modules': ['hr', 'finance', 'inventory', 'payroll', 'productivity', 'operations']},
    ]
    
    modules = [
        {'code': 'hr', 'name': 'Human Resources', 'description': 'Employee management, recruitment, performance reviews'},
        {'code': 'finance', 'name': 'Finance & Accounting', 'description': 'General ledger, invoices, expenses, financial reports'},
        {'code': 'crm', 'name': 'Customer Relations', 'description': 'Leads, contacts, opportunities, sales pipeline'},
        {'code': 'payroll', 'name': 'Payroll', 'description': 'Salary processing, tax calculations, payslips'},
        {'code': 'inventory', 'name': 'Inventory & Supply Chain', 'description': 'Stock management, purchase orders, vendors'},
        {'code': 'productivity', 'name': 'Productivity', 'description': 'Tasks, projects, documents, calendar, chat'},
        {'code': 'marketing', 'name': 'Marketing', 'description': 'Email campaigns, landing pages, automation'},
        {'code': 'services', 'name': 'Help Desk', 'description': 'Support tickets, knowledge base, SLA monitoring'},
        {'code': 'operations', 'name': 'Operations', 'description': 'Workflow automation, reporting, analytics'},
    ]
    
    return Response({
        'industries': industries,
        'modules': modules,
    })
