#--------------------------------------
# Bibliotecas
#--------------------------------------

from flask import Flask
from flask import request
from flask import send_from_directory


#--------------------------------------
# Aplicação
#--------------------------------------

app = Flask(__name__)

gravando_rota = False

comandos_rota = []


#--------------------------------------
# Rotas
#--------------------------------------

@app.route("/")
def pagina_inicial():

    return send_from_directory(".", "index.html")


@app.route("/script.js")
def javascript():

    return send_from_directory(".", "script.js")


@app.route("/style.css")
def css():

    return send_from_directory(".", "style.css")


@app.route("/command", methods=["POST"])
def comando():

    dados = request.get_json()

    x = dados["x"]
    y = dados["y"]
    velocidade = dados["speed"]
    if gravando_rota:

        comandos_rota.append({

            "x": x,
            "y": y,
            "velocidade": velocidade

    })

    with open("../data/command.txt", "w") as arquivo:

        arquivo.write(
            f"{x} {y} {velocidade}"
        )

    return {
        "status": "ok"
    }

@app.route("/rota/iniciar", methods=["POST"])
def iniciar_gravacao():

    global gravando_rota

    comandos_rota.clear()

    gravando_rota = True

    print("Iniciando gravação da rota.")

    return {
        "status": "ok"
    }

@app.route("/rota/finalizar", methods=["POST"])
def finalizar_gravacao():

        global gravando_rota

        gravando_rota = False
    
        print(
            "Comandos gravados:",
            len(comandos_rota)
        )

        return {
            "status": "ok"
        }

#--------------------------------------
# Inicialização do servidor
#--------------------------------------

app.run(

    host="0.0.0.0",

    port=5000,

    debug=True

)