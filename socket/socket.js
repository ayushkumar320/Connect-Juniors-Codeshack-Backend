import {Server} from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join a doubt room for comments
        socket.on("join-doubt", (doubtId) => {
            socket.join(`doubt-${doubtId}`);
            console.log(`User ${socket.id} joined doubt room: ${doubtId}`);
        });

        // Leave a doubt room
        socket.on("leave-doubt", (doubtId) => {
            socket.leave(`doubt-${doubtId}`);
            console.log(`User ${socket.id} left doubt room: ${doubtId}`);
        });

        // Join junior space room
        socket.on("join-junior-space", () => {
            socket.join("junior-space");
            console.log(`User ${socket.id} joined junior space`);
        });

        // Leave junior space room
        socket.on("leave-junior-space", () => {
            socket.leave("junior-space");
            console.log(`User ${socket.id} left junior space`);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
