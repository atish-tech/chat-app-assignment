const { createGroup, addUserInAgroup, sendMessageInAGroup, getGroupMessage, getAllAvailibleGroup } = require("../Conroller/groupChatController");

const route = require("express").Router();

route.post("/create/group" , createGroup);
route.post("/group/add/user" , addUserInAgroup);
route.post("/group/send/message" , sendMessageInAGroup);
route.post("/group/message" , getGroupMessage);
route.get("/group" , getAllAvailibleGroup);

module.exports = route;