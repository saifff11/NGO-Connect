from django.urls import path
from .views import (
    CampaignListCreateView,
    MyCampaignsAPIView,
    PublicCampaignsAPIView,
    PublicCampaignDetailAPIView,
    AdminCampaignsAPIView, 
    ToggleCampaignStatusAPIView,
    AdminCampaignListAPIView,
    AdminCampaignActionAPIView,
    ImpactDashboardAPIView
)

urlpatterns = [
    # NGO
    path("", CampaignListCreateView.as_view()),
    path("my/", MyCampaignsAPIView.as_view()),

    # DONOR
    path("public/", PublicCampaignsAPIView.as_view()),
    path("public/<int:pk>/", PublicCampaignDetailAPIView.as_view()),
    
    path("admin/", AdminCampaignsAPIView.as_view()),
    path("admin/<int:pk>/toggle/", ToggleCampaignStatusAPIView.as_view()),
    
    path("admin/all/", AdminCampaignListAPIView.as_view()),
    path("admin/action/<int:campaign_id>/", AdminCampaignActionAPIView.as_view()),
    
    path("impact/", ImpactDashboardAPIView.as_view()),

]
