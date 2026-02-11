from django.urls import path
from .views import (
    ApplyToCampaignAPIView,
    MyVolunteerApplicationsAPIView,
    NGOVolunteerApplicationsAPIView,
    UpdateVolunteerStatusAPIView,
    VolunteerDashboardAPIView,
    VolunteerNGOsAPIView,
    AssignVolunteerTaskAPIView,
    VolunteerTasksAPIView,
    UpdateTaskStatusAPIView,
    CompleteTaskAPIView,
    VolunteerLeaderboardAPIView,
    VolunteerCertificateAPIView,
    VerifyCertificateAPIView,
)

urlpatterns = [
    path("apply/", ApplyToCampaignAPIView.as_view()),
    path("my/", MyVolunteerApplicationsAPIView.as_view()),
    path("ngos/", VolunteerNGOsAPIView.as_view()),
    path("update/<int:application_id>/", UpdateVolunteerStatusAPIView.as_view()),
    path("dashboard/", VolunteerDashboardAPIView.as_view()),
    path("ngo/applications/", NGOVolunteerApplicationsAPIView.as_view()),
    path("ngo/assign-task/", AssignVolunteerTaskAPIView.as_view()),
    path("tasks/", VolunteerTasksAPIView.as_view()),
    path("task/<int:task_id>/complete/", UpdateTaskStatusAPIView.as_view()),
    path("task/complete/<int:task_id>/", CompleteTaskAPIView.as_view()),
    path("leaderboard/", VolunteerLeaderboardAPIView.as_view()),
    path("certificate/<int:task_id>/", VolunteerCertificateAPIView.as_view()),
    path("verify/<int:task_id>/", VerifyCertificateAPIView.as_view()),

]

