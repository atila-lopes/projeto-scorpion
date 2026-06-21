# Scorpion

Sistema para controle remoto de um robô móvel no simulador Webots por meio de uma interface web desenvolvida com HTML, JavaScript e Flask.

---

## 📖 Sobre o Projeto

O **Scorpion** é um projeto desenvolvido com o objetivo de demonstrar a integração entre aplicações Web e simulação robótica utilizando o **Webots**.

A aplicação permite controlar um robô móvel através de uma interface acessível pelo navegador. Os comandos enviados pelo usuário são recebidos por um servidor Flask, armazenados em um arquivo de comunicação e interpretados por um controlador em C++ executado pelo Webots.

Além de servir como uma demonstração prática de robótica móvel, o projeto aborda conceitos de comunicação cliente-servidor, integração entre linguagens de programação e controle de atuadores em ambientes simulados.

---

## ✨ Funcionalidades

* Controle remoto via navegador;
* Movimento para frente;
* Movimento para trás;
* Rotação para esquerda;
* Rotação para direita;
* Parada imediata do robô;
* Comunicação entre navegador e simulador em tempo real;
* Arquitetura simples e modular.

---

## 🏗 Arquitetura

```text
                 +-------------------+
                 |     Navegador     |
                 | HTML + JavaScript |
                 +---------+---------+
                           |
                     HTTP POST
                           |
                           ▼
                 +-------------------+
                 |   Servidor Flask  |
                 +---------+---------+
                           |
                     command.txt
                           |
                           ▼
                 +-------------------+
                 | Controlador C++   |
                 |      Webots       |
                 +---------+---------+
                           |
                           ▼
                    Motores do Robô
```

---

## 📂 Estrutura do Projeto

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
│   └── *.wbt
│
└── README.md
```

---

## ⚙ Tecnologias Utilizadas

| Tecnologia | Finalidade          |
| ---------- | ------------------- |
| Webots     | Simulação robótica  |
| C++        | Controlador do robô |
| Python     | Servidor Web        |
| Flask      | API HTTP            |
| HTML5      | Interface Web       |
| JavaScript | Envio dos comandos  |
| Git        | Controle de versão  |

---

## 🚗 Comandos

| Botão    | Código | Ação                        |
| -------- | :----: | --------------------------- |
| Frente   |   `F`  | Move o robô para frente     |
| Ré       |   `B`  | Move o robô para trás       |
| Esquerda |   `L`  | Gira o robô para a esquerda |
| Direita  |   `R`  | Gira o robô para a direita  |
| Parar    |   `S`  | Interrompe o movimento      |

---

## 🚀 Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/scorpion.git
```

### 2. Entre na pasta do projeto

```bash
cd Scorpion
```

### 3. Instale as dependências

```bash
pip install flask
```

### 4. Inicie o servidor

```bash
cd web
python server.py
```

### 5. Abra o navegador

```
http://localhost:5000
```

### 6. Execute a simulação

Abra o mundo (`.wbt`) no Webots e inicie a simulação.

---

## 🔄 Fluxo de Funcionamento

1. O usuário pressiona um botão na interface web;
2. O JavaScript envia uma requisição HTTP para o servidor Flask;
3. O servidor recebe o comando e o grava em `command.txt`;
4. O controlador em C++ lê continuamente esse arquivo;
5. O controlador altera a velocidade dos motores;
6. O robô executa o movimento solicitado.

---

## 📸 Demonstração

Adicione aqui uma imagem ou GIF mostrando o funcionamento do sistema.

```markdown
![Demonstração](images/demo.gif)
```

ou

```markdown
![Simulação](images/scorpion.png)
```

---

## 💡 Possíveis Melhorias

* Controle por teclado;
* Controle utilizando joystick;
* Comunicação por WebSocket;
* Comunicação TCP/IP;
* Integração com ROS 2;
* Controle de velocidade proporcional;
* Leitura de sensores em tempo real;
* Interface responsiva para dispositivos móveis;
* Feedback do estado do robô na interface;
* Múltiplos robôs controlados simultaneamente.

---

## 🎓 Objetivos Educacionais

Este projeto foi desenvolvido para auxiliar no estudo de:

* Robótica móvel;
* Simulação computacional;
* Programação em C++;
* Desenvolvimento Web;
* Comunicação cliente-servidor;
* Integração entre aplicações;
* Arquitetura de software;
* Controle de motores em robôs diferenciais.

---

## 👨‍💻 Autor

**Átila Lopes Bernardino**

Graduando em Engenharia de Computação.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais. Sinta-se à vontade para utilizá-lo como base para estudos, pesquisas e projetos de extensão.
