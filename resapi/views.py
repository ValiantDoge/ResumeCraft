from django.http import FileResponse
import io
from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import registerFont, registerFontFamily
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.graphics.shapes import *
from PIL import Image as PImage

from rest_framework.decorators import api_view
from rest_framework.response import Response


# Create your views here.

registerFont(TTFont('Lato-Regular', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Regular.ttf')))
registerFont(TTFont('Lato-Bold', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Bold.ttf')))
registerFont(TTFont('Lato-Italic', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Italic.ttf')))
registerFont(TTFont('Lato-BoldItalic', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-BoldItalic.ttf')))

@api_view(['GET', 'POST'])
def createResume(request):
    if request.method == 'POST':
        tempId = str(request.POST.get("tempId"))
        fname = str(request.POST.get("fname"))
        lname = str(request.POST.get("lname"))
        email = str(request.POST.get("email"))
        contactNo = str(request.POST.get("contactNo") )
        uploaded_image = request.FILES.get('userPicture')

        print(tempId)

        # info = [fname, lname, email, contactNo]

        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=letter, bottomup=0)
        canvas_width, canvas_height = letter

        #Draw the style rectangles
        d = Drawing(300, canvas_height)
        d.add(Rect(0, 30, canvas_width, 200, fillColor=colors.HexColor('#EBC9BB'), strokeColor=None))
        d.add(Rect(30, 0, 200, canvas_height, fillColor=colors.HexColor('#6B9999'), strokeColor=None))
        d.drawOn(c, 0, 0)

        #Draw the text
        writeName = c.beginText(250, 130)
        c.setFont('Helvetica', 24)
        writeName.textLine(fname.upper())
        writeName.textLine(lname.upper())   
        c.drawText(writeName) 

        circle_drawing = Drawing(width=100, height=100)
        circle = Circle(50, 50, 90, strokeColor=None, fillColor=colors.white)
        circle_drawing.add(circle)
        circle_drawing.drawOn(c, 80, 80)

        if uploaded_image:
            image_path = os.path.join(settings.MEDIA_ROOT, uploaded_image.name)
            if not os.path.exists(os.path.dirname(image_path)):
                os.makedirs(os.path.dirname(image_path))
            
            with open(image_path, 'wb') as destination:
                for chunk in uploaded_image.chunks():
                    destination.write(chunk)

            with PImage.open(image_path) as img:
                img = img.transpose(PImage.FLIP_TOP_BOTTOM)
                img.save(image_path, format='PNG')

            c.drawImage(image_path, 45, 45, width=170, height=170, mask='auto')
        
        # c.showPage()
        
        c.save()
        if uploaded_image:
            if os.path.exists(image_path):
                os.remove(image_path)

        buf.seek(0)
        return FileResponse(buf, as_attachment=True, filename='resume.pdf')

    return Response({'message': 'Message From Django'})