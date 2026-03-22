from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count
import uuid

from .models import UserGroup, ModulePermission, SubscriptionPlan, TenantSubscription, AuditLog
from .serializers import (
    UserGroupSerializer, ModulePermissionSerializer, SubscriptionPlanSerializer,
    TenantSubscriptionSerializer, AuditLogSerializer, CreateUserSerializer, CreateTenantSerializer
)
from core.models import User, Organization
from core.serializers import UserSerializer


def is_super_admin(user):
    return user.role == 'super_admin'


class UserGroupViewSet(viewsets.ModelViewSet):
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if not is_super_admin(self.request.user):
            return UserGroup.objects.filter(organization_id=self.request.user.organization_id)
        return UserGroup.objects.all()

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)


class ModulePermissionViewSet(viewsets.ModelViewSet):
    queryset = ModulePermission.objects.all()
    serializer_class = ModulePermissionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['module_name', 'module_display_name']
    ordering_fields = ['module_name', 'created_at']

    def get_queryset(self):
        if not is_super_admin(self.request.user):
            return ModulePermission.objects.filter(organization_id=self.request.user.organization_id)
        return ModulePermission.objects.all()

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'price_monthly']

    def get_queryset(self):
        return SubscriptionPlan.objects.filter(is_active=True)


class TenantSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = TenantSubscription.objects.all()
    serializer_class = TenantSubscriptionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['organization__name']
    ordering_fields = ['created_at']

    def get_queryset(self):
        if is_super_admin(self.request.user):
            return TenantSubscription.objects.select_related('organization', 'plan')
        return TenantSubscription.objects.filter(organization_id=self.request.user.organization_id)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['action', 'resource_type', 'user__email']
    ordering_fields = ['created_at']

    def get_queryset(self):
        if is_super_admin(self.request.user):
            return AuditLog.objects.select_related('organization', 'user')
        return AuditLog.objects.filter(organization_id=self.request.user.organization_id).select_related('user')


class SuperAdminUserManagementViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all().order_by('-date_joined')
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))
        start = (page - 1) * limit
        end = start + limit
        
        total = users.count()
        paginated_users = users[start:end]
        serializer = UserSerializer(paginated_users, many=True)
        
        return Response({
            'total': total,
            'page': page,
            'limit': limit,
            'users': serializer.data
        })

    def retrieve(self, request, pk=None):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CreateUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        if User.objects.filter(email=data['email']).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create(
            id=str(uuid.uuid4()),
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role'],
            department=data.get('department', ''),
            phone=data.get('phone', ''),
            organization_id=request.user.organization_id,
            organization_name=request.user.organization_name,
            modules=data.get('modules', []),
            country=request.user.country,
            currency=request.user.currency,
        )
        user.set_password(data['password'])
        user.save()
        
        AuditLog.objects.create(
            organization_id=request.user.organization_id,
            user=request.user,
            action='create_user',
            resource_type='User',
            resource_id=user.id,
            details={'email': user.email, 'role': user.role}
        )
        
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.role = request.data.get('role', user.role)
        user.department = request.data.get('department', user.department)
        user.modules = request.data.get('modules', user.modules)
        user.is_active = request.data.get('is_active', user.is_active)
        
        if request.data.get('password'):
            user.set_password(request.data['password'])
        
        user.save()
        
        AuditLog.objects.create(
            organization_id=request.user.organization_id,
            user=request.user,
            action='update_user',
            resource_type='User',
            resource_id=user.id,
            details={'updated_fields': list(request.data.keys())}
        )
        
        return Response(UserSerializer(user).data)

    def destroy(self, request, pk=None):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
            if user.role == 'super_admin':
                return Response({'error': 'Cannot delete super admin'}, status=status.HTTP_400_BAD_REQUEST)
            
            AuditLog.objects.create(
                organization_id=request.user.organization_id,
                user=request.user,
                action='delete_user',
                resource_type='User',
                resource_id=user.id,
                details={'email': user.email}
            )
            
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class SuperAdminTenantManagementViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        organizations = Organization.objects.all().order_by('-created_at')
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))
        start = (page - 1) * limit
        end = start + limit
        
        total = organizations.count()
        paginated_orgs = organizations[start:end]
        
        data = []
        for org in paginated_orgs:
            user_count = User.objects.filter(organization_id=org.id).count()
            data.append({
                'id': org.id,
                'name': org.name,
                'email': org.email,
                'industry': org.industry,
                'country': org.country,
                'subscription': org.subscription,
                'currency': org.currency,
                'modules': org.modules,
                'max_users': org.max_users,
                'user_count': user_count,
                'is_active': org.is_active,
                'created_at': org.created_at,
            })
        
        return Response({
            'total': total,
            'page': page,
            'limit': limit,
            'tenants': data
        })

    def retrieve(self, request, pk=None):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            org = Organization.objects.get(pk=pk)
            users = User.objects.filter(organization_id=pk)
            return Response({
                'organization': {
                    'id': org.id,
                    'name': org.name,
                    'email': org.email,
                    'industry': org.industry,
                    'country': org.country,
                    'subscription': org.subscription,
                    'currency': org.currency,
                    'modules': org.modules,
                    'max_users': org.max_users,
                    'is_active': org.is_active,
                    'created_at': org.created_at,
                },
                'users': UserSerializer(users, many=True).data
            })
        except Organization.DoesNotExist:
            return Response({'error': 'Tenant not found'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CreateTenantSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        if User.objects.filter(email=data['email']).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        plan = SubscriptionPlan.objects.filter(code=data.get('plan_code', 'starter')).first()
        modules = plan.modules if plan else ['hr', 'finance', 'supply-chain']
        
        org_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        org = Organization.objects.create(
            id=org_id,
            name=data['name'],
            email=data['email'],
            industry=data.get('industry', ''),
            country=data.get('country', 'US'),
            currency=data.get('currency', 'USD'),
            subscription=data.get('plan_code', 'starter'),
            modules=modules,
            max_users=plan.max_users if plan else 5,
        )
        
        user = User.objects.create(
            id=user_id,
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='admin',
            organization_id=org_id,
            organization_name=org.name,
            modules=modules,
            country=org.country,
            currency=org.currency,
        )
        user.set_password(data['password'])
        user.save()
        
        return Response({
            'organization': {
                'id': org.id,
                'name': org.name,
            },
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            org = Organization.objects.get(pk=pk)
        except Organization.DoesNotExist:
            return Response({'error': 'Tenant not found'}, status=status.HTTP_404_NOT_FOUND)
        
        org.name = request.data.get('name', org.name)
        org.subscription = request.data.get('subscription', org.subscription)
        org.modules = request.data.get('modules', org.modules)
        org.max_users = request.data.get('max_users', org.max_users)
        org.is_active = request.data.get('is_active', org.is_active)
        org.save()
        
        User.objects.filter(organization_id=pk).update(modules=org.modules)
        
        return Response({
            'id': org.id,
            'name': org.name,
            'subscription': org.subscription,
            'modules': org.modules,
        })

    def destroy(self, request, pk=None):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            org = Organization.objects.get(pk=pk)
            User.objects.filter(organization_id=pk).delete()
            org.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Organization.DoesNotExist:
            return Response({'error': 'Tenant not found'}, status=status.HTTP_404_NOT_FOUND)


class SuperAdminStatsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        total_users = User.objects.count()
        total_tenants = Organization.objects.count()
        active_tenants = Organization.objects.filter(is_active=True).count()
        
        by_subscription = Organization.objects.values('subscription').annotate(count=Count('id'))
        
        recent_users = User.objects.order_by('-date_joined')[:5]
        recent_tenants = Organization.objects.order_by('-created_at')[:5]
        
        return Response({
            'total_users': total_users,
            'total_tenants': total_tenants,
            'active_tenants': active_tenants,
            'by_subscription': list(by_subscription),
            'recent_users': UserSerializer(recent_users, many=True).data,
            'recent_tenants': [
                {
                    'id': org.id,
                    'name': org.name,
                    'subscription': org.subscription,
                    'user_count': User.objects.filter(organization_id=org.id).count(),
                    'created_at': org.created_at,
                }
                for org in recent_tenants
            ]
        })

    @action(detail=False, methods=['get'])
    def modules(self, request):
        if not is_super_admin(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        available_modules = [
            {'code': 'hr', 'name': 'Human Resources', 'description': 'Employee management, recruitment, leave, attendance'},
            {'code': 'finance', 'name': 'Finance & Accounting', 'description': 'Invoicing, expenses, bank reconciliation'},
            {'code': 'crm', 'name': 'Customer Relations', 'description': 'Leads, opportunities, contacts'},
            {'code': 'payroll', 'name': 'Payroll', 'description': 'Salary processing, payslips, tax deductions'},
            {'code': 'productivity', 'name': 'Productivity', 'description': 'Projects, tasks, documents, calendar'},
            {'code': 'supply-chain', 'name': 'Supply Chain', 'description': 'Inventory, purchases, vendors'},
            {'code': 'marketing', 'name': 'Marketing', 'description': 'Email campaigns, landing pages, automation'},
            {'code': 'services', 'name': 'Help Desk', 'description': 'Support tickets, knowledge base, SLA'},
        ]
        
        return Response({'modules': available_modules})
