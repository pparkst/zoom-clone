const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function handleRoomSubmit(event){
    event.preventDefault();
    const input = document.querySelector("input");
    socket.emit("enter_room", { payload: input.value }, () => {
        console.log("server is done!");
        const h3 = room.querySelector("h3");
        h3.innerText = `Room ${roomName}`
        welcome.hidden = true;
        room.hidden = false;
    });
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);