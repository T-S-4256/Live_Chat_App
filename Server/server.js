import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { db } from "./lib/db.js"
import userRouter from "./routes/userRoute.js"
import { Server } from "socket.io"
import messageRouter from "./routes/messageRoutes.js"


// CREATE EXPRESS APP AND HTTP SERVER 
const app = express();
const server = http.createServer(app);



// INITIALISE SOCKET.IO 
export const io = new Server(server, {
    cors: { origin: "*" }
})


// STORE ONLINE USERS 
export const userSocketMap = {};  // {userId:socketId}


// SOCKET IO CONNECTION HANDLER 
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected : ", userId);


    if (userId) userSocketMap[userId] = socket.id;

    // EMIT ONLINE USER TO ALL CONNECTED CLIENTS 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected : ", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})




// MIDDLEWARE SETUP 
app.use(express.json({ limit: "4mb" }))
app.use(cors());
app.use("/api/status", (req, res) => res.send("Server Is Live."));
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)


// CONNECTION WITH MONGO DB DATABASE 
db();


// START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));