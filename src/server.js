import http from "http";
import SocketIO from "socket.io"
//import { Server } from "socket.io"
//import { instrument } from "@socket.io/admin-ui"

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
httpServer.listen(3000, handleListen);


/* const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    }
});

instrument(io, {
    auth: false
});

function publicRooms(){
    //const sids = io.sockets.adapter.sids;
    //const rooms = io.sockets.adapter.rooms;

    const {
        sockets: {
            adapter: { sids, rooms }
        }
    } = io;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    })

    return publicRooms;
}

function countRoom(roomName) {
    return io.sockets.adapter.rooms.get(roomName).size;
}

io.on("connection", socket => {
    socket["nickname"] = "Anonymous";

    socket.emit("room_change", publicRooms());

    socket.onAny((event) => {
        console.log(io.sockets.adapter);
        console.log(`Socket Event : ${event}`);
    })
    socket.on("enter_room", (roomName, nickName, done) => {
        socket.join(roomName);
        socket["nickname"] = nickName;
        done(countRoom(roomName));
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        io.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
        });
    });

    socket.on("disconnect", () => {
        io.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("leave", (roomName, done) => {
        socket.to(roomName).emit("bye", socket.nickname, countRoom(roomName) - 1);
        console.log(socket.nickname);
        console.log(countRoom(roomName))
        socket.leave(roomName);
        io.sockets.emit("room_change", publicRooms());
        done();
    })
}); */

