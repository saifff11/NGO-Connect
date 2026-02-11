from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer
from .permissions import IsAdminUserRole
from campaigns.models import Campaign
from donations.models import Donation
from django.db.models import Sum, Count

class AdminUsersAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        users = User.objects.all().order_by("-created_at")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class AdminAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        # USERS
        total_users = User.objects.count()
        donors = User.objects.filter(role="donor").count()
        ngos = User.objects.filter(role="ngo").count()
        volunteers = User.objects.filter(role="volunteer").count()

        # CAMPAIGNS
        total_campaigns = Campaign.objects.count()
        active_campaigns = Campaign.objects.filter(is_active=True).count()

        # DONATIONS
        total_donations = Donation.objects.count()
        total_amount = Donation.objects.aggregate(
            total=Sum("amount")
        )["total"] or 0

        # DONATIONS PER CAMPAIGN
        campaign_donations = (
            Donation.objects
            .values("campaign__title")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )

        return Response({
            "stats": {
                "total_users": total_users,
                "donors": donors,
                "ngos": ngos,
                "volunteers": volunteers,
                "total_campaigns": total_campaigns,
                "active_campaigns": active_campaigns,
                "total_donations": total_donations,
                "total_amount": total_amount,
            },
            "donations_by_campaign": campaign_donations,
        })
        
class ToggleUserStatusAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user.is_active = not user.is_active
        user.save()

        return Response({
            "message": "User status updated",
            "is_active": user.is_active
        })

class PendingApprovalsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        pending_ngos = User.objects.filter(
            role="ngo",
            is_active=False
        ).count()

        pending_volunteers = User.objects.filter(
            role="volunteer",
            is_active=False
        ).count()

        return Response({
            "pending_ngos": pending_ngos,
            "pending_volunteers": pending_volunteers
        })

class PendingNGOsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        ngos = User.objects.filter(role="ngo", is_active=False)
        serializer = UserSerializer(ngos, many=True)
        return Response(serializer.data)

class PendingUsersAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        users = User.objects.filter(is_active=False)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
