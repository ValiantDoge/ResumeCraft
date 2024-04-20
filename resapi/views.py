from django.http import FileResponse
import io
from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import registerFont, registerFontFamily
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.graphics.shapes import *
from PIL import Image as PImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm,inch
from reportlab.platypus import Paragraph, Table, TableStyle, SimpleDocTemplate, Frame
from datetime import datetime
from dateutil.parser import parse


from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

# Create your views here.

registerFont(TTFont('Lato', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Regular.ttf') ))
registerFont(TTFont('LatoBold', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Bold.ttf') ))
registerFont(TTFont('LatoBlack', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Lato', 'Lato-Black.ttf') ))

registerFont(TTFont('Lora',  os.path.join(settings.BASE_DIR, 'public','fonts', 'Lora','Lora-Regular.ttf') ))
registerFont(TTFont('LoraBold',  os.path.join(settings.BASE_DIR, 'public','fonts', 'Lora','Lora-Bold.ttf') ))
registerFont(TTFont('LoraItalic',  os.path.join(settings.BASE_DIR, 'public','fonts', 'Lora','Lora-Italic.ttf') ))

registerFont(TTFont('FontAwesome', os.path.join(settings.BASE_DIR, 'public','fonts', 'FontAwesome.ttf')))
registerFontFamily('Icon', normal='FontAwesome')


registerFontFamily('Lora', normal='Lora', bold='LoraBold', italic='LoraItalic')
registerFontFamily('Lato', normal='Lato', bold='LatoBlack')
style = getSampleStyleSheet()
style.add(ParagraphStyle(name='Content',
                    fontFamily='Lora',
                    fontSize=14,
                    leading=18,
                    ))

style.add(ParagraphStyle(name='IconHere', 
                          spaceBefore=1,
                          leading=20,
                          fontFamily ='Icon', 
                          fontSize=15))

style.add(ParagraphStyle(name='SectionTitle',
                         fontFamily='Lato',
                         leading=25,
                          ))

def datetoString(date):
            return datetime.strftime(parse(date), "%B %Y")
        
def columnize(data, interval):
    ret = []
    for i in range(0, len(data), interval * 2):
        for j in range(min(interval, len(data) - i)):
            ret.append(data[i + j] + (data[i + j + interval] if i + j + interval < len(data) else []))
    return ret

@api_view(['GET', 'POST'])
def createResume(request):

    if request.method == 'POST':
        
        tempId = str(request.POST.get("tempId"))
        if tempId == '1':
            fname = str(request.POST.get("fname"))
            lname = str(request.POST.get("lname"))
            email = str(request.POST.get("email"))
            contactNo = str(request.POST.get("contactNo") )
            profile_txt = str(request.POST.get("profile"))
            prof = str(request.POST.get("profession"))
            uploaded_image = request.FILES.get('userPicture')
            eduData =  json.loads(request.POST.get("education"))
            skillData =  json.loads(request.POST.get("skills"))
            langData =  json.loads(request.POST.get("languages"))
            workData =  json.loads(request.POST.get("workExp"))
            
            all_empty = all(value == '' for value in workData[0].values())

            if all_empty:
                workData = None

            canvas_width, canvas_height = A4
            #Creating the Canvas
            buf = io.BytesIO()

            c = canvas.Canvas(buf, pagesize=A4)
            c.setTitle(f'{fname} {lname} Resume ({tempId})')

            contentFontsize = 12 if workData else 14
            contentHeadFontSize = 14 if workData else 16
            
            #Draw the style rectangles
            d = Drawing(300, canvas_height)
            d.add(Rect(0, 630, canvas_width, 180, fillColor=colors.HexColor('#EBC9BB'), strokeColor=None))
            d.add(Rect(30, 0, 210, canvas_height, fillColor=colors.HexColor('#6B9999'), strokeColor=None))
            d.drawOn(c, 0, 0)

            #Drawing a Circle for the Image
            circle_drawing = Drawing(width=100, height=100)
            circle = Circle(55, 50, 80, strokeColor=None, fillColor=colors.white)
            circle_drawing.add(circle)
            circle_drawing.drawOn(c, 80, 670)

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

                # #Since our canvas has the property bottomup=0, Use PIL to rotate our image #Code Commented because bottomup=0 is no longer used
                # with PImage.open(image_path) as img:
                #     img = img.transpose(PImage.FLIP_TOP_BOTTOM)
                #     img.save(image_path, format='PNG')

                #Place it over the circle
                c.drawImage(image_path, 58.5, 643.5, width=153, height=153, mask='auto')

            # #Draw the Header text
            c.setFont('LatoBold', 28)
            c.drawString(270, 720, fname.upper())
            c.drawString(270, 690, lname.upper())
            c.setFont('LoraItalic', 14)
            
            profession = Paragraph(f"""<font name="LoraItalic" size="14">{prof}</font>""", style=style["Normal"])
            profession.wrapOn(c, canvas_width, canvas_height)
            profession.drawOn(c, 270, 670, mm)
            

            #Draw Profile Section

            contact_data = [
                [Paragraph("""<font name="FontAwesome" color="white" size="20">&nbsp;\uf095&nbsp;</font>""", style=style['IconHere']), Paragraph(f"""<font name="Lora" color="white" size="12">&ensp;{contactNo}</font>""", style=style["Content"])],
                [Paragraph("""<font name="FontAwesome" color="white" size="20">\uf0e0&nbsp;</font>""", style=style['IconHere']), Paragraph(f"""<font name="Lora" color="white" size="12">&ensp;{email}</font>""", style=style["Content"])],
                [Paragraph("""<font name="FontAwesome" color="white" size="20">&nbsp;\uf041&nbsp;&nbsp;</font>""", style=style['IconHere']), Paragraph(f"""<font name="Lora" color="white" size="12">&ensp;125 Anywhere, Any City, State, Country 405475</font>""", style=style["Content"])]
            ]
            email_rHeight = 40
            if len(email) > 19:
                email_rHeight = 60
            
            cont_table = Table(contact_data, rowHeights=[40, email_rHeight, 60], colWidths=[35, 150])
            cont_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), "LEFT"),
                ('VALIGN',(0,0),(-1, -1),'TOP')])
            )
            profile_data = [
                [Paragraph(f"""<font name="LatoBold" size="{contentHeadFontSize}" color="white">PROFILE</font>""", style=style["SectionTitle"])], 
                [Paragraph(f"""<font name="Lora" color="white" size="12">{profile_txt}</font>""", style=style["Content"])], #max length 235
                [Paragraph(f"""<font name="LatoBold" size="{contentHeadFontSize}" color="white">CONTACT ME</font>""", style=style["SectionTitle"])], 
                
                ]
            
            
            profile = Table(profile_data, rowHeights=[30, 250, 30], spaceAfter=10)
            profile.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), "LEFT"),
                ('VALIGN',(0,0),(-1, -1),'TOP')])
            )

            # #Draw Main Page

            #Education Section
            #Education Table Data 
            ed_txt = []
            for clg in eduData:
                if clg["uniName"]:
                    ed_txt.append(
                    [Paragraph(f"""<font name="LoraBold" size="{contentFontsize}">{clg["uniName"].upper()}</font>""", style=style["Content"])],
                    
                    )
                    ed_txt.append(
                        [Paragraph(f"""<font name="Lora" size="{contentFontsize}">{clg["eddesc"]}</font>""", style=style["Content"])],
                    )

            #Skill Table Data
            skill_txt = []
            for skill in skillData:
                if skill["skill"]:
                    skill_txt.append(
                    [Paragraph(f"""<font name="LoraBold" size="{contentFontsize}">{skill["skill"]}</font>""", style=style["Content"])],
                    
                    )
                    skill_txt.append(
                        [Paragraph(f"""<font name="Lora" size="{contentFontsize}">Level: {skill["skillLevel"]}</font>""", style=style["Content"])],
                    )
            #lang Table Data
            lang_txt = []
            for lang in langData:
                if lang["lang"]:
                    lang_txt.append(
                    [Paragraph(f"""<font name="Lora" size="{contentFontsize}">{lang["lang"]}</font>""", style=style["Content"])],
                    
                    )

            #Experience Table Data
            if workData:
                work_txt = []
                for work in workData:
                        work_txt.append(
                        [Paragraph(f"""<font name="LoraBold" size="{contentFontsize}">{work["jobTitle"].upper()}</font>""", style=style["Content"])],
                        
                        )
                        work_txt.append(
                            [Paragraph(f"""<font name="Lora" size="{contentFontsize}">{work["company"]}</font>&nbsp;&nbsp;&nbsp;<font name="LoraItalic" size="{contentFontsize}">({datetoString(work["startDate"])} - {datetoString(work["endDate"]) if work["endDate"] != "Present" else work["endDate"]})</font>""", style=style["Content"])],
                        )
                        work_txt.append(
                            [Paragraph(f"""<font name="Lora" size="{contentFontsize}">{work["jobDesc"]}</font>""", style=style["Content"])],
                        )

            langColData = columnize(lang_txt, 2)
            skillColData =  columnize(skill_txt, 2)
            edTable = Table(ed_txt, colWidths=330)
            skillTable = Table(skillColData, colWidths=150) 
            langTable = Table(langColData, colWidths=150)
            if workData:
                workTable = Table(work_txt, colWidths=330)
                contentData = [
                    [Paragraph(f"""<font name="FontAwesome" size="{contentHeadFontSize}">&nbsp;\uf054&nbsp;</font>&nbsp;&nbsp;<font name="LatoBold" size="{contentHeadFontSize}">WORK EXPERIENCE</font>""", style=style["SectionTitle"])],
                    [workTable],
                    [Paragraph(f"""<font name="FontAwesome" size="{contentHeadFontSize}">&nbsp;\uf054&nbsp;</font>&nbsp;&nbsp;<font name="LatoBold" size="{contentHeadFontSize}">EDUCATION</font>""", style=style["SectionTitle"])],
                    [edTable],
                    [Paragraph(f"""<font name="FontAwesome" size="{contentHeadFontSize}">&nbsp;\uf054&nbsp;</font>&nbsp;&nbsp;<font name="LatoBold" size="{contentHeadFontSize}">SKILLS</font>""", style=style["SectionTitle"])],
                    [skillTable],
                    [Paragraph(f"""<font name="FontAwesome" size="{contentHeadFontSize}">&nbsp;\uf054&nbsp;</font>&nbsp;&nbsp;<font name="LatoBold" size="{contentHeadFontSize}">LANGUAGES</font>""", style=style["SectionTitle"])],
                    [langTable],
                    
                ]
            else:        
                contentData = [
                    [Paragraph(f"""<font name="FontAwesome" size="{contentHeadFontSize}">&nbsp;\uf054&nbsp;</font>&nbsp;&nbsp;<font name="LatoBold" size="{contentHeadFontSize}">EDUCATION</font>""", style=style["SectionTitle"])],
                    [edTable],
                    [Paragraph(f"""<br/><font name="FontAwesome" size="{contentHeadFontSize}">&nbsp;\uf054&nbsp;</font>&nbsp;&nbsp;<font name="LatoBold" size="{contentHeadFontSize}">SKILLS</font>""", style=style["SectionTitle"])],
                    [skillTable],
                    [Paragraph(f"""<br/><font name="FontAwesome" size="{contentHeadFontSize}">&nbsp;\uf054&nbsp;</font>&nbsp;&nbsp;<font name="LatoBold" size="{contentHeadFontSize}">LANGUAGES</font>""", style=style["SectionTitle"])],
                    [langTable]
                ]

            mainTable = Table(contentData, colWidths=340)
            mainTable.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), "LEFT"),
                ('VALIGN',(0,0),(-1, -1),'TOP')])
            )

            profileFrame = Frame(30, 0, 210, 630, topPadding=10, bottomPadding=10)
            profilestory = []
            profilestory.append(profile)
            profilestory.append(cont_table)
            profileFrame.addFromList(profilestory,c)

            contentFrame = Frame(240, 0, 355, 630, topPadding=10, bottomPadding=0 , rightPadding=0, leftPadding=12)
            contentStory = []
            contentStory.append(mainTable)
            contentFrame.addFromList(contentStory, c)
            c.showPage()
            c.save()

            if uploaded_image:
                if os.path.exists(image_path):
                    os.remove(image_path)

            buf.seek(0)
            return FileResponse(buf, as_attachment=True, filename='resume.pdf')

    return Response({'message': 'Message From Django'})