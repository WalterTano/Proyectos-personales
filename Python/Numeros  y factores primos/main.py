from os import system

# Método para crear una lista de números primos (calculándolos en el proceso).
def crear_lista_de_primos(cantidad):
    lista = []
    numero = 1
    while len(lista) <= cantidad:
        # Al inicio de cada cálculo se reinicia el valor del divisor y del contador "divisores".
        divisores = 0 # Contador de números divisores del número que se está calculando.
        divisor = 1

        # Solo se toman posibles divisores menores a la mitad del número actual pues ningún número
        # es divisible por un número mayor a su mitad.
        while divisor <= (numero / 2) and divisores < 2:
            # Si el numero es divisible (resto = 0) por el divisor, se cuenta en "divisores".
            if numero % divisor == 0:
                divisores += 1 

            divisor += 1 # El divisor aumenta de valor en cada bucle.
        
        if divisores == 1:
            lista.append(numero)

        numero += 1

    return lista

# Método que utiliza recursividad para obtener los factores primos de cualquier número.
# Se utiliza una lista de números primos creada anteriormente.
def obtener_factores_primos(numero, primos, fact_primos=[]):
    if numero == 1: 
        return fact_primos
        # Si el número ya vale 1, retorna la lista de factores primos.

    if int(numero) in primos:
        fact_primos.append(int(numero))
        return fact_primos
        # Si el número está en la lista de números primos, retorna la lista de factores primos.

    for primo in primos:
        if primo > numero:
            break
        # Si el primo es mayor que el número se rompe el bucle.

        if numero % primo == 0:
            fact_primos.append(primo) # Si el número es divisible se lo añade a la lista de factores primos.
            numero = numero / primo 
            return obtener_factores_primos(numero, primos, fact_primos)
            # Se ajusta el valor del número y se inicia recursivamente el mismo método hasta que el número
            # sea encontrado en la lista de números primos o valga 1.
    
# Método de ejecución principal.
def main():
    cant_primos = input("Ingrese la cantidad de números primos que será necesario calcular para la operación: ")
    primos = crear_lista_de_primos(int(cant_primos))
    # Se crea la lista de números primos según la cantidad que se desea calcular.

    while True:
        numero = input("Ingrese un número cuyos factores primos desea conocer: ")
        componentes = obtener_factores_primos(int(numero), primos)

        str_componentes = ""
        try:
            # Bucle para ajustar la forma en la que se muestra la lista de factores primos.
            for x in range(0, len(componentes)):
                if x == (len(componentes) - 1):
                    str_componentes = str_componentes + "{}.".format(componentes[x])
                    break

                str_componentes = str_componentes + "{}, ".format(componentes[x])
            
            print("Los factores primos de {} son: {}".format(numero, str_componentes)) 
        except:
            print("La cantidad de números primos calculados no es suficiente para dividir en factores primos al número {}.\n".format(numero))

        input("Presione enter para continuar...")
        system("cls")

main()