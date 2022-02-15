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
let myDataChannel;

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
    if(myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = 
            myPeerConnection
            .getSenders()
            .find(sender => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
        console.log(videoSender);
    }
}

muteBtn.addEventListener("click", handleMuteBtnClick);
cameraBtn.addEventListener("click", handleCameraBtnClick);
camerasSelect.addEventListener("input", handleCameraChange);


// Welcome Form (choose a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket COde

socket.on("welcome", async () => {
    myDataChannel = myPeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener("message", console.log);
    console.log("made data channel");

    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    socket.emit("offer", offer, roomName);
    console.log("send offer");
});

socket.on("offer", async (offer) => {
    myPeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener("message", console.log);
    });
    console.log("received the offer");
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
    console.log("send Answer")
});

socket.on("answer", (answer) => {
    console.log("received the answer")
    myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    myPeerConnection.addIceCandidate(ice);
});


//RTC COde

function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
                //STUN Server 공용IP를 찾아주는 작업
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                ],
            },
        ],
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    //safari no support
    //myPeerConnection.addEventListener("addstream", handleAddStream);

    //this only safari
    myPeerConnection.addEventListener("track", handleAddStream);

    myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
    console.log("sent candidate", data.candidate, roomName);
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
    console.log("Peer - handleAddStream");
    const peersFace = document.getElementById("peersFace");
    peersFace.srcObject = data.streams[0];
    console.log("Peer's Stream", data.streams[0]);
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