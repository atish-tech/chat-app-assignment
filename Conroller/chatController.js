const Chat = require('../Models/chatModel');
const Message = require('../Models/messageModel');

const accessChat = async (request , response) => {
    const {userId} = request.body;

    if(!userId) {
        return response.sendStatus(400);
    }

    // find chat 
    var isChat = await Chat.find({
        isGroupChat : false,
        $and : [
            {users: {$elemMatch: {$eq: response.user._id}}} ,
            {users : {$elemMatch : {$eq: userId}}},
        ]
    })
    .populate("users" , "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat , {
        path: "latestMessage.sender",
        select: "name email",
    })

    if(isChat.length > 0) {
        response.send(isChat[0]);
    }

    // first time chat with user
    else {
        var chatData = {
            chatName : "sender",
            isGroupChat : false,
            users : [request.user._id , userId],
        }

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createdChat._id})
            .populate("users" , "-password");
            response.sendStatus(200);
        }
        catch (error) {
            response.sendStatus(400);
        }
    }
}

const fetchChat = async (request , response) => {
    try {
        Chat.find({users: {$elemMatch : {$eq : request.user._id}}})
        .populate("users" , "-password")
        .populate("groupAdmin" , "-password")
        .populate("latestMessage")
        .sort({updatedAt : -1})
        .then(async (results) => {
            results = await User.populate(results , {
                path: "latestMessage.sender",
                select: "name email",
            });
            response.status(200).send(results);
        });
    }
    catch (error) {
        response.status(400);
        throw new Error(error.message);
    }
}

const fetchGroup = async (request , response) => {
    try{
        const allgroups = await Chat.where("isGroupChat").equals(true);
        response.status(200).send(allgroups);
    }
    catch (error) {
        response.status(400);
        throw new Error(error.message);
    }
} 

const createGroupChat = async (requesst, response) => {
    if (!requesst.body.users || !requesst.body.name) {
      return response.status(400).send({ message: "Data is insufficient" });
    }
  
    var users = JSON.parse(requesst.body.users);
    console.log("chatController/createGroups : ", requesst);
    users.push(requesst.user);
  
    try {
      const groupChat = await Chat.create({
        chatName: requesst.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: requesst.user,
      });
  
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      response.status(200).json(fullGroupChat);
    } catch (error) {
      response.status(400);
      throw new Error(error.message);
    }
  };

const groupExit = async (request , response) => {
    const {chatId , userId} = request.body;

    // if request user is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId ,
        {
            $pull: {users: userId},
            
        },
        {
            new : true,
        }
    ).populate("users" , "-password")
    .populate("groupAdmin" , "-password");

    if(!removed) {
        response.status(404);
        throw new Error("chat is not found");
    }
    else {
        response.json(removed);
    }
}

const addSelfToGroup = async (request , response) => {
    const {chaitId , userId} = request.body;

    const added = await Chat.findByIdAndUpdate(
        chaitId ,
        {
            $push: {users: userId},
        },
        {
            new : true,
        }
    )
    .populate("users" , "-password")
    .populate("groupAdmin" , "-password");

    if(!added) {
        response.status(404);
        throw new Error("group not found");
    }
    else {
        response.json(added);
    }
}

module.exports = {
    accessChat ,
    fetchChat ,
    fetchGroup ,
    createGroupChat ,
    groupExit,
    addSelfToGroup
}