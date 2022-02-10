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
    const input = room.querySelector("input");
    const message = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${message}`);
    });
 
    input.value = "";
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

        const form = room.querySelector("form");
        form.addEventListener("submit", handleMessageSubmit)
    });
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
    console.log("welcome event!")
    addMessage("someone joined!");
})

socket.on("bye", () => {
    addMessage("someone left ㅠㅠ");
})

socket.on("new_message", (message) => {
    addMessage(message);
})