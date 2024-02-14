const express = require('express');
const Router = express.Router();
const protect = require("../Middleware/authMiddleWare");
const { accessChat, fetchChat, createGroupChat, groupExit, fetchGroup, addSelfToGroup } = require("../Conroller/chatController");

Router.post('/', protect, accessChat);
Router.get('/' , protect , fetchChat);
Router.post('/createGroup' , protect , createGroupChat);
Router.get('/fetchGroup' , protect , fetchGroup);
Router.put('/groupExit' , protect , groupExit);
Router.put("./addSelfToGroup" , protect , addSelfToGroup);