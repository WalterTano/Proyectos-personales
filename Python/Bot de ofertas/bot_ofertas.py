from selenium import webdriver
from datetime import date
import pymysql.cursors
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Configuración del webdriver (Chromedriver en mi caso).
opciones = webdriver.ChromeOptions()
opciones.add_argument('--user-data-dir=C:\\Users\\--USUARIO--\\AppData\\Local\\Google\\Chrome\\User Data')
driver = webdriver.Chrome('chromedriver', options=opciones)

# Inicio de la conexión a la base de datos MySQL.
conector = pymysql.connect(user='USUARIO', 
        password='CONTRASE�A', 
        database='BASE DE DATOS', 
        host='127.0.0.1') # Base de datos hosteada localmente en mi caso.
cursor = conector.cursor()

# Datos del correo desde el cual enviar las ofertas encontradas.
mail_dir = 'DIRECCION DE CORREO ELECTR�NICO'
mail_pass = 'CONTRASE�A CORRESPONDIENTE'
# Dirección del correo al cual enviar las ofertas encontradas.
destino = 'CORREO ELECTR�NICO DESTINO'

# Método para buscar las ofertas en una página (link de la página y ruta XML.
# incluídos por parámetros).
def buscar_ofertas(link, xPath):
    driver.get(link)
    ofertas = []
    contador = 0
    while contador < 150: # Se asume que no se mostrarán más de 150 ofertas en una sola página de un sitio.
        contador += 1
        try:
            oferta = driver.find_element_by_xpath(xPath.format(contador))
            ofertas.append( (oferta.text.partition('\n')[0], oferta.get_attribute('href')) )
            # Guardamos en el arreglo "ofertas" solo el título y la URL (en un par ordenado) de cada oferta.

        except:
            continue
        
    print("Búsqueda de ofertas finalizada. Cantidad de ofertas encontradas: {}".format(len(ofertas)))
    return ofertas

# Método para guardar las ofertas en la base de datos MySQL
def guardar_ofertas(ofertas):
    for oferta in ofertas:
        try:
            sql = "INSERT INTO Ofertas(fecha, oferta, url) VALUES (CURDATE(), %s, %s)"
            vals = [oferta[0], oferta[1]]
            cursor.execute(sql, vals)
        except:
            continue
    
    conector.commit()

# Método para enviar las ofertas al correo electrónico de destino, para ser revisadas desde cualquier dispositivo.
# Se utiliza un correo que permite su uso programáticamente para enviar las ofertas.
def mail_ofertas():
    contenido = "Ofertas del día de hoy: \n \n"
    cantidad_de_ofertas = 0
    fecha_hoy = date.today()

    # Declaración e inicio de la sesión en el correo emitor.
    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.starttls()
    session.login(mail_dir, mail_pass)

    # Configuración del correo a enviar.
    mensaje = MIMEMultipart()
    mensaje['From'] = mail_dir
    mensaje['To'] = destino

    # Consulta para obtener las ofertas ingresadas en el día actual.
    sql = "SELECT oferta, URL FROM Ofertas WHERE fecha = %s"
    cursor.execute(sql, [fecha_hoy])
    resultado = cursor.fetchall()
    asunto = "Ofertas {}".format(fecha_hoy)
    mensaje['Subject'] = asunto

    # Bucle para añadir y formatear los datos en el contenido del correo.
    for x in resultado:
        contenido += "Oferta: {} \n URL: {} \n \n".format(x[0], x[1])
        cantidad_de_ofertas += 1

    # Envío del correo y finalización de la sesión.
    mensaje.attach(MIMEText(contenido, 'plain'))
    texto = mensaje.as_string()
    session.sendmail(mail_dir, destino, texto)
    session.quit()

    print('{} ofertas enviadas desde {} a {}'.format(cantidad_de_ofertas, mail_dir, destino))

# Método de ejecución principal.
def main():
    # NOTA: Este programa se ejecuta a diario, así que los links ingresados son con los filtros
    # aplicados de manera que se muestren las ofertas subidas en los últimos dos días o el último día.
    sql = "SELECT link, xpath FROM paginas_ofertas;" 
    ofertas = []
    cursor.execute(sql)
    paginas = cursor.fetchall()
    for pagina in paginas:
        ofertas += buscar_ofertas(pagina[0], pagina[1])
    
    guardar_ofertas(ofertas)
    mail_ofertas()

main()
