from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    campaign_title = serializers.CharField(
        source="campaign.title",
        read_only=True
    )

    certificate = serializers.FileField(read_only=True)

    class Meta:
        model = Donation
        fields = [
            "id",
            "campaign",
            "campaign_title",
            "amount",
            "created_at",
            "certificate",
        ]
