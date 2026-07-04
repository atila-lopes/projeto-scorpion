# Scorpion

Sistema de controle remoto de um robô móvel no simulador Webots por meio de uma interface web.

---

## Descrição

O **Scorpion** é um projeto desenvolvido para demonstrar a integração entre aplicações web e simulação robótica utilizando o simulador **Webots**. O sistema permite controlar um robô móvel por meio de uma interface acessível via navegador, estabelecendo uma comunicação entre o usuário e o controlador do robô.

A arquitetura do projeto é composta por três componentes principais:

* Interface web desenvolvida em HTML e JavaScript;
* Servidor HTTP desenvolvido em Python utilizando o framework Flask;
* Controlador do robô implementado em C++ utilizando a API do Webots.

O projeto foi desenvolvido com fins acadêmicos, servindo como apoio ao estudo de robótica móvel, programação orientada a objetos, comunicação cliente-servidor e integração entre diferentes tecnologias.

---

## Funcionalidades

* Controle remoto do robô por meio de navegador web;
* Movimento para frente;
* Movimento para trás;
* Rotação para a esquerda;
* Rotação para a direita;
* Parada imediata do robô;
* Comunicação entre interface web e simulador;
* Arquitetura modular e de fácil extensão.

---

## Arquitetura

```text
                    +----------------------+
                    |      Navegador       |
                    |   HTML / JavaScript  |
                    +----------+-----------+
                               |
                           HTTP POST
                               |
                               v
                    +----------------------+
                    |    Servidor Flask    |
                    +----------+-----------+
                               |
                         command.txt
                               |
                               v
                    +----------------------+
                    |  Controlador C++     |
                    |      (Webots)        |
                    +----------+-----------+
                               |
                               v
                         Motores do Robô
```

---

## Estrutura do Projeto

```text
Scorpion/
├── controllers/
│   └── car_controller/
│       └── car_controller.cpp
│
├── web/
│   ├── index.html
│   ├── script.js
│   └── server.py
│
├── worlds/
│   ├── command.txt
│   └── scorpion.wbt
│
└── README.md
```

---

## Tecnologias Utilizadas

| Tecnologia | Descrição                       |
| ---------- | ------------------------------- |
| C++        | Controlador do robô             |
| Python     | Servidor da aplicação           |
| Flask      | Framework para comunicação HTTP |
| HTML5      | Interface do usuário            |
| JavaScript | Envio dos comandos              |
| Webots     | Ambiente de simulação robótica  |
| Git        | Controle de versão              |

---

## Funcionamento

O sistema opera conforme o fluxo descrito a seguir:

1. O usuário acessa a interface web.
2. Um comando de movimentação é selecionado.
3. O JavaScript envia uma requisição HTTP ao servidor Flask.
4. O servidor grava o comando no arquivo `command.txt`.
5. O controlador em C++ executado pelo Webots lê continuamente esse arquivo.
6. O controlador interpreta o comando recebido.
7. As velocidades dos motores são atualizadas.
8. O robô executa o movimento correspondente.

---

## Comandos Disponíveis

| Comando | Descrição                        |
| ------- | -------------------------------- |
| `F`     | Move o robô para frente          |
| `B`     | Move o robô para trás            |
| `L`     | Rotaciona o robô para a esquerda |
| `R`     | Rotaciona o robô para a direita  |
| `S`     | Interrompe o movimento           |

---

## Requisitos

Para executar o projeto são necessários:

* Webots;
* Python 3.10 ou superior;
* Flask;
* Compilador C++ compatível com o Webots;
* Git.

---

## Instalação

### Clonar o repositório

```bash
git clone https://github.com/atila-lopes/projeto-scorpion.git
```

### Acessar o diretório

```bash
cd Scorpion
```

### Instalar as dependências

```bash
pip install flask
```

---

## Execução

### Iniciar o servidor

```bash
cd web
python server.py
```

### Abrir a interface

Acesse o seguinte endereço no navegador:

```text
http://localhost:5000
```

### Executar a simulação

1. Abra o arquivo do mundo (`.wbt`) no Webots.
2. Inicie a simulação.
3. Utilize a interface web para controlar o robô.

---

## Organização dos Componentes

### Interface Web

Responsável por fornecer os controles de movimentação ao usuário e enviar os comandos ao servidor por meio de requisições HTTP.

### Servidor Flask

Recebe os comandos enviados pela interface e os grava no arquivo utilizado como meio de comunicação com o controlador do robô.

### Controlador do Robô

Executado pelo Webots, realiza a leitura contínua do arquivo de comandos e ajusta a velocidade dos motores conforme a instrução recebida.

---

## Possíveis Extensões

O projeto pode ser expandido com funcionalidades como:

* Controle por teclado;
* Controle por joystick;
* Comunicação utilizando WebSocket;
* Integração com ROS 2;
* Controle proporcional de velocidade;
* Monitoramento de sensores em tempo real;
* Interface responsiva para dispositivos móveis;
* Controle simultâneo de múltiplos robôs;
* Registro de comandos e telemetria;
* Comunicação direta por TCP/IP.

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais. Sua utilização é permitida para estudos, pesquisas e desenvolvimento de projetos derivados, desde que mantidos os devidos créditos aos autores.
