from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, JobPositionViewSet, JobPostingViewSet, ApplicantViewSet,
    InterviewViewSet, OfferLetterViewSet, EmployeeViewSet, EmployeeDocumentViewSet,
    LeaveBalanceViewSet, LeaveViewSet, AttendanceViewSet, OvertimeRecordViewSet,
    ReviewCycleViewSet, GoalViewSet, PerformanceReviewViewSet, Feedback360ViewSet,
    TrainingViewSet, TimeSheetViewSet, HolidayViewSet
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'positions', JobPositionViewSet, basename='position')
router.register(r'job-postings', JobPostingViewSet, basename='job-posting')
router.register(r'applicants', ApplicantViewSet, basename='applicant')
router.register(r'interviews', InterviewViewSet, basename='interview')
router.register(r'offers', OfferLetterViewSet, basename='offer')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'documents', EmployeeDocumentViewSet, basename='document')
router.register(r'leave-balances', LeaveBalanceViewSet, basename='leave-balance')
router.register(r'leaves', LeaveViewSet, basename='leave')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'overtime', OvertimeRecordViewSet, basename='overtime')
router.register(r'review-cycles', ReviewCycleViewSet, basename='review-cycle')
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'reviews', PerformanceReviewViewSet, basename='review')
router.register(r'feedback-360', Feedback360ViewSet, basename='feedback-360')
router.register(r'trainings', TrainingViewSet, basename='training')
router.register(r'timesheets', TimeSheetViewSet, basename='timesheet')
router.register(r'holidays', HolidayViewSet, basename='holiday')

urlpatterns = [
    path('', include(router.urls)),
]
