from os import system
from texto_a_morse import traducir_a_morse
from texto_a_morse import traducir_a_texto
opcion = "3"
while opcion != "0":
    system("cls")
    opcion = input("1. Traducir de texto a morse. \n2. Traducir de morse a texto. \n0. Salir.\n")

    if opcion == "1":
        system("cls")
        palabra = ""
        palabra = input("Introduce una palabra o frase: ")
        traduccion = traducir_a_morse(palabra.lower())
        print("{} en morse se escribe:\n{}".format(palabra, traduccion))
        input("Presiona enter para continuar.")

    elif opcion == "2":
        system("cls")
        palabra = ""
        palabra = input("Introduce una palabra o frase en morse:\n ")
        traduccion = traducir_a_texto(palabra.lower())
        print("\nLa traducción de\n {} \na texto es: {}".format(palabra, traduccion))
        input("Presiona enter para continuar.")

    else:
        break