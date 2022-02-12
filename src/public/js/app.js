const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            {
                autio:true,
                video:true,
            }
        );
        myFace.srcObject = myStream;
        console.log(myStream);
    }catch(e){
        console.log(e);
    }
}

getMedia();

function handleMuteBtnClick() {
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraBtnClick() {
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    }else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}


muteBtn.addEventListener("click", handleMuteBtnClick);
cameraBtn.addEventListener("click", handleCameraBtnClick);



/* 
const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

const btnExit = document.getElementById("btnExit");

room.hidden = true;

let roomName;

function clearRoom(){
    console.log("clearRoom")
    const ul = room.querySelector("ul");
    ul.innerHTML = "";
}

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
    socket.emit("enter_room", inputRoom.value, inputNick.value, (newCount) => {
        const h3 = room.querySelector("h3");
        h3.innerText = `Room ${roomName} (${newCount})`
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

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${user} joined!`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", (message) => {
    addMessage(message);
});

socket.on("room_change", (rooms) => {
    console.log("room_change", rooms);
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0) {
        return;
    }

    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});

btnExit.addEventListener("click", ()=> {
    clearRoom();
    socket.emit("leave", roomName, () => {
        welcome.hidden = false;
        room.hidden = true;
    })
}) */