from selenium import webdriver
from datetime import date
import pymysql.cursors
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

conector = pymysql.connect(user='XXXXX', 
        password='XXXXXXX', 
        database='XXXXXXX', 
        host='127.0.0.1')

cursor = conector.cursor()
mail_correo = 'XXXXXXXXX@XXXXX.XX'
pass_mail = 'XXXXXXXXXXXX'
destino = 'XXXXXXXXX@XXXXX.XX'

def buscar_ofertas(link, xPath):
    driver = webdriver.Chrome('E:\\Scripts Python\\chromedriver.exe')
    driver.get(link)
    ofertas = []
    contador = 0
    while contador < 200:
        contador += 1
        try:
            oferta = driver.find_element_by_xpath(xPath.format(contador))
            ofertas.append(oferta)

        except:
            continue
        

    print("Búsqueda de ofertas finalizada. Cantidad de ofertas encontradas: {}".format(len(ofertas)))
    return ofertas


def guardar_ofertas(ofertas):
    for x in ofertas:
        try:
            sql = "INSERT INTO Ofertas(fecha, oferta, url) VALUES (CURDATE(), %s, %s)"
            vals = [x.text.partition('\n')[0], x.get_attribute('href')]    
            cursor.execute(sql, vals)
        except:
            continue
    
    conector.commit()


def mail_ofertas():
    contenido = "Ofertas del día de hoy: \n \n"
    cantidad_de_ofertas = 0
    mensaje = MIMEMultipart()
    mensaje['From'] = mail_correo
    mensaje['To'] = destino
    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.starttls()
    session.login(mail_correo, pass_mail)
    fecha_hoy = date.today()
    sql = "SELECT oferta, URL FROM Ofertas WHERE fecha = %s"
    cursor.execute(sql, [fecha_hoy])
    resultado = cursor.fetchall()
    asunto = "Ofertas {}".format(fecha_hoy)
    mensaje['Subject'] = asunto
    for x in resultado:
        contenido += "Oferta: {} \n URL: {} \n \n".format(x[0], x[1])
        cantidad_de_ofertas += 1

    mensaje.attach(MIMEText(contenido, 'plain'))
    texto = mensaje.as_string()
    session.sendmail(mail_correo, destino, texto)
    print('{} ofertas enviadas desde {} a {}'.format(cantidad_de_ofertas, mail_correo, destino))
    session.quit()


#SMART TALENT
link_smart_talent = 'https://www.smarttalent.uy/smart/smartalent/templates/oportunidades.jsp?contentid=2785&site=15&channel=innova.front&nolimite=1'
xPath_smart_talent = '/html/body/div[2]/div[5]/div/div[2]/div/div/div/table/tbody[{}]/tr/td[2]/a'
ofertas = buscar_ofertas(link_smart_talent, xPath_smart_talent)
guardar_ofertas(ofertas)


#GALLITO
link_gallito = 'https://trabajo.gallito.com.uy/buscar/areas/tecnologias-de-la-informacion/fecha-publicacion/ultima-semana'
xPath_gallito = '/html/body/div[1]/div/div[3]/a[{}]'
ofertas = buscar_ofertas(link_gallito, xPath_gallito)
guardar_ofertas(ofertas)

#BUSCOJOBS
link_buscojobs = 'https://www.buscojobs.com.uy/ofertas/tc13/trabajo-de-tecnologias-de-la-informacion?fechainicio=2'
xPath_buscojobs = '/html/body/div[4]/div[2]/div/div[5]/div[2]/div[{}]/div[1]/div[1]/h3/a'
ofertas = buscar_ofertas(link_buscojobs, xPath_buscojobs)
guardar_ofertas(ofertas)

mail_ofertas()