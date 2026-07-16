//--------------------------------------
// Elementos da interface
//--------------------------------------

const joystick = document.getElementById("joystick");
const manche = document.getElementById("stick");

const valorX = document.getElementById("xValue");
const valorY = document.getElementById("yValue");

const ultimoComando = document.getElementById("lastCommand");

const valorVelocidade = document.getElementById("speedValue");

const botaoAumentarVelocidade =
    document.getElementById("botaoAumentarVelocidade");

const botaoDiminuirVelocidade =
    document.getElementById("botaoDiminuirVelocidade");

const botaoAprenderRota =
    document.getElementById("botaoAprenderRota");

const botaoFinalizarRota =
    document.getElementById("botaoFinalizarRota");

const botaoRotas =
    document.getElementById("botaoRotas");

const botaoExecutar =
    document.getElementById(
        "executarRota"
    );

botaoExecutar.onclick =
    executarRota;

//--------------------------------------
// Configurações
//--------------------------------------

const TAMANHO_JOYSTICK = 250;
const TAMANHO_MANCHE = 80;

const CENTRO = TAMANHO_JOYSTICK / 2;
const RAIO_MANCHE = TAMANHO_MANCHE / 2;

// Raio máximo que o manche pode alcançar
const RAIO_MAXIMO = CENTRO - RAIO_MANCHE;


//--------------------------------------
// Estado da aplicação
//--------------------------------------

let velocidade = 100;

let idPonteiro = null;

let gravandoRota = false;


//--------------------------------------
// Controle de velocidade
//--------------------------------------

botaoAumentarVelocidade.onclick = aumentarVelocidade;

botaoDiminuirVelocidade.onclick = diminuirVelocidade;

botaoAprenderRota.onclick = iniciarGravacaoRota;

botaoFinalizarRota.onclick = finalizarGravacaoRota;

botaoRotas.onclick = abrirRotas;

function aumentarVelocidade() {

    velocidade = Math.min(100, velocidade + 10);

    valorVelocidade.textContent = velocidade + "%";

}

function diminuirVelocidade() {

    velocidade = Math.max(0, velocidade - 10);

    valorVelocidade.textContent = velocidade + "%";

}

async function iniciarGravacaoRota() {

    gravandoRota = true;

    ultimoComando.textContent =
        "Gravando rota...";

    await iniciarGravacaoServidor();

}

async function finalizarGravacaoRota() {

    gravandoRota = false;

    ultimoComando.textContent =
        "Gravação finalizada.";

    await finalizarGravacaoServidor();

}

function abrirRotas() {

    ultimoComando.textContent =
        "Lista de rotas (em desenvolvimento).";

}

async function executarRota() {

    await fetch(

        "/rota/executar",

        {

            method: "POST"

        }

    );

}


//--------------------------------------
// Comunicação com o servidor
//--------------------------------------

async function enviarComando(x, y, velocidade) {

    try {

        await fetch("/command", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                x: x,
                y: y,
                speed: velocidade

            })

        });

    }

    catch (erro) {

        console.log(erro);

    }

}

async function iniciarGravacaoServidor() {

    try {

        await fetch("/rota/iniciar", {

            method: "POST"

        });

    }

    catch (erro) {

        console.log(erro);

    }

}


async function finalizarGravacaoServidor() {

    try {

        await fetch("/rota/finalizar", {

            method: "POST"

        });

    }

    catch (erro) {

        console.log(erro);

    }

}


//--------------------------------------
// Eventos
//--------------------------------------

joystick.addEventListener("pointerdown", iniciarControle);

document.addEventListener("pointermove", processarMovimento);

document.addEventListener("pointerup", encerrarControle);


//--------------------------------------
// Funções do joystick
//--------------------------------------

function iniciarControle(evento) {

    idPonteiro = evento.pointerId;

    joystick.setPointerCapture(idPonteiro);

    atualizarJoystick(evento);

}

function processarMovimento(evento) {

    if (evento.pointerId != idPonteiro)
        return;

    atualizarJoystick(evento);

}

function encerrarControle(evento) {

    if (evento.pointerId != idPonteiro)
        return;

    idPonteiro = null;

    manche.style.left = (CENTRO - RAIO_MANCHE) + "px";

    manche.style.top = (CENTRO - RAIO_MANCHE) + "px";

    valorX.textContent = "0.00";
    valorY.textContent = "0.00";

    ultimoComando.textContent = "Parado";

    enviarComando(0, 0, 0);

}

function atualizarJoystick(evento) {

    const areaJoystick =
        joystick.getBoundingClientRect();

    let deslocamentoX =
        evento.clientX -
        areaJoystick.left -
        CENTRO;

    let deslocamentoY =
        evento.clientY -
        areaJoystick.top -
        CENTRO;

    const distancia =
        Math.sqrt(
            deslocamentoX * deslocamentoX +
            deslocamentoY * deslocamentoY
        );

    if (distancia > RAIO_MAXIMO) {

        deslocamentoX =
            deslocamentoX / distancia * RAIO_MAXIMO;

        deslocamentoY =
            deslocamentoY / distancia * RAIO_MAXIMO;

    }

    manche.style.left =
        (CENTRO + deslocamentoX - RAIO_MANCHE) + "px";

    manche.style.top =
        (CENTRO + deslocamentoY - RAIO_MANCHE) + "px";

    let x =
        deslocamentoX / RAIO_MAXIMO;

    let y =
        -deslocamentoY / RAIO_MAXIMO;

    valorX.textContent =
        x.toFixed(2);

    valorY.textContent =
        y.toFixed(2);

    let intensidade =
        Math.min(
            Math.sqrt(x * x + y * y),
            1
        );

    let velocidadeAtual =
        Math.round(
            intensidade * velocidade
        );

    ultimoComando.textContent =
        "X: " +
        x.toFixed(2) +
        "  Y: " +
        y.toFixed(2);

    enviarComando(
        x,
        y,
        velocidadeAtual
    );

}