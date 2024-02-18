const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config(); // load envirnment variable

const socket = require("socket.io");

const connectDb = require("./Database/ConnectDB");
const Router = require("./Route/auth");
const messageRoute = require("./Route/messageRoute");
const groupChat = require("./Route/groupChatRoute");

// Parse incomeing request
app.use(express.json());
// allow client to connect server
app.use(cors());

// connect Database
connectDb();

// default route
app.get((request, response) => {
  response.status(200).json({ message: "API is rinning" });
});

// Routes
app.use(Router);
app.use(messageRoute);
app.use(groupChat);

const server = app.listen(8080);

// Socket io connection
const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
  pingTimeOut: 6000,
});

const { addUser } = require("./Config/userGroup");

global.onlineUser = new Map();
const users = {};
const groups = {};
io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUser.set(userId, socket.id);
    users[userId] = socket.id;
    console.log(users);
  });

  // group chat
  socket.on("join", ({ group }) => {
    groups[group] = socket.id;

    socket.join(group);

    socket.on("send-group-message", ({ message , group}) => {
      io.to(groups[group]).emit("recive-group-message", {
        group,
        message,
      });
    });
  });

  socket.on("typing", (data) => {
    socket.to(users[data.to]).emit("typing", data.to);
    // console.log("typing" , data);
  });

  socket.on("group-message", (data) => {
    console.log(data.groupId);
    socket.emit(`recive-message`, data);
  });

  socket.on("send-message", (data) => {
    const reciverId = users[data.to];
    if (reciverId) {
      socket.to(reciverId).emit("message-recive", data.message);
    }
  });

  socket.on("disconnectServer", (userId) => {
    console.log("...............");
    delete users[userId];
    console.log(users);
  });
});
