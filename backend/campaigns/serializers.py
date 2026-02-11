from rest_framework import serializers
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    ngo_name = serializers.CharField(source="ngo.name", read_only=True)

    class Meta:
        model = Campaign
        fields = [
            "id",
            "title",
            "description",
            "target_amount",
            "raised_amount",
            "category",
            "end_date",
            "is_active",
            "ngo_name",
            "created_at",
        ]

        read_only_fields = [
            "raised_amount",
            "ngo_name",
            "created_at",
        ]
