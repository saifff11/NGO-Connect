from django.contrib import admin
from .models import NGO

@admin.register(NGO)
class NGOAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "is_approved")
    list_filter = ("is_approved",)
    search_fields = ("name", "user__email")
