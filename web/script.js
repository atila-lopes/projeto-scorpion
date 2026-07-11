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
// Envia comando ao servidor
// -------------------------

async function sendCommand(x, y, speed) {

    try {

        await fetch("/command", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                x: x,
                y: y,
                speed: speed

            })

        });

    }

    catch (e) {

        console.log(e);

    }

}

// -------------------------
// Eventos
// -------------------------

joystick.addEventListener(
    "pointerdown",
    startDrag
);

document.addEventListener(
    "pointermove",
    moveStick
);

document.addEventListener(
    "pointerup",
    stopDrag
);

// -------------------------

function startDrag(e) {

    dragging = true;

    moveStick(e);

}

// -------------------------

function stopDrag() {

    dragging = false;

    stick.style.left = "85px";
    stick.style.top = "85px";

    xValue.innerHTML = "0.00";
    yValue.innerHTML = "0.00";

    lastCommand.innerHTML = "Parado";

    sendCommand(0, 0, 0);

}

// -------------------------

function moveStick(e) {

    if (!dragging)
        return;

    const rect =
        joystick.getBoundingClientRect();

    let x =
        e.clientX - rect.left;

    let y =
        e.clientY - rect.top;

    // Centraliza considerando que o stick possui 80 px

    x -= 40;
    y -= 40;

    //--------------------------------------------------
    // Limitação CIRCULAR do joystick
    //--------------------------------------------------

    const center = 85;

    const radius = 85;

    let dx = x - center;

    let dy = y - center;

    let distance =
        Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) {

        dx =
            dx / distance * radius;

        dy =
            dy / distance * radius;

    }

    x = center + dx;

    y = center + dy;

    //--------------------------------------------------

    stick.style.left =
        x + "px";

    stick.style.top =
        y + "px";

    //--------------------------------------------------
    // Converte para intervalo [-1,1]
    //--------------------------------------------------

    let nx =
        dx / radius;

    let ny =
        -dy / radius;

    xValue.innerHTML =
        nx.toFixed(2);

    yValue.innerHTML =
        ny.toFixed(2);

    //--------------------------------------------------
    // Intensidade
    //--------------------------------------------------

    let intensity =
        Math.sqrt(
            nx * nx +
            ny * ny
        );

    intensity =
        Math.min(
            intensity,
            1
        );

    let currentSpeed =
        Math.round(
            speed *
            intensity
        );

    //--------------------------------------------------

    lastCommand.innerHTML =
        "X: " +
        nx.toFixed(2) +
        " | Y: " +
        ny.toFixed(2);

    sendCommand(
        nx,
        ny,
        currentSpeed
    );

}