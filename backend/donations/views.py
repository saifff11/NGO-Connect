from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from .models import Donation
from .serializers import DonationSerializer
from .utils import generate_certificate

from campaigns.models import Campaign
from ngos.models import NGO


# 💰 Donor → Donate to a campaign
class DonateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user

        if user.role != "donor":
            return Response(
                {"detail": "Only donors can donate"},
                status=status.HTTP_403_FORBIDDEN
            )

        campaign_id = request.data.get("campaign")
        amount = request.data.get("amount")

        if not campaign_id or not amount:
            return Response(
                {"detail": "Campaign and amount are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            campaign = Campaign.objects.get(
                id=campaign_id,
                is_active=True
            )
        except Campaign.DoesNotExist:
            return Response(
                {"detail": "Campaign not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        donation = Donation.objects.create(
            donor=user,
            campaign=campaign,
            amount=int(amount)
        )

        # ✅ Generate Certificate
        certificate_path = generate_certificate(donation)
        donation.certificate = certificate_path
        donation.save()

        # ✅ Update campaign amount
        campaign.raised_amount += int(amount)
        campaign.save()

        serializer = DonationSerializer(donation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# 🏢 NGO → View donations received
class NGODonationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "ngo":
            return Response(
                {"detail": "Only NGOs can view donations"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            ngo = NGO.objects.get(user=request.user)
        except NGO.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)

        donations = Donation.objects.filter(
            campaign__ngo=ngo
        ).order_by("-created_at")

        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)


# 🙋 Donor → View own donations
class MyDonationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "donor":
            return Response(
                {"detail": "Only donors can view this"},
                status=status.HTTP_403_FORBIDDEN
            )

        donations = Donation.objects.filter(
            donor=request.user
        ).order_by("-created_at")

        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)
