from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FolderViewSet, DocumentViewSet,
    ProjectViewSet, MilestoneViewSet,
    BoardViewSet, TaskViewSet, TaskCommentViewSet, TimeEntryViewSet,
    EventViewSet, ChannelViewSet, MessageViewSet, SharedLinkViewSet
)

router = DefaultRouter()
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'boards', BoardViewSet, basename='board')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'task-comments', TaskCommentViewSet, basename='task-comment')
router.register(r'time-entries', TimeEntryViewSet, basename='time-entry')
router.register(r'events', EventViewSet, basename='event')
router.register(r'channels', ChannelViewSet, basename='channel')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'shared-links', SharedLinkViewSet, basename='shared-link')

urlpatterns = [
    path('', include(router.urls)),
]
