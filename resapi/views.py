from django.http import FileResponse
import io
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import letter


from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(['GET', 'POST'])
def createResume(request):
    if request.method == 'POST':
        fname = request.POST.get("fname")
        lname = request.POST.get("lname")
        email = request.POST.get("email")
        contactNo = request.POST.get("contactNo") 

        info = [fname, lname, email, contactNo]

        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=letter, bottomup=0)
        txtob = c.beginText()
        txtob.setTextOrigin(inch, inch)
        txtob.setFont("Helvetica", 14)

        for i in info:
            txtob.textLine(i)

        c.drawText(txtob)
        c.showPage()
        
        c.save()
        buf.seek(0)
        return FileResponse(buf, as_attachment=True, filename='resume.pdf')

    return Response({'message': 'Message From Django'})