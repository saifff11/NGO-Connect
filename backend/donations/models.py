from django.db import models
from users.models import User
from campaigns.models import Campaign

class Donation(models.Model):
    donor = models.ForeignKey(User, on_delete=models.CASCADE)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    certificate = models.FileField(
        upload_to="certificates/",
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.donor.email} - {self.amount}"
