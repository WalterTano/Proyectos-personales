letras = {
    "a": ".-",
    "b": "-...",
    "c": "-.-.",
    "d": "-..",
    "e": ".",
    "f": "..-.",
    "g": "--.",
    "h": "....",
    "i": "..",
    "j": ".---",
    "k": "-.-",
    "l": ".-..",
    "m": "--",
    "n": "-.",
    "o": "---",
    "p": ".--.",
    "q": "--.-",
    "r": ".-.",
    "s": "...",
    "t": "-",
    "u": "..-",
    "v": "...-",
    "w": ".--",
    "x": "-..-",
    "y": "-.--",
    "z": "--..",
    " ": "/",
    ",": "--..--",
    ".": ".-.-.-",
    "?": "..--..",
    "!": "-.-.--"
}

def get_key(val): 
    for key, value in letras.items(): 
         if val == value: 
             return key 
  
    return ""

def traducir_a_morse(texto):
    en_morse = ""
    for x in texto:
        en_morse += "{} ".format(letras.get(x))

    return en_morse

def traducir_a_texto(morse):
    en_texto = ""
    palabras = morse.split(" ")

    for x in palabras:
        en_texto += get_key(x)

    return en_texto


