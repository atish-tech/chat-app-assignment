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

const sendMessageInAGroup = async (request, response) => {
  try {
    const { userId, message, groupId } = request.body;
    const groupData = await groupChatModel.findById(groupId);
    if (groupData) {
      if (groupData.users.includes(userId)) {
        groupData.groupChat.push({ message, _id: userId });
        await groupData.save();
        return response
          .status(200)
          .json({ message: "Message sent successfull" });
      } else {
        return response.status(400).json({ message: "Message sent faild" });
      }
    }

    return response.status(400).json({ message: "Group Not Found" });
  } catch (error) {
    console.log(error);
    return response.status(400).json({ message: "sendMessageInAGroup" });
  }
};

const getGroupMessage = async (request, response) => {
  try {
    const { groupId, userId } = request.body;
    const groupData = await groupChatModel.findById(groupId);
    if (groupData && groupData.users.includes(userId)) {
      return response.status(200).json({ data: groupData.groupChat });
    } else {
      return response
        .status(400)
        .json({ message: "User Not Present in this group" });
    }
  } catch (error) {
    console.log(error);
    return response.status(400).json({ message: "Group Not Found" });
  }
};

const getAllAvailibleGroup = async (request, response) => {
  try {
    const groupData = await groupChatModel.find().select("-groupChat -users");
    return response.status(200).json({ data: groupData });
  } catch (error) {
    console.log("getAllAvailibleGroup");
    return response.status(400).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllAvailibleGroup,
  createGroup,
  addUserInAgroup,
  sendMessageInAGroup,
  getGroupMessage,
};
