import os
from django.conf import settings
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def generate_certificate(donation):
    filename = f"donation_certificate_{donation.id}.pdf"

    folder_path = os.path.join(settings.MEDIA_ROOT, "certificates")
    os.makedirs(folder_path, exist_ok=True)

    file_path = os.path.join(folder_path, filename)

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2, height - 100, "Donation Certificate")

    c.setFont("Helvetica", 14)
    c.drawCentredString(
        width / 2,
        height - 170,
        f"This certifies that"
    )

    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(
        width / 2,
        height - 200,
        f"{donation.donor.first_name} {donation.donor.last_name}"
    )

    c.setFont("Helvetica", 14)
    c.drawCentredString(
        width / 2,
        height - 240,
        f"donated ₹{donation.amount}"
    )

    c.drawCentredString(
        width / 2,
        height - 280,
        f"to the campaign '{donation.campaign.title}'"
    )

    c.drawCentredString(
        width / 2,
        height - 340,
        "Thank you for your generosity ❤️"
    )

    c.showPage()
    c.save()

    return f"certificates/{filename}"
