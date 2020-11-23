from selenium import webdriver
from datetime import date, timedelta
import pymysql.cursors
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

conector = pymysql.connect(user='walter', 
        password='54616473', 
        database='Personal', 
        host='127.0.0.1')
        #cursorclass=pymysql.cursors.DictCursor)

cursor = conector.cursor()
#eliminador = conector.cursor()
mail_correo = 'autoemailwalter@gmail.com'
pass_mail = 'autoemailwalter'
destino = 'tano.walter@hotmail.com'

def buscar_ofertas(link, xPath):
    driver = webdriver.Chrome("/home/walter/Chromedriver/chromedriver")
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


def eliminar_duplicadas():
    fecha_hoy = date.today()
    sql = "SELECT URL FROM Ofertas"
    cursor.execute(sql)
    contador = 0
    for x in cursor:
        for y in cursor:
            if x == y and contador < 2:
                contador += 1
                if contador == 2:
                    val = (y, fecha_hoy)
                    eliminador.execute("DELETE FROM Ofertas WHERE URL = %s AND fecha = %s", val)
                    conector3.commit()
                    eliminar_duplicadas()


        break

    return "Guardado finalizado."


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

#print(eliminar_duplicadas())
mail_ofertas()
