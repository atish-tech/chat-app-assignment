const express = require("express");
const Router = express.Router();
const {registerController , loginController} = require('../Conroller/userController');
const protect = require("../Middleware/authMiddleWare");
const getUserController = require("../Conroller/getUserController");
const addUserToMyContact = require("../Conroller/addUserToMyContact");


Router.get('/' , (request , response) => {
    response.send("API is running");
});
Router.post('/register' , registerController);
Router.post('/login' , loginController);
Router.get('/users' , protect , getUserController);
Router.post('/addcontact' , addUserToMyContact);

module.exports = Router;