const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

const xValue = document.getElementById("xValue");
const yValue = document.getElementById("yValue");

const lastCommand = document.getElementById("lastCommand");

const speedValue = document.getElementById("speedValue");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");

let speed = 100;

const JOYSTICK_SIZE = 250;
const STICK_SIZE = 80;

const CENTER = JOYSTICK_SIZE / 2;
const STICK_RADIUS = STICK_SIZE / 2;

// raio útil do joystick
const MAX_RADIUS = CENTER - STICK_RADIUS;

let pointerId = null;



//--------------------------------------
// Velocidade
//--------------------------------------

plus.onclick = () => {

    speed = Math.min(100, speed + 10);

    speedValue.textContent = speed + "%";

};

minus.onclick = () => {

    speed = Math.max(0, speed - 10);

    speedValue.textContent = speed + "%";

};



//--------------------------------------
// Comunicação
//--------------------------------------

async function sendCommand(x, y, speed){

    try{

        await fetch("/command",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                x:x,
                y:y,
                speed:speed

            })

        });

    }

    catch(e){

        console.log(e);

    }

}



//--------------------------------------
// Eventos
//--------------------------------------

joystick.addEventListener("pointerdown",startDrag);

document.addEventListener("pointermove",moveDrag);

document.addEventListener("pointerup",stopDrag);



//--------------------------------------

function startDrag(e){

    pointerId = e.pointerId;

    joystick.setPointerCapture(pointerId);

    updateJoystick(e);

}



//--------------------------------------

function moveDrag(e){

    if(e.pointerId != pointerId)
        return;

    updateJoystick(e);

}



//--------------------------------------

function stopDrag(e){

    if(e.pointerId != pointerId)
        return;

    pointerId = null;

    stick.style.left =
        (CENTER-STICK_RADIUS)+"px";

    stick.style.top =
        (CENTER-STICK_RADIUS)+"px";

    xValue.textContent="0.00";
    yValue.textContent="0.00";

    lastCommand.textContent="Parado";

    sendCommand(0,0,0);

}



//--------------------------------------

function updateJoystick(e){

    const rect =
        joystick.getBoundingClientRect();

    let dx =
        e.clientX -
        rect.left -
        CENTER;

    let dy =
        e.clientY -
        rect.top -
        CENTER;

    const distance =
        Math.sqrt(dx*dx + dy*dy);

    if(distance > MAX_RADIUS){

        dx =
            dx/distance*MAX_RADIUS;

        dy =
            dy/distance*MAX_RADIUS;

    }

    stick.style.left =
        (CENTER + dx - STICK_RADIUS)+"px";

    stick.style.top =
        (CENTER + dy - STICK_RADIUS)+"px";

    let nx =
        dx/MAX_RADIUS;

    let ny =
        -dy/MAX_RADIUS;

    xValue.textContent =
        nx.toFixed(2);

    yValue.textContent =
        ny.toFixed(2);

    let intensity =
        Math.min(
            Math.sqrt(nx*nx+ny*ny),
            1
        );

    let currentSpeed =
        Math.round(
            intensity*speed
        );

    lastCommand.textContent =
        "X: "+
        nx.toFixed(2)+
        "  Y: "+
        ny.toFixed(2);

    sendCommand(
        nx,
        ny,
        currentSpeed
    );

}