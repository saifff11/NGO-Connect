from django.urls import path
from .views import MyNGOProfileAPIView

urlpatterns = [
    path("me/", MyNGOProfileAPIView.as_view(), name="ngo-profile"),
]
