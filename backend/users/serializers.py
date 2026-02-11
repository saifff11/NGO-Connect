from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import User
from ngos.models import NGO


class UserRegisterSerializer(serializers.ModelSerializer):
    ngo_name = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        write_only=True
    )

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "password",
            "role",
            "ngo_name",
        )

    def validate(self, data):
        role = data.get("role")
        
        if role == "admin":
            raise ValidationError("Admin registration is not allowed")


        if role == "ngo":
            ngo_name = data.get("ngo_name")
            if not ngo_name:
                raise serializers.ValidationError({
                    "ngo_name": "NGO name is required for NGO registration"
                })

        if role != "ngo":
            data.pop("ngo_name", None)

        return data

    def create(self, validated_data):
        ngo_name = validated_data.pop("ngo_name", None)
        password = validated_data.pop("password")

        role = validated_data.get("role")

        # default active only for donor
        is_active = False if role in ["ngo", "volunteer"] else True

        user = User.objects.create_user(
            password=password,
            is_active=is_active,
            **validated_data
        )

        if user.role == "ngo":
            NGO.objects.create(
                user=user,
                name=ngo_name,
                is_approved=False
            )

        return user



# ✅ THIS WAS MISSING (CAUSE OF ERROR)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "is_active",
            "created_at",   # ADD THIS
        ]