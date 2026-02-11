from django.urls import path
from .views import DonateAPIView, MyDonationsAPIView, NGODonationsAPIView

urlpatterns = [
    path("donate/", DonateAPIView.as_view()),
    path("my/", MyDonationsAPIView.as_view()),
    path("ngo/", NGODonationsAPIView.as_view()),
]
