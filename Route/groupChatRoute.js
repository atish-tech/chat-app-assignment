const { createGroup, addUserInAgroup, sendMessageInAGroup } = require("../Conroller/groupChatController");

const route = require("express").Router();

route.post("/create/group" , createGroup);
route.post("/group/add/user" , addUserInAgroup);
route.post("/group/send/message" , sendMessageInAGroup);

module.exports = route;