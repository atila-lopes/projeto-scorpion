const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

const xValue = document.getElementById("xValue");
const yValue = document.getElementById("yValue");

const lastCommand = document.getElementById("lastCommand");

const speedValue = document.getElementById("speedValue");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");

let dragging = false;

let speed = 100;

// -------------------------
// Controle de velocidade
// -------------------------

plus.addEventListener("click", () => {

    speed = Math.min(100, speed + 10);

    speedValue.innerHTML = speed + "%";

});

minus.addEventListener("click", () => {

    speed = Math.max(0, speed - 10);

    speedValue.innerHTML = speed + "%";

});

// -------------------------
// Envio de comandos
// -------------------------

async function sendCommand(cmd) {

    try {

        await fetch("/command", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                command: cmd
            })

        });

    } catch (e) {

        console.log(e);

    }

}

// -------------------------
// Eventos do joystick
// -------------------------

joystick.addEventListener("pointerdown", startDrag);

document.addEventListener("pointermove", moveStick);

document.addEventListener("pointerup", stopDrag);

function startDrag(e) {

    dragging = true;

    moveStick(e);

}

function stopDrag() {

    dragging = false;

    // Centraliza novamente o analógico

    stick.style.left = "100px";
    stick.style.top = "100px";

    xValue.innerHTML = "0.00";
    yValue.innerHTML = "0.00";

    lastCommand.innerHTML = "Parado";

    sendCommand("S");

}

function moveStick(e) {

    if (!dragging)
        return;

    const rect = joystick.getBoundingClientRect();

    let x = e.clientX - rect.left;

    let y = e.clientY - rect.top;

    // Centraliza o cursor

    x -= 40;
    y -= 40;

    // Limites do joystick

    x = Math.max(0, Math.min(x, 200));
    y = Math.max(0, Math.min(y, 200));

    // Move o analógico

    stick.style.left = x + "px";
    stick.style.top = y + "px";

    // Converte para intervalo [-1,1]

    let nx = (x - 100) / 100;

    let ny = -(y - 100) / 100;

    xValue.innerHTML = nx.toFixed(2);

    yValue.innerHTML = ny.toFixed(2);

    let cmd = "S";

    if (ny > 0.4) {

        cmd = "F";

    }
    else if (ny < -0.4) {

        cmd = "B";

    }
    else if (nx > 0.4) {

        cmd = "R";

    }
    else if (nx < -0.4) {

        cmd = "L";

    }

    switch (cmd) {

        case "F":
            lastCommand.innerHTML = "Frente";
            break;

        case "B":
            lastCommand.innerHTML = "Ré";
            break;

        case "L":
            lastCommand.innerHTML = "Esquerda";
            break;

        case "R":
            lastCommand.innerHTML = "Direita";
            break;

        default:
            lastCommand.innerHTML = "Parado";
            break;

    }

    sendCommand(cmd);

}