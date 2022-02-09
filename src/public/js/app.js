const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = document.querySelector("input");
    socket.emit("enter_room", input.value, () => {
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

socket.on("welcome", () => {
    console.log("welcome event!")
    addMessage("someone joined!");
})