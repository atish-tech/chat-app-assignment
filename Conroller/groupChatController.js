const groupChatModel = require("../Models/groupChatModel");

const createGroup = async (request, response) => {
  try {
    const { groupName, userId } = request.body;
    if (await groupChatModel.findOne({ groupName: groupName })) {
      return response.status(500).json({ message: "Group Name already exist" });
    } else {
      await groupChatModel.create({ groupName: groupName, users: [userId] });
      return response.status(200).json({ message: "Group Created Sucessfull" });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "createGroup" });
  }
};

const addUserInAgroup = async (request, response) => {
  try {
    const { groupId, userId } = request.body;
    const groupData = await groupChatModel.findById(groupId);
    if (groupData) {
      if (!groupData.users.includes(userId)) {
        groupData.users.push(userId);
        await groupData.save();
        return response
          .status(200)
          .json({ message: "You are added in this group" });
      } else {
        return response
          .status(200)
          .json({ message: "User Already in this group" });
      }
    } else {
      return response.status(400).json({ message: "Group Not Found" });
    }
  } catch (error) {
    console.log(error);
    return response.status(400).json({ message: "addUserInGroup" });
  }
};

const sendMessageInAGroup = async (request , response) => {
  try {
    const {userId , message , groupId} = request.body;
    const groupData = await groupChatModel.findById(groupId);
    if(groupData) {
      if(groupData.users.includes(userId)) {
        groupData.groupChat.push({message , _id: userId});
        await groupData.save();
        return response.status(200).json({message : "Message sent successfull"});
      }
      else {
        return response.status(400).json({message : "Message sent faild"});

      }
    }
    return response.status(400).json({message : "Group Not Found"});

  } catch (error) {
    console.log(error);
    return response.status(400).json({message : "sendMessageInAGroup"});
    
  }
}

module.exports = {createGroup , addUserInAgroup , sendMessageInAGroup}