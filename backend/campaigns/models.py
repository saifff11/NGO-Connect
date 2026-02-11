from django.db import models
from ngos.models import NGO

class Campaign(models.Model):
    CATEGORY_CHOICES = [
        ("Education", "Education"),
        ("Health", "Health"),
        ("Poverty", "Poverty"),
        ("Women", "Women"),
    ]

    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    target_amount = models.PositiveIntegerField()
    raised_amount = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    end_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)  # ✅ ADD THIS
    is_active = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)
    
    impact_metric = models.CharField(
        max_length=100,
        default="Meals Provided"
    )

    impact_per_rupee = models.FloatField(
        default=0.02
    )

    def __str__(self):
        return self.title
