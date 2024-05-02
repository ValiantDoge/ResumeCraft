from django.http import FileResponse
import io
from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import registerFont, registerFontFamily
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4, letter
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
from bs4 import BeautifulSoup

# Create your views here.
style = getSampleStyleSheet()
registerFont(TTFont('Calibri', os.path.join(settings.BASE_DIR, 'public', 'fonts','Calibri', 'Calibri-Regular.ttf') ))
registerFont(TTFont('CalibriBold', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Calibri','Calibri-Bold.ttf') ))
registerFont(TTFont('CalibriItalic', os.path.join(settings.BASE_DIR, 'public', 'fonts', 'Calibri','Calibri-Italic.ttf') ))

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
registerFontFamily('Calibri', normal='Calibri', bold='CalibriBold', italic='CalibriItalic',boldItalic='CalibriItalic')


#Temp2 Styles
style.add(ParagraphStyle(name='ContentRightCal',
                    fontName='Calibri',
                    fontSize=11,
                    leading=14,
                    alignment=2,
                    ))

style.add(ParagraphStyle(name='NameTitleCal',
                         fontName='Calibri',
                         fontSize=24,
                         leading=30,
                         alignment=1,
                          ))

style.add(ParagraphStyle(name='ContentCal',
                    fontName='Calibri',
                    fontSize=11,
                    leading=14,
                    bulletIndent=18,
                    ))
style.add(ParagraphStyle(name='ContentCenterCal',
                    fontName='Calibri',
                    fontSize=11,
                    leading=14,
                    alignment=1,
                    ))

style.add(ParagraphStyle(name='SectionTitleCal',
                         fontName='Calibri',
                         fontSize=14,
                         leading=20,
                         textColor= colors.HexColor('#1155cc'),
                          ))

#Temp2 Styles End

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
                         leading=20,
                          ))





def datetoString(date):
            return datetime.strftime(parse(date), "%B %Y")
        
def columnize(data, interval):
    ret = []
    for i in range(0, len(data), interval * 2):
        for j in range(min(interval, len(data) - i)):
            ret.append(data[i + j] + (data[i + j + interval] if i + j + interval < len(data) else []))
    return ret

def cleanHTML(rich_text, font_name):
    soup = BeautifulSoup(rich_text, 'html.parser')
    # print(soup)

    for pTag in soup.find_all('p'):
        if pTag.parent.name == 'li':
            pTag.unwrap()

    for spanTag in soup.find_all('span'):
        spanTag.name = 'font'
        style_value = spanTag['style']
        if style_value:
            color = style_value.split('color:')[-1].strip()
            spanTag['color'] = color
            del spanTag['style']

    for ul_ol in soup.find_all(['ul', 'ol']):
        ul_ol.wrap(soup.new_tag("p"))
        
    for p_el in soup.find_all('p'):
        p_el.name = 'para'

        for strong_tags in p_el.find_all('strong'):
            strong_tags.name = 'b'
        for em_tags in p_el.find_all('em'):
            em_tags.name = 'i'

        bold_italic_tags = soup.find_all('b')
        if bold_italic_tags:
            for tag in bold_italic_tags:
                italic_tags_inside_bold = tag.find_all('i')
                for italic_tag in italic_tags_inside_bold:
                    # Replace <b><i> tags with appropriate font tag
                    italic_tag.name = 'font'
                    italic_tag['name'] = font_name  # Specify the bold italic font

                    # Remove the <b> tag
                    tag.unwrap()
        
        
        p_el.insert_after(soup.new_tag("br"))
    # print("+++++++")
    # print(soup)
    
    return str(soup)
            
def toRParagraph(rich_text):
    para_list = rich_text.split('<br/>')
    list_of_para = []
    for para in para_list:
        paraSoupObj = BeautifulSoup(para, 'html.parser')
        liTags = paraSoupObj.find_all('li')
        if liTags:
            bullet_count = 1
            for li in liTags:
                if li.parent.name == 'ul':
                    para_obj = Paragraph(f"""{li}""", style=style["ContentCal"], bulletText='●')
                    list_of_para.append([para_obj])
                elif li.parent.name == 'ol':
                    para_obj = Paragraph(f"""{li}""", style=style["ContentCal"], bulletText=str(bullet_count))
                    list_of_para.append([para_obj])
                    bullet_count += 1
        else:
            para_obj = Paragraph(f"""{para}""", style=style["ContentCal"])
            list_of_para.append([para_obj])

    return list_of_para


