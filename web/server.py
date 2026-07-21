#--------------------------------------
# Bibliotecas
#--------------------------------------

from flask import Flask
from flask import request
from flask import send_from_directory
from datetime import datetime
import json
import time
import os


#--------------------------------------
# Aplicação
#--------------------------------------

app = Flask(__name__)

gravando_rota = False

comandos_rota = []

instante_inicio_gravacao = 0.0


#--------------------------------------
# Gerenciamento de rotas
#--------------------------------------

def obter_proximo_nome_rota():

    pasta_rotas = "../data/rotas"

    maior_numero = 0

    for nome_arquivo in os.listdir(pasta_rotas):

        if not nome_arquivo.startswith("rota_"):
            continue

        if not nome_arquivo.endswith(".json"):
            continue

        try:

            numero = int(
                nome_arquivo
                .replace("rota_", "")
                .replace(".json", "")
            )

            if numero > maior_numero:

                maior_numero = numero

        except ValueError:

            continue

    return f"rota_{maior_numero + 1:03d}"

def listar_rotas():

    pasta_rotas = "../data/rotas"

    rotas = []

    for nome_arquivo in os.listdir(pasta_rotas):

        if not nome_arquivo.startswith("rota_"):
            continue

        if not nome_arquivo.endswith(".json"):
            continue

        nome_rota = nome_arquivo.replace(".json", "")

        rotas.append(nome_rota)

    rotas.sort()

    return rotas

def salvar_rota():

    nome_rota = obter_proximo_nome_rota()

    caminho = f"../data/rotas/{nome_rota}.json"

    if len(comandos_rota) > 0:

        duracao = comandos_rota[-1]["tempo"]

    else:

        duracao = 0.0

    rota = {

        "nome": nome_rota,

        "data_criacao":
            datetime.now().isoformat(),

        "duracao": duracao,

        "quantidade_comandos":
            len(comandos_rota),

        "comandos":
            comandos_rota

    }

    with open(
        caminho,
        "w",
        encoding="utf-8"
    ) as arquivo:

        json.dump(

            rota,

            arquivo,

            indent=4,

            ensure_ascii=False

        )

def normalizar_tempos():

    if len(comandos_rota) == 0:
        return

    tempo_inicial = comandos_rota[0]["tempo"]

    for comando in comandos_rota:

        comando["tempo"] = round(
            comando["tempo"] - tempo_inicial,
            3
        )

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

        tempo_decorrido = round(
        time.time() - instante_inicio_gravacao,
        3
        )

        comandos_rota.append({

            "tempo": tempo_decorrido,
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

@app.route("/rotas")
def obter_rotas():

    return listar_rotas()

@app.route("/rota/iniciar", methods=["POST"])
def iniciar_gravacao():

    global gravando_rota
    global instante_inicio_gravacao

    comandos_rota.clear()

    gravando_rota = True

    instante_inicio_gravacao = time.time()

    print("Iniciando gravação da rota.")

    return {
        "status": "ok"
    }

@app.route("/rota/finalizar", methods=["POST"])
def finalizar_gravacao():

    global gravando_rota

    gravando_rota = False

    normalizar_tempos()

    salvar_rota()

    print(
        "Rota salva:",
        len(comandos_rota),
        "comandos"
    )

    return {
        "status": "ok"
    }

@app.route("/rota/executar", methods=["POST"])
def executar_rota():

    caminho = f"../data/rotas/rota_001.json"

    with open(
        caminho,
        "r",
        encoding="utf-8"
    ) as arquivo:

        rota = json.load(arquivo)

    comandos = rota["comandos"]

    tempo_anterior = 0.0

    for comando in comandos:

        tempo_atual = comando["tempo"]

        time.sleep(
            tempo_atual - tempo_anterior
        )

        tempo_anterior = tempo_atual

        with open(
            "../data/command.txt",
            "w"
        ) as arquivo:

            arquivo.write(

                f'{comando["x"]} '
                f'{comando["y"]} '
                f'{comando["velocidade"]}'

            )

    with open(
        "../data/command.txt",
        "w"
    ) as arquivo:

        arquivo.write("0 0 0")

    print("Rota executada.")

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