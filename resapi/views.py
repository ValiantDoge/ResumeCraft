from django.http import FileResponse
import io
from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import registerFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.graphics.shapes import *
from PIL import Image as PImage
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph


from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

registerFont(TTFont('LatoRegular', os.path.join(settings.BASE_DIR, 'resapi','static', 'fonts', 'Lato', 'Lato-Regular.ttf') ))
registerFont(TTFont('LatoBold', os.path.join(settings.BASE_DIR, 'resapi','static', 'fonts', 'Lato', 'Lato-Bold.ttf') ))
registerFont(TTFont('LoraItalic',  os.path.join(settings.BASE_DIR, 'public','Lora-Italic.ttf') ))

@api_view(['GET', 'POST'])
def createResume(request):

    if request.method == 'POST':
        tempId = str(request.POST.get("tempId"))
        fname = str(request.POST.get("fname"))
        lname = str(request.POST.get("lname"))
        email = str(request.POST.get("email"))
        contactNo = str(request.POST.get("contactNo") )
        uploaded_image = request.FILES.get('userPicture')

        # info = [fname, lname, email, contactNo]

        #Creating the Canvas
        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=letter, bottomup=0)
        style = getSampleStyleSheet()
        canvas_width, canvas_height = letter
        #Draw the style rectangles
        d = Drawing(300, canvas_height)
        d.add(Rect(0, 30, canvas_width, 200, fillColor=colors.HexColor('#EBC9BB'), strokeColor=None))
        d.add(Rect(30, 0, 200, canvas_height, fillColor=colors.HexColor('#6B9999'), strokeColor=None))
        d.drawOn(c, 0, 0)

        
        #Drawing a Circle for the Image
        circle_drawing = Drawing(width=100, height=100)
        circle = Circle(50, 50, 90, strokeColor=None, fillColor=colors.white)
        circle_drawing.add(circle)
        circle_drawing.drawOn(c, 80, 80)

        #Get the image from the POST response and Place it over the circle
        if uploaded_image:
            image_path = os.path.join(settings.MEDIA_ROOT, uploaded_image.name)
            #Save the image to media folder first
            if not os.path.exists(os.path.dirname(image_path)):
                os.makedirs(os.path.dirname(image_path))
            
            #Save the image
            with open(image_path, 'wb') as destination:
                for chunk in uploaded_image.chunks():
                    destination.write(chunk)

            #Since our canvas has the property bottomup=0, Use PIL to rotate our image
            with PImage.open(image_path) as img:
                img = img.transpose(PImage.FLIP_TOP_BOTTOM)
                img.save(image_path, format='PNG')

            #Place it over the circle
            c.drawImage(image_path, 45, 45, width=170, height=170, mask='auto')
        
        # c.showPage()

        #Draw the Header text
        c.setFont('LatoBold', 24)
        c.drawString(250, 130, fname.upper())
        c.drawString(250, 154, lname.upper())
        c.setFont('LoraItalic', 16)
        profession = """<font name="LoraItalic" size="16">Student</font>"""
        p = Paragraph(profession, style=style["Normal"])
        p.wrapOn(c, canvas_width, canvas_height)
        p.drawOn(c, 250, 174, mm)

        c.save()
        if uploaded_image:
            if os.path.exists(image_path):
                os.remove(image_path)

        buf.seek(0)
        return FileResponse(buf, as_attachment=True, filename='resume.pdf')

    return Response({'message': 'Message From Django'})