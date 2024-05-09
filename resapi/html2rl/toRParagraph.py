from bs4 import BeautifulSoup
from reportlab.platypus import Paragraph

def toRParagraph(rich_text, styleList):
    para_list = rich_text.split('<br/>')
    list_of_para = []
    for para in para_list:
        paraSoupObj = BeautifulSoup(para, 'html.parser')
        liTags = paraSoupObj.find_all('li')
        if liTags:
            bullet_count = 1
            for li in liTags:
                if li.parent.name == 'ul':
                    para_obj = Paragraph(f"""{li}""", style=styleList["ContentCal"], bulletText='●')
                    list_of_para.append([para_obj])
                elif li.parent.name == 'ol':
                    para_obj = Paragraph(f"""{li}""", style=styleList["ContentCal"], bulletText=str(bullet_count))
                    list_of_para.append([para_obj])
                    bullet_count += 1
        else:
            para_obj = Paragraph(f"""{para}""", style=styleList["ContentCal"])
            list_of_para.append([para_obj])

    return list_of_para