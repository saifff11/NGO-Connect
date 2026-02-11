from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Count, Q
from users.models import User
from .models import VolunteerApplication
from .models import VolunteerTask
from .models import VolunteerImpact
from .serializers import VolunteerApplicationSerializer
from campaigns.models import Campaign
from ngos.models import NGO
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from io import BytesIO
import qrcode
from reportlab.lib.utils import ImageReader
from io import BytesIO



class ApplyToCampaignAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role != "volunteer":
            return Response({"detail": "Only volunteers allowed"}, status=403)

        campaign_id = request.data.get("campaign")

        try:
            campaign = Campaign.objects.get(id=campaign_id, is_active=True)
        except Campaign.DoesNotExist:
            return Response({"detail": "Campaign not found"}, status=404)

        ngo = campaign.ngo

        if VolunteerApplication.objects.filter(
            volunteer=user, campaign=campaign
        ).exists():
            return Response({"detail": "Already applied"}, status=400)

        VolunteerApplication.objects.create(
            volunteer=user,
            campaign=campaign,
            ngo=ngo
        )

        return Response({"message": "Applied successfully"})


class MyVolunteerApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "volunteer":
            return Response(
                {"detail": "Only volunteers can access"},
                status=403
            )

        applications = VolunteerApplication.objects.filter(
            volunteer=request.user
        ).order_by("-applied_at")

        serializer = VolunteerApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class NGOVolunteerApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "ngo":
            return Response(
                {"detail": "Only NGOs can access"},
                status=403
            )

        ngo = NGO.objects.get(user=request.user)

        applications = VolunteerApplication.objects.filter(
            ngo=ngo
        ).order_by("-applied_at")

        serializer = VolunteerApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class UpdateVolunteerStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, application_id):
        if request.user.role != "ngo":
            return Response(
                {"detail": "Only NGOs can perform this action"},
                status=403
            )

        action = request.data.get("action")

        try:
            application = VolunteerApplication.objects.get(id=application_id)
        except VolunteerApplication.DoesNotExist:
            return Response({"detail": "Application not found"}, status=404)

        if action == "approve":
            application.status = "approved"
        elif action == "reject":
            application.status = "rejected"
        else:
            return Response({"detail": "Invalid action"}, status=400)

        application.save()
        return Response({"message": "Status updated"})

class VolunteerDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "volunteer":
            return Response({"detail": "Unauthorized"}, status=403)

        applications = VolunteerApplication.objects.filter(volunteer=user)

        campaigns_joined = applications.filter(status="approved").count()

        ngos_associated = (
            applications.filter(status="approved")
            .values("ngo")
            .distinct()
            .count()
        )

        return Response({
            "campaigns_joined": campaigns_joined,
            "ngos_associated": ngos_associated,
            "tasks_completed": 0,     # future ready
            "hours_contributed": 0,   # future ready
        })
        
class VolunteerNGOsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ngos = NGO.objects.filter(is_approved=True)
        data = [{"id": n.id, "name": n.name} for n in ngos]
        return Response(data)

class AssignVolunteerTaskAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "ngo":
            return Response({"detail": "Only NGOs allowed"}, status=403)

        application_id = request.data.get("application_id")
        title = request.data.get("title")
        description = request.data.get("description")

        try:
            application = VolunteerApplication.objects.get(id=application_id, status="approved")
        except VolunteerApplication.DoesNotExist:
            return Response({"detail": "Application not found"}, status=404)

        VolunteerTask.objects.create(
            volunteer=application.volunteer,
            campaign=application.campaign,
            ngo=application.ngo,
            title=title,
            description=description,
        )

        return Response({"message": "Task assigned"})

class VolunteerTasksAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "volunteer":
            return Response({"detail": "Unauthorized"}, status=403)

        tasks = VolunteerTask.objects.filter(volunteer=request.user)
        data = [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "status": t.status,
                "campaign": t.campaign.title,
            }
            for t in tasks
        ]

        return Response(data)

class UpdateTaskStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        if request.user.role != "volunteer":
            return Response({"detail": "Unauthorized"}, status=403)

        try:
            task = VolunteerTask.objects.get(id=task_id, volunteer=request.user)
        except VolunteerTask.DoesNotExist:
            return Response({"detail": "Task not found"}, status=404)

        task.status = "completed"
        task.save()

        return Response({"message": "Task marked completed"})

class CompleteTaskAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        if request.user.role != "volunteer":
            return Response({"detail": "Unauthorized"}, status=403)

        try:
            task = VolunteerTask.objects.get(id=task_id, volunteer=request.user)
        except VolunteerTask.DoesNotExist:
            return Response({"detail": "Task not found"}, status=404)

        if task.status == "completed":
            return Response({"detail": "Already completed"})

        task.status = "completed"
        task.save()

        impact, _ = VolunteerImpact.objects.get_or_create(volunteer=request.user)
        impact.total_points += task.impact_points
        impact.save()

        return Response({"message": "Task completed"})

class VolunteerLeaderboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        volunteers = (
            User.objects.filter(role="volunteer")
            .annotate(
                tasks_completed=Count(
                    "volunteertask",
                    filter=Q(volunteertask__status="completed")
                )
            )
            .order_by("-tasks_completed")[:20]
        )

        data = [
            {
                "id": v.id,
                "name": v.first_name,
                "tasks_completed": v.tasks_completed,
                "impact_score": v.tasks_completed * 10
            }
            for v in volunteers
        ]

        return Response(data)
    

class VolunteerCertificateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):

        try:
            task = VolunteerTask.objects.get(
                id=task_id,
                volunteer=request.user,
                status="completed"
            )
        except VolunteerTask.DoesNotExist:
            return Response({"detail": "Certificate not available"}, status=404)

        buffer = BytesIO()
        p = canvas.Canvas(buffer)

        p.setFont("Helvetica-Bold", 18)
        p.drawCentredString(300, 750, "Certificate of Volunteering")

        p.setFont("Helvetica", 14)
        p.drawCentredString(
            300, 700,
            f"This certifies that {request.user.first_name}"
        )

        p.drawCentredString(
            300, 670,
            f"successfully completed volunteering task:"
        )

        p.drawCentredString(300, 640, task.title)

        p.drawCentredString(300, 600, f"NGO: {task.ngo.name}")
        
                # verification link
        verify_url = f"http://127.0.0.1:8000/api/volunteers/verify/{task.id}/"

        # create QR
        qr = qrcode.make(verify_url)

        # convert QR to buffer
        qr_buffer = BytesIO()
        qr.save(qr_buffer)
        qr_buffer.seek(0)

        # draw QR on PDF
        p.drawImage(ImageReader(qr_buffer), 250, 420, width=100, height=100)

        # label text
        p.drawCentredString(300, 400, "Scan to verify certificate")


        p.showPage()
        p.save()

        buffer.seek(0)

        return HttpResponse(
            buffer,
            content_type='application/pdf',
            headers={
                'Content-Disposition': 'attachment; filename="certificate.pdf"'
            }
        )

class VerifyCertificateAPIView(APIView):

    def get(self, request, task_id):
        try:
            task = VolunteerTask.objects.get(id=task_id, status="completed")
        except VolunteerTask.DoesNotExist:
            return Response({"valid": False})

        return Response({
            "valid": True,
            "volunteer": task.volunteer.first_name,
            "task": task.title,
            "ngo": task.ngo.name
        })
