from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import NGO
from .serializers import NGOSerializer

class MyNGOProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            ngo = NGO.objects.get(user=request.user)
        except NGO.DoesNotExist:
            return Response(
                {"detail": "NGO profile not found"},
                status=404
            )

        serializer = NGOSerializer(ngo)
        return Response(serializer.data)
