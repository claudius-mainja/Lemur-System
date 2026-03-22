from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Department, Employee, Leave, Attendance
from .serializers import (
    DepartmentSerializer, EmployeeSerializer, LeaveSerializer, AttendanceSerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Department.objects.filter(organization=org)
        return Department.objects.none()


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'position', 'department__name']
    ordering_fields = ['hire_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Employee.objects.filter(organization=org).select_related('user', 'department')
        return Employee.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        employees = Employee.objects.filter(organization=org)
        return Response({
            'total': employees.count(),
            'active': employees.filter(status='active').count(),
            'on_leave': employees.filter(status='on_leave').count(),
            'inactive': employees.filter(status='inactive').count(),
            'terminated': employees.filter(status='terminated').count(),
        })


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__user__first_name', 'employee__user__last_name', 'leave_type']
    ordering_fields = ['start_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Leave.objects.filter(organization=org).select_related('employee', 'employee__user', 'approved_by')
        return Leave.objects.none()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave = self.get_object()
        if leave.status != 'pending':
            return Response({'error': 'Leave is not pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        employee = Employee.objects.filter(user=request.user).first()
        leave.status = 'approved'
        leave.approved_by = employee
        leave.approved_at = timezone.now()
        leave.save()
        return Response(LeaveSerializer(leave).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        leave = self.get_object()
        if leave.status != 'pending':
            return Response({'error': 'Leave is not pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        employee = Employee.objects.filter(user=request.user).first()
        leave.status = 'rejected'
        leave.approved_by = employee
        leave.approved_at = timezone.now()
        leave.save()
        return Response(LeaveSerializer(leave).data)


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__user__first_name', 'employee__user__last_name']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Attendance.objects.filter(organization=org).select_related('employee', 'employee__user')
        return Attendance.objects.none()

    @action(detail=False, methods=['post'])
    def clock_in(self, request):
        employee = Employee.objects.filter(user=request.user).first()
        if not employee:
            return Response({'error': 'Employee profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        today = timezone.now().date()
        attendance, created = Attendance.objects.get_or_create(
            employee=employee,
            date=today,
            organization=employee.organization
        )
        
        if attendance.check_in:
            return Response({'error': 'Already clocked in today'}, status=status.HTTP_400_BAD_REQUEST)
        
        attendance.check_in = timezone.now().time()
        attendance.save()
        return Response(AttendanceSerializer(attendance).data)

    @action(detail=False, methods=['post'])
    def clock_out(self, request):
        employee = Employee.objects.filter(user=request.user).first()
        if not employee:
            return Response({'error': 'Employee profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        today = timezone.now().date()
        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
        except Attendance.DoesNotExist:
            return Response({'error': 'No clock-in record found'}, status=status.HTTP_400_BAD_REQUEST)
        
        if attendance.check_out:
            return Response({'error': 'Already clocked out today'}, status=status.HTTP_400_BAD_REQUEST)
        
        attendance.check_out = timezone.now().time()
        if attendance.check_in:
            from datetime import datetime, timedelta
            check_in_dt = datetime.combine(attendance.date, attendance.check_in)
            check_out_dt = datetime.combine(attendance.date, attendance.check_out)
            hours = (check_out_dt - check_in_dt).seconds / 3600
            attendance.hours_worked = round(hours, 2)
        attendance.save()
        return Response(AttendanceSerializer(attendance).data)
