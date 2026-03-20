from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import RegisterView, LoginView, LogoutView, RefreshTokenView, UserMeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView, name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', RefreshTokenView.as_view(), name='token-refresh'),
    path('me/', UserMeView.as_view(), name='user-me'),
]
