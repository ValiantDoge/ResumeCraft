from django.http import FileResponse
import io
from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import registerFont, registerFontFamily
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.graphics.shapes import *
from PIL import Image as PImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph


from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

registerFont(TTFont('Lato', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Regular.ttf') ))
registerFont(TTFont('LatoBold', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Bold.ttf') ))
registerFont(TTFont('LatoBlack', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Black.ttf') ))

registerFont(TTFont('Lora',  os.path.join(settings.BASE_DIR, 'public','fonts', 'Lora','Lora-Regular.ttf') ))
registerFont(TTFont('LoraItalic',  os.path.join(settings.BASE_DIR, 'public','fonts', 'Lora','Lora-Italic.ttf') ))

registerFontFamily('Lora', normal='Lora', bold='LoraItalic')
style = getSampleStyleSheet()
style.add(ParagraphStyle(name='Content',
                    fontFamily='Lora',
                    fontSize=14,
                    leading=20,
                    wordWrap='LTR',
                    spaceAfter=0,
                    spaceBefore=0,
                    ))

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
        
        canvas_width, canvas_height = letter
        #Draw the style rectangles
        d = Drawing(300, canvas_height)
        d.add(Rect(0, 30, canvas_width, 200, fillColor=colors.HexColor('#EBC9BB'), strokeColor=None))
        d.add(Rect(30, 0, 210, canvas_height, fillColor=colors.HexColor('#6B9999'), strokeColor=None))
        d.drawOn(c, 0, 0)

        
        #Drawing a Circle for the Image
        circle_drawing = Drawing(width=100, height=100)
        circle = Circle(55, 50, 90, strokeColor=None, fillColor=colors.white)
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
            c.drawImage(image_path, 48.5, 43.5, width=173, height=173, mask='auto')
        
        # c.showPage()

        #Draw the Header text
        c.setFont('LatoBold', 28)
        c.drawString(250, 130, fname.upper())
        c.drawString(250, 160, lname.upper())
        c.setFont('LoraItalic', 14)
        profession_txt = """<font name="LoraItalic" size="16">Student</font>"""
        profession = Paragraph(profession_txt, style=style["Normal"])
        profession.wrapOn(c, canvas_width, canvas_height)
        profession.drawOn(c, 250, 188, mm)

        #Draw Profile Section
        
        profile_txt = """<font name="Lora" color="white" size="14">Business Administration student.<br/> I consider my self a responsible and orderly person.<br/> I am looking foward for my first work experience.</font>"""
        profile = Paragraph(profile_txt, style=style["Content"])
        profile.wrapOn(c, 180, 200)
        profile_lines = len(profile.split(180, 200))
        profile_height = profile_lines * 14

        c.setFont('LatoBlack', 16)
        c.setFillColor(colors.white)
        c.drawString(50, 280, 'PROFILE') #Profile Header
        profile.drawOn(c, 50, 180)

        #Draw Contact Info
        contact_me_y = 180 - profile_height - 40
        c.drawString(50, contact_me_y, 'CONTACT ME')

        c.save()
        if uploaded_image:
            if os.path.exists(image_path):
                os.remove(image_path)

        buf.seek(0)
        return FileResponse(buf, as_attachment=True, filename='resume.pdf')

    return Response({'message': 'Message From Django'})