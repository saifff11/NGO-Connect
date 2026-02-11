from django.urls import path
from .api import RegisterAPIView, LoginAPIView, ProfileAPIView
from .views import AdminUsersAPIView, AdminAnalyticsAPIView, ToggleUserStatusAPIView, PendingApprovalsAPIView, PendingNGOsAPIView, PendingUsersAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("profile/", ProfileAPIView.as_view()),
    path("admin/users/", AdminUsersAPIView.as_view()),
    path("analytics/", AdminAnalyticsAPIView.as_view()),
    path("admin/users/<int:user_id>/toggle/", ToggleUserStatusAPIView.as_view()),
    path("admin/pending/", PendingApprovalsAPIView.as_view()),
    path("admin/pending-ngos/", PendingNGOsAPIView.as_view()),
    path("admin/pending-users/", PendingUsersAPIView.as_view()),



]
