from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Campaign
from ngos.models import NGO

class CreateCampaignAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        try:
            ngo = NGO.objects.get(user=user)
        except NGO.DoesNotExist:
            return Response(
                {"error": "NGO profile not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        campaign = Campaign.objects.create(
            ngo=ngo,  # ✅ THIS IS THE KEY LINE
            title=request.data.get("title"),
            description=request.data.get("description"),
            target_amount=request.data.get("target_amount"),
            category=request.data.get("category"),
            deadline=request.data.get("deadline"),
            is_active=True
        )

        return Response(
            {"message": "Campaign created successfully"},
            status=status.HTTP_201_CREATED
        )


class MyCampaignsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            ngo = NGO.objects.get(user=user)
        except NGO.DoesNotExist:
            return Response([], status=200)

        campaigns = Campaign.objects.filter(ngo=ngo)

        data = [
            {
                "id": c.id,
                "title": c.title,
                "target_amount": c.target_amount,
                "category": c.category,
                "deadline": c.deadline,
                "is_active": c.is_active,
            }
            for c in campaigns
        ]

        return Response(data)