@api_view(['GET', 'POST'])
def createResume(request):

    if request.method == 'POST':
        
        tempId = str(request.POST.get("tempId"))
        if tempId == '1':
            fname = str(request.POST.get("fname"))
            lname = str(request.POST.get("lname"))
            email = str(request.POST.get("email"))
            contactNo = str(request.POST.get("contactNo") )
            address = str(request.POST.get("address"))
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

            canvas_width = letter[0]
            canvas_height = A4[1]
            #Creating the Canvas
            buf = io.BytesIO()

            c = canvas.Canvas(buf, pagesize=[canvas_width, A4[1]])
            c.setTitle(f'{fname} {lname} Resume ({tempId})')

            contentFontsize = 10 if workData else 14
            contentHeadFontSize = 12 if workData else 16
            
            #Draw the style rectangles
            d = Drawing(300, canvas_height)
            d.add(Rect(0, 650, canvas_width, 160, fillColor=colors.HexColor('#EBC9BB'), strokeColor=None))
            d.add(Rect(30, 0, 210, canvas_height, fillColor=colors.HexColor('#6B9999'), strokeColor=None))
            d.drawOn(c, 0, 0)

            #Drawing a Circle for the Image
            circle_drawing = Drawing(width=100, height=100)
            circle = Circle(55, 50, 80, strokeColor=None, fillColor=colors.white)
            circle_drawing.add(circle)
            circle_drawing.drawOn(c, 80, 680)

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
                c.drawImage(image_path, 58.5, 653.5, width=153, height=153, mask='auto')

            # #Draw the Header text
            c.setFont('LatoBold', 28)
            c.drawString(270, 740, fname.upper())
            c.drawString(270, 710, lname.upper())
            c.setFont('LoraItalic', 14)
            
            profession = Paragraph(f"""<font name="LoraItalic" size="14">{prof}</font>""", style=style["Normal"])
            profession.wrapOn(c, canvas_width, canvas_height)
            profession.drawOn(c, 270, 690, mm)
            

            #Draw Profile Section

            contact_data = [
                [Paragraph("""<font name="FontAwesome" color="white" size="20">&nbsp;\uf095&nbsp;</font>""", style=style['IconHere']), Paragraph(f"""<font name="Lora" color="white" size="12">&ensp;{contactNo}</font>""", style=style["Content"])],
                [Paragraph("""<font name="FontAwesome" color="white" size="20">\uf0e0&nbsp;</font>""", style=style['IconHere']), Paragraph(f"""<font name="Lora" color="white" size="12">&ensp;{email}</font>""", style=style["Content"])],
                [Paragraph("""<font name="FontAwesome" color="white" size="20">&nbsp;\uf041&nbsp;&nbsp;</font>""", style=style['IconHere']), Paragraph(f"""<font name="Lora" color="white" size="12">&ensp;{address}</font>""", style=style["Content"])]
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
            edTable = Table(ed_txt, colWidths=350)
            skillTable = Table(skillColData, colWidths=150) 
            langTable = Table(langColData, colWidths=150)
            if workData:
                workTable = Table(work_txt, colWidths=350)
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

            mainTable = Table(contentData, colWidths=400)
            mainTable.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), "LEFT"),
                ('VALIGN',(0,0),(-1, -1),'TOP')])
            )

            profileFrame = Frame(30, 0, 210, 630, topPadding=10, bottomPadding=10)
            profilestory = []
            profilestory.append(profile)
            profilestory.append(cont_table)
            profileFrame.addFromList(profilestory,c)

            contentFrame = Frame(240, 0, 400, 650, topPadding=10, bottomPadding=0 , rightPadding=0, leftPadding=12)
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

        elif tempId == '2':
            fname = str(request.POST.get("fname"))
            lname = str(request.POST.get("lname"))
            email = str(request.POST.get("email"))
            contactNo = str(request.POST.get("contactNo") )
            address = str(request.POST.get("address"))
            profile_txt = str(request.POST.get("profile"))
            eduData =  json.loads(request.POST.get("education"))
            skillData =  json.loads(request.POST.get("tech_lang"))
            others =  json.loads(request.POST.get("others"))
            workData =  json.loads(request.POST.get("workExp"))

            buf = io.BytesIO()

            doc = SimpleDocTemplate(buf, pagesize=(8.5*inch, 11*inch), rightMargin=0.39*inch, leftMargin=0.39*inch, topMargin=0.39*inch, bottomMargin=0.2*inch, title=f'{fname} {lname} Resume ({tempId})')
            font_size = 11
            
            story = []

            #Personal Info
            contactInfo = []
            if address:
                contactInfo.append([Paragraph(f"""{address}""", style=style["ContentCal"])])
            if email:
                contactInfo.append([Paragraph(f"""{email}""", style=style["ContentCal"])])
            if contactNo:
                contactInfo.append([Paragraph(f"""{contactNo}""", style=style["ContentCal"])])

            contactTable = Table(contactInfo, )
            socialInfo = [
                [Paragraph(f"""<u>github.com/gergelyorosz</u>""", style=style["ContentRightCal"])],
                [Paragraph(f"""<u>linkedin.com/in/gergelyorosz</u>""", style=style["ContentRightCal"])],
                # [Paragraph(f"""<u>instagram.com/gergelyorosz</u>""", style=style["ContentRightCal"])],
            ]
            socialTable = Table(socialInfo, hAlign='RIGHT')
            header = [
                [contactTable, Paragraph(f"""{fname} {lname}""", style=style["NameTitleCal"]), socialTable],
            ]
            headerTable = Table(header, spaceAfter=10, colWidths=[2.57*inch, 2.57*inch, 2.57*inch])
            headerTable.setStyle(TableStyle([
                ('VALIGN',(0,0),(-1, -1),'MIDDLE')])
            )
            
            aboutMe = Paragraph(f"""{profile_txt}""", style=style["ContentCal"])
            #Personal Info End

            #Work Experience
            
            expSection = [
                [Paragraph(f"""<b>Work Experience</b>""", style=style["SectionTitleCal"])],
            ]

            for job in workData:
                jobList = []
                if job["jobTitle"]:
                    jobList.append([Paragraph(f"""<b>{job["jobTitle"]}</b><br/>{job["jobDep"]}""", style=style["ContentCal"])])
                if job["company"]:
                    jobList.append([Paragraph(f"""<b>{job["company"]}</b><br/>{job["companyLoc"]}""", style=style["ContentCenterCal"])])
                if job["startDate"] and job["endDate"]:
                    jobList.append([Paragraph(f"""<b>{datetoString(job["startDate"])} - {datetoString(job["endDate"]) if job["endDate"] != job["endDate"] else job["endDate"]}</b>""", style=style["ContentRightCal"])])
                jobHeadTable = Table([jobList])
                jobHeadTable.setStyle(TableStyle([  
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('VALIGN',(0,0),(-1, -1),'TOP'),
                    ])
                )
                expSection.append([jobHeadTable])
                if job["jobDesc"]:
                    desc = job["jobDesc"].split("\n")
                    for des in desc:
                        expSection.append([Paragraph(f"""{des}""", style=style["ContentCal"], bulletText='●', )])


            expTable = Table(expSection, spaceBefore=20)
            expTable.setStyle(TableStyle([
                ('LINEBELOW',(0,0),(-1, 0), 1, colors.HexColor('#1155cc')),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('VALIGN',(0,0),(-1, -1),'TOP'),
            ])
            )

            #Work Experience End

            #Education Section

            edSection = [
                [Paragraph(f"""<b>Education and Certifications</b>""", style=style["SectionTitleCal"])],
            ]

            for edu in eduData:
                edSection.append([ Paragraph(f"""<b>{edu['degree']}</b>, {edu['uniName']}""", style=style["ContentCal"]), Paragraph(f"""<b>{edu['startEdDate']} - {edu['endEdDate']}</b>""", style=style["ContentRightCal"]) ])

            edTable = Table(edSection, spaceBefore=20, colWidths=[5*inch, 2.5*inch])
            edTable.setStyle(TableStyle([
                ('LINEBELOW',(0,0),(-1, 0), 1, colors.HexColor('#1155cc')),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('VALIGN',(0,0),(-1, -1),'TOP'),
            ])
            )

            #Education Section End

            #Skills Section
            skillsSection = [
                [Paragraph(f"""<b>Technologies and Languages</b>""", style=style["SectionTitleCal"])],
            ]

            for skill in skillData:
                skillsSection.append([ Paragraph(f"""<b>{skill['skillTitle']}:</b>""", style=style["ContentCal"], bulletText='●'), Paragraph(f"""{skill['skills']}""", style=style["ContentCal"]) ])

            skillTable = Table(skillsSection, spaceBefore=20, colWidths=[2.5*inch, 5*inch])
            skillTable.setStyle(TableStyle([
                ('LINEBELOW',(0,0),(-1, 0), 1, colors.HexColor('#1155cc')),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('VALIGN',(0,0),(-1, -1),'TOP'),
            ])
            )


            #Skills Section End  

            #Other Sections

            
            otherDesc = []
            for other in others:
                otherDesc.append([Paragraph(f"""<b>{other['title']}</b>""", style=style["SectionTitleCal"])])
                
                text = cleanHTML(other['desc'], font_name="Helvetica-BoldOblique")
                paragraphs = toRParagraph(text)
                

                for paragraph in paragraphs:
                    otherDesc.append([paragraph])


            otherTable = Table(otherDesc, spaceBefore=20)
            otherTable.setStyle(TableStyle([
                ('LINEBELOW',(0,0),(-1, 0), 1, colors.HexColor('#1155cc')),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('VALIGN',(0,0),(-1, -1),'TOP'),
            ])
            )

            
            


            #Other Sections End

            

            



            story.append(headerTable)
            story.append(aboutMe)
            story.append(expTable)
            story.append(edTable)
            story.append(skillTable)
            story.append(otherTable)
            doc.build(story)

            buf.seek(0)
            return FileResponse(buf, as_attachment=True, filename='resume.pdf')



    return Response({'message': 'Message From Django'})