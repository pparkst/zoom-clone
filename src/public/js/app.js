const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");
call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName = "";
let myPeerConnection;

async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera => {
            const option = document.createElement("option")
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
        console.log(cameras);
    }catch(e){
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio: false,
        video: { facingMode: "user" },
    };

    const cameraConstrains = {
        audio: false,
        video: {
            deviceId : {
                exact: deviceId
            }
        },
    };

    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains
        );
        myFace.srcObject = myStream;

        if (!deviceId){
            await getCameras();
        }

        console.log(myStream);
    }catch(e){
        console.log(e);
    }
}

function handleMuteBtnClick() {
    console.log(myStream.getAudioTracks());
    myStream
        .getAudioTracks()
        .forEach(track => track.enabled = !track.enabled);

    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = false;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraBtnClick() {
    myStream
        .getVideoTracks()
        .forEach(track => track.enabled = !track.enabled);
    console.log(myStream.getVideoTracks());
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    }else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = false;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteBtnClick);
cameraBtn.addEventListener("click", handleCameraBtnClick);
camerasSelect.addEventListener("input", handleCameraChange);


// Welcome Form (choose a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function startMedia() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room", input.value, startMedia);
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket COde

socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);

    socket.emit("offer", offer, roomName);
    console.log("send offer");
});

socket.on("offer", (offer) => {
    console.log(offer);
});


//RTC COde

function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream));
}




/* 
const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

const btnExit = document.getElementById("btnExit");

room.hidden = false;

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
        welcome.hidden = false;
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
        room.hidden = false;
    })
}) */