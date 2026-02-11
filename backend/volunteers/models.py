from django.db import models
from users.models import User
from campaigns.models import Campaign
from ngos.models import NGO

class VolunteerApplication(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    volunteer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "volunteer"}
    )
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.volunteer.email} → {self.campaign.title}"

class VolunteerTask(models.Model):
    STATUS_CHOICES = (
        ("assigned", "Assigned"),
        ("completed", "Completed"),
    )

    volunteer = models.ForeignKey(User, on_delete=models.CASCADE)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE)

    title = models.CharField(max_length=255)
    description = models.TextField()
    
    impact_points = models.IntegerField(default=10)   # NEW

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="assigned"
    )

    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} → {self.volunteer.email}"

class VolunteerImpact(models.Model):
    volunteer = models.OneToOneField(User, on_delete=models.CASCADE)
    total_points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.volunteer.email} - {self.total_points}"
