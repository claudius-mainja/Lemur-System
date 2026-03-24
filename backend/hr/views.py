from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum, Q, Avg
from datetime import datetime, timedelta
from decimal import Decimal

from .models import (
    Department, JobPosition, JobPosting, Applicant, Interview, OfferLetter,
    Employee, EmployeeDocument, LeaveBalance, Leave, Attendance, OvertimeRecord,
    ReviewCycle, Goal, PerformanceReview, Feedback360, Training, TimeSheet, TimeSheetEntry, Holiday
)
from .serializers import (
    DepartmentSerializer, JobPositionSerializer, JobPostingSerializer, ApplicantSerializer,
    InterviewSerializer, OfferLetterSerializer, EmployeeSerializer, EmployeeListSerializer,
    EmployeeDocumentSerializer, LeaveBalanceSerializer, LeaveSerializer, AttendanceSerializer,
    OvertimeRecordSerializer, ReviewCycleSerializer, GoalSerializer, PerformanceReviewSerializer,
    Feedback360Serializer, TrainingSerializer, TimeSheetSerializer, TimeSheetEntrySerializer,
    HolidaySerializer
)


def get_org_id(request):
    user = request.user
    if hasattr(user, 'organization') and user.organization:
        return user.organization.id
    return getattr(user, 'organization_id', None)


def get_org(request):
    from core.models import Organization
    user = request.user
    if hasattr(user, 'organization') and user.organization:
        return user.organization
    org_id = getattr(user, 'organization_id', None)
    if org_id:
        try:
            return Organization.objects.get(id=org_id)
        except Organization.DoesNotExist:
            return None
    return None


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return Department.objects.filter(organization_id=org_id).select_related('parent')
        return Department.objects.none()

    def perform_create(self, serializer):
        org_id = get_org_id(self.request)
        if org_id:
            from core.models import Organization
            org = Organization.objects.get(id=org_id)
            serializer.save(organization=org)
        else:
            serializer.save()


class JobPositionViewSet(viewsets.ModelViewSet):
    queryset = JobPosition.objects.all()
    serializer_class = JobPositionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'department__name']
    ordering_fields = ['title', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return JobPosition.objects.filter(organization_id=org_id).select_related('department')
        return JobPosition.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()


class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'position__title', 'location']
    ordering_fields = ['created_at', 'posted_date', 'closing_date']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return JobPosting.objects.filter(organization_id=org_id).select_related('position', 'position__department')
        return JobPosting.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        posting = self.get_object()
        posting.status = 'open'
        posting.posted_date = timezone.now().date()
        posting.save()
        return Response(JobPostingSerializer(posting).data)

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        posting = self.get_object()
        posting.status = 'closed'
        posting.save()
        return Response(JobPostingSerializer(posting).data)


class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['created_at', 'status']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return Applicant.objects.filter(organization_id=org_id).select_related('job_posting')
        return Applicant.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        applicant = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Applicant.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        applicant.status = new_status
        applicant.save()
        return Response(ApplicantSerializer(applicant).data)


