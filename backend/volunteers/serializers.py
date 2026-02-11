from rest_framework import serializers
from .models import VolunteerApplication

class VolunteerApplicationSerializer(serializers.ModelSerializer):
    campaign_title = serializers.CharField(
        source="campaign.title",
        read_only=True
    )
    ngo_name = serializers.CharField(
        source="ngo.name",
        read_only=True
    )
    volunteer_name = serializers.CharField(
        source="volunteer.first_name",
        read_only=True
    )


    class Meta:
        model = VolunteerApplication
        fields = [
            "id",
            "campaign",
            "campaign_title",
            "ngo_name",
            "volunteer_name",
            "status",
            "applied_at",
        ]
        read_only_fields = ["status", "applied_at"]
