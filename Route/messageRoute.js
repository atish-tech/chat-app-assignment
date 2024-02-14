const express = require("express");
const Router = express.Router();
const protect = require("../Middleware/authMiddleWare");
const {addMessage , getMessage} = require("../Conroller/messageController");

Router.post("/addmessage" , addMessage);
Router.post('/getmessage' , getMessage);

module.exports = Router;