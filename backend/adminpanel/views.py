from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminUserRole
from users.models import User
from campaigns.models import Campaign
from donations.models import Donation
from django.db.models import Sum, Count

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
