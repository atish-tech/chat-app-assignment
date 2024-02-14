const Messages = require("../Models/messageModel");

const addMessage = async (request , response , next) => {
    try {
        const {from , to , message} = request.body;
        const data = await Messages.create({
            message: {text : message} ,
            users : [from , to],
            sender : from,
        })
        if(data) {
            return response.json({message : "Message send sucessfull"})
        }
        else {
            return response.json({message : "Faild to send message"});
        }
    }
    catch (error) {
        response.status(400);
        console.log(error.message);
        next(error);
    }
}

const getMessage = async (request , response , next) => {
    try {
        const {from , to } = request.body;

        const message = await Messages.find({
            users: {
                $all : [from , to],
            }
        }).sort({updatedAt : 1});

        const userMessage = message.map((m) => {
            return {
                fromSelf : m.sender.toString() === from,
                message : m.message.text,
            };
        });

        response.json(userMessage);
    }
    catch (error) {
        next(error)
        console.log(error.message);
    }
}

module.exports = {addMessage , getMessage};