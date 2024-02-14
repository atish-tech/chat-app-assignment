const express = require("express");
const app = express()

const cors = require('cors');
require('dotenv').config();  // load envirnment variable

const socket = require('socket.io'); 

const connectDb = require("./Database/ConnectDB");
const Router = require("./Route/auth")
const messageRoute = require("./Route/messageRoute")

// Parse incomeing request 
app.use(express.json())
// allow client to connect server
app.use(cors());

// connect Database
connectDb();

// Routes 
app.use(Router);
app.use(messageRoute);

const server = app.listen(8080);


// Socket io connection
const io = socket(server , {
    cors: {
        origin : "*", 
        credentials : true,
    },
});


global.onlineUser = new Map();

io.on("connection" , (socket) => {
    global.chatSocket = socket;

    socket.on("add-user" , (userId) => {
        onlineUser.set(userId , socket.id);
    })

    socket.on("send-message" , (data) => {
        const sendUserSocket = onlineUser.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("message-recive" , data.message);
        }
    })
});
