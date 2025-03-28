const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", socket => {
    socket.on("join-room", roomId => {
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", socket.id);

        socket.on("offer", data => {
            socket.to(roomId).emit("offer", data);
        });

        socket.on("answer", data => {
            socket.to(roomId).emit("answer", data);
        });

        socket.on("ice-candidate", data => {
            socket.to(roomId).emit("ice-candidate", data);
        });
    });

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
