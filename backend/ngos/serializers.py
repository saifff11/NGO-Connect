from rest_framework import serializers
from .models import NGO

class NGOSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGO
        fields = [
            "id",
            "name",
            "is_approved",
            "created_at",
        ]