class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['applicant__first_name', 'applicant__last_name']
    ordering_fields = ['scheduled_date', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return Interview.objects.filter(organization_id=org_id).select_related('applicant', 'interviewer')
        return Interview.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        interview = self.get_object()
        interview.status = 'completed'
        interview.feedback = request.data.get('feedback', '')
        interview.rating = request.data.get('rating')
        interview.recommendation = request.data.get('recommendation', '')
        interview.save()
        return Response(InterviewSerializer(interview).data)


class OfferLetterViewSet(viewsets.ModelViewSet):
    queryset = OfferLetter.objects.all()
    serializer_class = OfferLetterSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['applicant__first_name', 'applicant__last_name']
    ordering_fields = ['created_at', 'start_date']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return OfferLetter.objects.filter(organization_id=org_id).select_related('applicant', 'position')
        return OfferLetter.objects.none()

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        offer = self.get_object()
        offer.status = 'sent'
        offer.sent_date = timezone.now().date()
        offer.save()
        return Response(OfferLetterSerializer(offer).data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        offer = self.get_object()
        offer.status = 'accepted'
        offer.response_date = timezone.now().date()
        offer.save()
        return Response(OfferLetterSerializer(offer).data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        offer = self.get_object()
        offer.status = 'declined'
        offer.response_date = timezone.now().date()
        offer.save()
        return Response(OfferLetterSerializer(offer).data)

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'position', 'department__name']
    ordering_fields = ['hire_date', 'created_at', 'employee_id']

    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSerializer
        return EmployeeSerializer

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = Employee.objects.filter(organization_id=org_id).select_related(
                'user', 'department', 'reporting_to', 'reporting_to__user'
            )
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            department = self.request.query_params.get('department')
            if department:
                queryset = queryset.filter(department_id=department)
            
            return queryset
        return Employee.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org_id = get_org_id(request)
        if not org_id:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        employees = Employee.objects.filter(organization_id=org_id)
        
        by_department = employees.values('department__name').annotate(
            count=Count('id')
        ).order_by('-count')
        
        by_employment_type = employees.values('employment_type').annotate(
            count=Count('id')
        )
        
        return Response({
            'total': employees.count(),
            'active': employees.filter(status='active').count(),
            'on_leave': employees.filter(status='on_leave').count(),
            'inactive': employees.filter(status='inactive').count(),
            'terminated': employees.filter(status='terminated').count(),
            'by_department': list(by_department),
            'by_employment_type': {item['employment_type']: item['count'] for item in by_employment_type},
        })

    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        employee = self.get_object()
        documents = employee.documents.all()
        return Response(EmployeeDocumentSerializer(documents, many=True).data)

    @action(detail=True, methods=['get'])
    def leave_balances(self, request, pk=None):
        employee = self.get_object()
        year = int(request.query_params.get('year', timezone.now().year))
        balances = LeaveBalance.objects.filter(employee=employee, year=year)
        return Response(LeaveBalanceSerializer(balances, many=True).data)

    @action(detail=True, methods=['get'])
    def attendance_summary(self, request, pk=None):
        employee = self.get_object()
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = Attendance.objects.filter(employee=employee)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        total_hours = queryset.aggregate(total=Sum('hours_worked'))['total'] or Decimal('0')
        late_days = queryset.filter(late_minutes__gt=0).count()
        
        return Response({
            'total_days': queryset.count(),
            'total_hours': total_hours,
            'late_days': late_days,
            'records': AttendanceSerializer(queryset[:30], many=True).data
        })


class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocument.objects.all()
    serializer_class = EmployeeDocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'document_type', 'employee__user__first_name', 'employee__user__last_name']
    ordering_fields = ['created_at', 'expiry_date']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = EmployeeDocument.objects.filter(organization_id=org_id).select_related('employee', 'verified_by')
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            doc_type = self.request.query_params.get('document_type')
            if doc_type:
                queryset = queryset.filter(document_type=doc_type)
            
            expiring = self.request.query_params.get('expiring_soon')
            if expiring == 'true':
                from datetime import timedelta
                threshold = timezone.now().date() + timedelta(days=30)
                queryset = queryset.filter(expiry_date__lte=threshold, expiry_date__isnull=False)
            
            return queryset
        return EmployeeDocument.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        document = self.get_object()
        document.is_verified = True
        document.verified_by = Employee.objects.filter(user=request.user).first()
        document.verified_at = timezone.now()
        document.save()
        return Response(EmployeeDocumentSerializer(document).data)


class LeaveBalanceViewSet(viewsets.ModelViewSet):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = LeaveBalance.objects.filter(organization_id=org_id).select_related('employee')
            
            year = self.request.query_params.get('year')
            if year:
                queryset = queryset.filter(year=int(year))
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            return queryset
        return LeaveBalance.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__user__first_name', 'employee__user__last_name', 'leave_type']
    ordering_fields = ['start_date', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = Leave.objects.filter(organization_id=org_id).select_related(
                'employee', 'employee__user', 'approved_by', 'delegation_employee'
            )
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            leave_type = self.request.query_params.get('leave_type')
            if leave_type:
                queryset = queryset.filter(leave_type=leave_type)
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            start_date = self.request.query_params.get('start_date')
            if start_date:
                queryset = queryset.filter(start_date__gte=start_date)
            
            end_date = self.request.query_params.get('end_date')
            if end_date:
                queryset = queryset.filter(end_date__lte=end_date)
            
            return queryset
        return Leave.objects.none()

    def perform_create(self, serializer):
        leave = serializer.save()
        year = leave.start_date.year
        balance, _ = LeaveBalance.objects.get_or_create(
            employee=leave.employee,
            leave_type=leave.leave_type,
            year=year,
            organization=leave.organization,
            defaults={'total_days': 0, 'used_days': 0, 'pending_days': 0}
        )
        balance.pending_days += leave.total_days
        balance.save()

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
        
        year = leave.start_date.year
        balance = LeaveBalance.objects.filter(
            employee=leave.employee,
            leave_type=leave.leave_type,
            year=year
        ).first()
        if balance:
            balance.pending_days -= leave.total_days
            balance.used_days += leave.total_days
            balance.save()
        
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
        leave.rejection_reason = request.data.get('reason', '')
        leave.save()
        
        year = leave.start_date.year
        balance = LeaveBalance.objects.filter(
            employee=leave.employee,
            leave_type=leave.leave_type,
            year=year
        ).first()
        if balance:
            balance.pending_days -= leave.total_days
            balance.save()
        
        return Response(LeaveSerializer(leave).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        leave = self.get_object()
        if leave.status not in ['pending', 'approved']:
            return Response({'error': 'Cannot cancel this leave'}, status=status.HTTP_400_BAD_REQUEST)
        
        original_status = leave.status
        leave.status = 'cancelled'
        leave.save()
        
        year = leave.start_date.year
        balance = LeaveBalance.objects.filter(
            employee=leave.employee,
            leave_type=leave.leave_type,
            year=year
        ).first()
        if balance:
            if original_status == 'approved':
                balance.used_days -= leave.total_days
            else:
                balance.pending_days -= leave.total_days
            balance.save()
        
        return Response(LeaveSerializer(leave).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org_id = get_org_id(request)
        if not org_id:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        leaves = Leave.objects.filter(organization_id=org_id)
        
        by_type = leaves.values('leave_type').annotate(count=Count('id'))
        
        return Response({
            'total': leaves.count(),
            'pending': leaves.filter(status='pending').count(),
            'approved': leaves.filter(status='approved').count(),
            'rejected': leaves.filter(status='rejected').count(),
            'by_type': {item['leave_type']: item['count'] for item in by_type},
        })


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__user__first_name', 'employee__user__last_name']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = Attendance.objects.filter(organization_id=org_id).select_related('employee', 'employee__user')
            
            date_filter = self.request.query_params.get('date')
            if date_filter:
                queryset = queryset.filter(date=date_filter)
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            department = self.request.query_params.get('department')
            if department:
                queryset = queryset.filter(employee__department_id=department)
            
            return queryset
        return Attendance.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()

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
        attendance.status = 'present'
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
            check_in_dt = datetime.combine(attendance.date, attendance.check_in)
            check_out_dt = datetime.combine(attendance.date, attendance.check_out)
            hours = (check_out_dt - check_in_dt).seconds / 3600
            attendance.hours_worked = round(Decimal(hours), 2)
        attendance.save()
        return Response(AttendanceSerializer(attendance).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org_id = get_org_id(request)
        if not org_id:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        today = timezone.now().date()
        today_attendance = Attendance.objects.filter(organization_id=org_id, date=today)
        
        avg_hours = today_attendance.aggregate(avg=Avg('hours_worked'))['avg'] or Decimal('0')
        
        return Response({
            'total_records': today_attendance.count(),
            'present_today': today_attendance.filter(status='present').count(),
            'late_today': today_attendance.filter(status='late').count(),
            'absent_today': today_attendance.filter(status='absent').count(),
            'average_hours': avg_hours,
        })

    @action(detail=False, methods=['get'])
    def monthly_report(self, request):
        org_id = get_org_id(request)
        if not org_id:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        month = int(request.query_params.get('month', timezone.now().month))
        year = int(request.query_params.get('year', timezone.now().year))
        
        start_date = datetime(year, month, 1).date()
        if month == 12:
            end_date = datetime(year + 1, 1, 1).date() - timedelta(days=1)
        else:
            end_date = datetime(year, month + 1, 1).date() - timedelta(days=1)
        
        attendance = Attendance.objects.filter(
            organization_id=org_id,
            date__gte=start_date,
            date__lte=end_date
        )
        
        by_status = attendance.values('status').annotate(count=Count('id'))
        
        return Response({
            'month': month,
            'year': year,
            'total_records': attendance.count(),
            'total_hours': attendance.aggregate(total=Sum('hours_worked'))['total'] or Decimal('0'),
            'by_status': {item['status']: item['count'] for item in by_status},
        })


class OvertimeRecordViewSet(viewsets.ModelViewSet):
    queryset = OvertimeRecord.objects.all()
    serializer_class = OvertimeRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return OvertimeRecord.objects.filter(organization_id=org_id).select_related('employee', 'approved_by')
        return OvertimeRecord.objects.none()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        record = self.get_object()
        record.status = 'approved'
        record.approved_by = Employee.objects.filter(user=request.user).first()
        record.approved_at = timezone.now()
        record.save()
        return Response(OvertimeRecordSerializer(record).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        record = self.get_object()
        record.status = 'rejected'
        record.save()
        return Response(OvertimeRecordSerializer(record).data)

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()


class ReviewCycleViewSet(viewsets.ModelViewSet):
    queryset = ReviewCycle.objects.all()
    serializer_class = ReviewCycleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['start_date', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return ReviewCycle.objects.filter(organization_id=org_id)
        return ReviewCycle.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'category']
    ordering_fields = ['due_date', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = Goal.objects.filter(organization_id=org_id).select_related('employee', 'review_cycle')
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            cycle = self.request.query_params.get('cycle')
            if cycle:
                queryset = queryset.filter(review_cycle_id=cycle)
            
            return queryset
        return Goal.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        goal = self.get_object()
        progress = int(request.data.get('progress_percentage', 0))
        goal.progress_percentage = min(100, max(0, progress))
        
        if progress >= 100:
            goal.status = 'completed'
            goal.progress = 'achieved'
        elif progress >= 75:
            goal.progress = 'on_track'
        elif progress >= 25:
            goal.progress = 'at_risk'
        else:
            goal.progress = 'not_started'
        
        goal.save()
        return Response(GoalSerializer(goal).data)


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return PerformanceReview.objects.filter(organization_id=org_id).select_related(
                'employee', 'reviewer', 'review_cycle'
            )
        return PerformanceReview.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()


class Feedback360ViewSet(viewsets.ModelViewSet):
    queryset = Feedback360.objects.all()
    serializer_class = Feedback360Serializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    ordering_fields = ['created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            return Feedback360.objects.filter(organization_id=org_id).select_related('employee', 'reviewer', 'review_cycle')
        return Feedback360.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()


class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'provider']
    ordering_fields = ['start_date', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = Training.objects.filter(organization_id=org_id).prefetch_related('employees')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            return queryset
        return Training.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()


class TimeSheetViewSet(viewsets.ModelViewSet):
    queryset = TimeSheet.objects.all()
    serializer_class = TimeSheetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['week_start', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = TimeSheet.objects.filter(organization_id=org_id).select_related('employee', 'approved_by')
            
            employee = self.request.query_params.get('employee')
            if employee:
                queryset = queryset.filter(employee_id=employee)
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            return queryset
        return TimeSheet.objects.none()

    def perform_create(self, serializer):
        timesheet = serializer.save()
        total_hours = sum(entry.hours for entry in timesheet.entries.all())
        timesheet.total_hours = total_hours
        timesheet.save()

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.status = 'submitted'
        timesheet.save()
        return Response(TimeSheetSerializer(timesheet).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.status = 'approved'
        timesheet.approved_by = Employee.objects.filter(user=request.user).first()
        timesheet.approved_at = timezone.now()
        timesheet.save()
        return Response(TimeSheetSerializer(timesheet).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.status = 'rejected'
        timesheet.notes = request.data.get('notes', '')
        timesheet.save()
        return Response(TimeSheetSerializer(timesheet).data)


class HolidayViewSet(viewsets.ModelViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        org_id = get_org_id(self.request)
        if org_id:
            queryset = Holiday.objects.filter(organization_id=org_id)
            
            year = self.request.query_params.get('year')
            if year:
                queryset = queryset.filter(date__year=int(year))
            
            upcoming = self.request.query_params.get('upcoming')
            if upcoming == 'true':
                queryset = queryset.filter(date__gte=timezone.now().date())
            
            return queryset
        return Holiday.objects.none()

    def perform_create(self, serializer):
        org = get_org(self.request)
        if org:
            serializer.save(organization=org)
        else:
            serializer.save()
