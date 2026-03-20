from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from .models import Employee, Department, LeaveRequest
from .serializers import (
    EmployeeSerializer, DepartmentSerializer,
    LeaveRequestSerializer, LeaveApprovalSerializer
)


class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['department', 'status']
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'first_name', 'last_name']

    def get_queryset(self):
        user = self.request.user
        queryset = Employee.objects.filter(organization_id=user.organization_id)
        
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department=department)
        
        emp_status = self.request.query_params.get('status')
        if emp_status:
            queryset = queryset.filter(status=emp_status)
        
        return queryset

    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        employee = self.get_object()
        employee.status = 'terminated'
        employee.save()
        return Response({'message': 'Employee terminated successfully'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_employees': queryset.count(),
            'active_employees': queryset.filter(status='active').count(),
            'on_leave': queryset.filter(status='on_leave').count(),
            'terminated': queryset.filter(status='terminated').count(),
        })


class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Department.objects.filter(organization_id=user.organization_id)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        employees = Employee.objects.filter(organization_id=request.user.organization_id)
        return Response({
            'total_departments': queryset.count(),
            'departments': [
                {
                    'name': dept.name,
                    'employee_count': employees.filter(department=dept.name).count()
                }
                for dept in queryset
            ]
        })


class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'leave_type']
    ordering_fields = ['created_at', 'start_date']

    def get_queryset(self):
        user = self.request.user
        queryset = LeaveRequest.objects.filter(organization_id=user.organization_id)
        
        if user.role not in ['admin', 'hr', 'super_admin']:
            queryset = queryset.filter(employee_id=user.id)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.user.organization_id)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave = self.get_object()
        serializer = LeaveApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        leave.status = serializer.validated_data['status']
        leave.approved_by = f"{request.user.first_name} {request.user.last_name}"
        leave.approved_at = timezone.now()
        leave.save()
        
        return Response({'message': f'Leave request {leave.status}'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_requests': queryset.count(),
            'pending': queryset.filter(status='pending').count(),
            'approved': queryset.filter(status='approved').count(),
            'rejected': queryset.filter(status='rejected').count(),
        })
