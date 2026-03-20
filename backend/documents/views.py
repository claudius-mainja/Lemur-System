from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['doc_type', 'is_public', 'folder']
    search_fields = ['title', 'description', 'file_name']
    ordering_fields = ['created_at', 'title', 'doc_type']

    def get_queryset(self):
        user = self.request.user
        queryset = Document.objects.all()
        
        if user.role not in ['super_admin', 'admin']:
            queryset = queryset.filter(organization_id=user.organization_id)
        
        return queryset

    def perform_create(self, serializer):
        document = serializer.save(
            organization_id=self.request.user.organization_id,
            uploaded_by=self.request.user.id,
            uploaded_by_name=self.request.user.full_name
        )

    @action(detail=False, methods=['get'])
    def folders(self, request):
        folders = self.get_queryset().values_list('folder', flat=True).distinct()
        return Response({'folders': [f for f in folders if f]})
