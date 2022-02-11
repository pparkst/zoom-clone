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

function handleMessageSubmit(event) {    
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const message = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${message}`);
    });
 
    input.value = "";
}

function handleRoomSubmit(event){
    event.preventDefault();

    const inputRoom = document.querySelector("#roomname");
    const inputNick = document.querySelector("#nickname");
    socket.emit("enter_room", inputRoom.value, inputNick.value, () => {
        const h3 = room.querySelector("h3");
        h3.innerText = `Room ${roomName}`
        welcome.hidden = true;
        room.hidden = false;

        const msgForm = room.querySelector("#msg");
        msgForm.addEventListener("submit", handleMessageSubmit);
    });
    
    roomName = inputRoom.value;
    nickName = inputNick.value;

    inputRoom.value = "";
    inputNick.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} joined!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", (message) => {
    addMessage(message);
});