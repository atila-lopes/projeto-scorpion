const joystick =
document.getElementById("joystick");

const stick =
document.getElementById("stick");

const xValue =
document.getElementById("xValue");

const yValue =
document.getElementById("yValue");

const lastCommand =
document.getElementById("lastCommand");

const speedValue =
document.getElementById("speedValue");

const plus =
document.getElementById("plus");

const minus =
document.getElementById("minus");

let dragging = false;

let speed = 100;



plus.addEventListener("click",()=>{

    speed=Math.min(100,speed+10);

    speedValue.innerHTML=speed+"%";

});



minus.addEventListener("click",()=>{

    speed=Math.max(0,speed-10);

    speedValue.innerHTML=speed+"%";

});



async function sendCommand(x,y,speed){

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



function startDrag(e){

    dragging=true;

    moveStick(e);

}



function stopDrag(){

    dragging=false;

    stick.style.left="100px";
    stick.style.top="100px";

    xValue.innerHTML="0.00";
    yValue.innerHTML="0.00";

    lastCommand.innerHTML="Parado";

    sendCommand(0,0,0);

}



function moveStick(e){

    if(!dragging)
        return;

    const rect=
        joystick.getBoundingClientRect();

    let x=
        e.clientX-rect.left;

    let y=
        e.clientY-rect.top;

    x-=40;
    y-=40;

    x=Math.max(
        0,
        Math.min(200,x)
    );

    y=Math.max(
        0,
        Math.min(200,y)
    );

    stick.style.left=x+"px";
    stick.style.top=y+"px";

    let nx=
        (x-100)/100;

    let ny=
        -(y-100)/100;

    xValue.innerHTML=
        nx.toFixed(2);

    yValue.innerHTML=
        ny.toFixed(2);

    let intensity=
        Math.sqrt(
            nx*nx+
            ny*ny
        );

    intensity=
        Math.min(
            intensity,
            1
        );

    let currentSpeed=
        Math.round(
            speed*
            intensity
        );

    lastCommand.innerHTML=
        "X: "+
        nx.toFixed(2)+
        " | Y: "+
        ny.toFixed(2);

    sendCommand(
        nx,
        ny,
        currentSpeed
    );

}