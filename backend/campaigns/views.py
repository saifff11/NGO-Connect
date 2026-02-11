from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from users.permissions import IsAdminUserRole
from .models import Campaign
from .serializers import CampaignSerializer
from ngos.models import NGO


# ======================================================
# NGO: Create campaign + list all (admin style)
# ======================================================
class CampaignListCreateView(ListCreateAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "ngo":
            raise ValidationError("Only NGOs can create campaigns")

        try:
            ngo = NGO.objects.get(user=user)
        except NGO.DoesNotExist:
            raise ValidationError("NGO profile not found")

        serializer.save(ngo=ngo)


# ======================================================
# NGO: My campaigns (private)
# ======================================================
class MyCampaignsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            ngo = NGO.objects.get(user=request.user)
        except NGO.DoesNotExist:
            return Response([], status=200)

        campaigns = Campaign.objects.filter(
            ngo=ngo
        ).order_by("-created_at")

        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)


# ======================================================
# DONOR: Browse all public campaigns
# ======================================================
class PublicCampaignsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        campaigns = Campaign.objects.filter(
            is_active=True
        ).order_by("-created_at")

        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)


# ======================================================
# DONOR: View single campaign (Donate page)
# ======================================================
class PublicCampaignDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            campaign = Campaign.objects.get(
                pk=pk,
                is_active=True
            )
        except Campaign.DoesNotExist:
            return Response(
                {"detail": "Campaign not found"},
                status=404
            )

        serializer = CampaignSerializer(campaign)
        return Response(serializer.data)


# ======================================================
# NGO / ADMIN: Campaign detail (private)
# ======================================================
class CampaignDetailAPIView(RetrieveAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]

class AdminCampaignsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        campaigns = Campaign.objects.all().order_by("-created_at")
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)
    
class ToggleCampaignStatusAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, pk):
        try:
            campaign = Campaign.objects.get(pk=pk)
        except Campaign.DoesNotExist:
            raise ValidationError("Campaign not found")

        campaign.is_active = not campaign.is_active
        campaign.save()

        return Response({
            "id": campaign.id,
            "is_active": campaign.is_active,
            "message": "Campaign status updated"
        })
        
class AdminCampaignListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            raise PermissionDenied("Only admin can access this")

        campaigns = Campaign.objects.all().order_by("-created_at")
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)
    
class AdminCampaignActionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, campaign_id):
        if request.user.role != "admin":
            raise PermissionDenied("Only admin can perform this action")

        action = request.data.get("action")

        campaign = Campaign.objects.get(id=campaign_id)

        if action == "approve":
            campaign.is_approved = True
            campaign.is_active = True

        elif action == "deactivate":
            campaign.is_active = False

        elif action == "activate":
            campaign.is_active = True

        else:
            return Response({"error": "Invalid action"}, status=400)

        campaign.save()
        return Response({"message": "Campaign updated successfully"})

class PublicCampaignsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        campaigns = Campaign.objects.filter(
            is_active=True,
            is_approved=True
        )
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)

class ImpactDashboardAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        campaigns = Campaign.objects.filter(is_active=True)

        total_donations = 0
        impact_data = []

        for c in campaigns:
            donations = c.raised_amount
            impact_value = donations * c.impact_per_rupee

            total_donations += donations

            impact_data.append({
                "campaign": c.title,
                "metric": c.impact_metric,
                "impact_value": round(impact_value),
                "raised_amount": donations,
            })

        return Response({
            "total_donations": total_donations,
            "impact": impact_data,
        })