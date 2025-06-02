const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const users = new Map();

app.use(express.static(path.join(__dirname, '../../')));


io.on("connection", socket => {
    let username = null;

    socket.on("user-connected", name => {
        username = name;
        users.set(socket.id, name);
        io.emit("update-users", Array.from(users.values()));
    });

    socket.on("send-message", msg => {
        io.emit("receive-message", msg);
    });

    socket.on("disconnect", () => {
        if(username) users.delete(socket.id);
        io.emit("update-users", Array.from(users.values()));
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})