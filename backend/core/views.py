"""
Core Authentication and User Management Views
==============================================
Handles JWT-based authentication, user registration, and organization management.
"""
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import serializers
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from .models import Organization, AuditLog
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserCreateSerializer,
    UserUpdateSerializer, ChangePasswordSerializer, OrganizationSerializer,
    OrganizationCreateSerializer, AuditLogSerializer
)
from .utils import create_audit_log

User = get_user_model()


class CustomTokenObtainPairSerializer(serializers.Serializer):
    """
    Custom JWT Token Serializer
    Validates email/password and returns JWT tokens for authentication.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password) and user.is_active:
                self.user = user
                return attrs
            else:
                raise serializers.ValidationError('Invalid email or password')
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password')


class CustomTokenObtainPairView(generics.GenericAPIView):
    """
    Custom JWT Login View
    Handles user authentication and returns access/refresh tokens.
    Creates audit log entry on successful login.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.check_password(password):
            return Response({'detail': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({'detail': 'Account is inactive'}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': UserSerializer(user).data,
        }
        
        create_audit_log(user, 'login', request)
        user.last_login_at = timezone.now()
        user.save()
        
        return Response(response_data, status=status.HTTP_200_OK)


class RegisterView(generics.CreateAPIView):
    """
    User Registration View
    Creates new user accounts along with organization for multi-tenant support.
    Automatically generates JWT tokens upon successful registration.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)


LoginView = CustomTokenObtainPairView.as_view()


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            create_audit_log(request.user, 'logout', request)
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Logged out'}, status=status.HTTP_200_OK)


class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]


class UserMeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['server_time'] = timezone.now()
        return Response(data)


class UserViewSet(viewsets.ModelViewSet):
    """
    User Management ViewSet
    Provides CRUD operations for user management.
    - Super admins can view all users
    - Regular users can only view users in their organization
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['role', 'department', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email', 'first_name']

    def get_queryset(self):
        user = self.request.user
        queryset = User.objects.all()
        
        if user.role not in ['super_admin', 'admin']:
            queryset = queryset.filter(organization_id=user.organization_id)
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        create_audit_log(self.request.user, 'create', self.request, 'User', user.id)

    def perform_update(self, serializer):
        user = serializer.save()
        create_audit_log(self.request.user, 'update', self.request, 'User', user.id)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
        create_audit_log(self.request.user, 'delete', self.request, 'User', instance.id)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        create_audit_log(request.user, 'password_change', request)
        
        return Response({'message': 'Password changed successfully'})

    @action(detail=False, methods=['get'])
    def invite(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Invitation link generated',
            'email': email,
            'invite_token': str(uuid.uuid4())
        })


class OrganizationViewSet(viewsets.ModelViewSet):
    """
    Organization Management ViewSet
    Manages multi-tenant organizations with subscription-based module access.
    """
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'super_admin':
            return Organization.objects.all()
        return Organization.objects.filter(id=user.organization_id)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrganizationCreateSerializer
        return OrganizationSerializer

    @action(detail=False, methods=['get'])
    def modules(self, request):
        """
        Returns available modules based on organization subscription plan.
        Plans: starter, professional, enterprise
        """
        org_id = request.query_params.get('organization_id') or request.user.organization_id
        try:
            org = Organization.objects.get(id=org_id)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)
        
        modules = {
            'starter': ['hr', 'crm', 'invoices', 'products'],
            'professional': ['hr', 'crm', 'invoices', 'products', 'payroll', 'expenses', 'reports'],
            'enterprise': ['hr', 'crm', 'invoices', 'products', 'payroll', 'expenses', 'reports', 'advanced_analytics', 'api_access', 'custom_integrations']
        }
        
        return Response({
            'organization_id': org.id,
            'subscription': org.subscription,
            'modules': modules.get(org.subscription, modules['starter'])
        })


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Audit Log ViewSet (Read-Only)
    Tracks all user actions for security and compliance.
    """
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = AuditLog.objects.all()
        
        if user.role not in ['super_admin', 'admin']:
            queryset = queryset.filter(organization_id=user.organization_id)
        
        organization_id = self.request.query_params.get('organization_id')
        if organization_id:
            queryset = queryset.filter(organization_id=organization_id)
        
        action = self.request.query_params.get('action')
        if action:
            queryset = queryset.filter(action=action)
        
        return queryset.order_by('-created_at')[:100]


def create_audit_log(user, action, request, model_name=None, object_id=None):
    try:
        AuditLog.objects.create(
            user=user,
            organization_id=user.organization_id if user else None,
            action=action,
            model_name=model_name,
            object_id=str(object_id) if object_id else None,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500] if request else None
        )
    except Exception as e:
        pass


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
