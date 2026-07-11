# Importa a classe principal do Flask
from flask import Flask

# Importa o objeto utilizado para acessar os dados das requisições
from flask import request

# Importa função responsável por enviar arquivos ao navegador
from flask import send_from_directory

# Cria a aplicação Flask
app = Flask(__name__)

# Página principal da aplicação
@app.route("/")
def home():

    # Retorna o arquivo HTML
    return send_from_directory(".", "index.html")

# Disponibiliza o arquivo JavaScript
@app.route("/script.js")
def script():

    return send_from_directory(".", "script.js")

@app.route("/style.css")
def style():
	return send_from_directory(".", "style.css")


# Rota responsável por receber comandos do navegador
@app.route("/command", methods=["POST"])
def command():

    # Obtém o JSON enviado pela interface Web
    data = request.get_json()

    # Extrai o comando recebido
    cmd = data["command"]
    speed = data["speed"]

    # Salva o comando em um arquivo texto
    # Esse arquivo será lido continuamente pelo controlador do Webots
    with open(
        "../worlds/command.txt",
        "w"
    ) as f:

        f.write(f"{cmd} {speed}")

    # Exibe o comando recebido no terminal
    print("Comando recebido:", cmd)

    # Retorna uma resposta indicando sucesso
    return {"status": "ok"}

# Inicializa o servidor Web
app.run(

    # Permite acesso a partir de outras máquinas da rede
    host="0.0.0.0",

    # Porta utilizada pelo servidor
    port=5000,

    # Habilita o modo de desenvolvimento
    debug=True
)