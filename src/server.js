import http from "http";
import SocketIO from "socket.io"
//import WebSocket from "ws";
import express from "express";

const app =  express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000')

const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on("connection", socket => {
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
});

/* 
const wss = new WebSocket.Server({ server });
const sockets = [];
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous"
    console.log("Connected to Browser ✓");
    socket.on("close", () => console.log("Disconnected from the Browser 𝗫"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket['nickname']} : ${message.payload.toString('utf8')}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }   
    });
}); */

httpServer.listen(3000, handleListen);
