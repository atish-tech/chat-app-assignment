const userModel = require("../Models/userModels");

const getUserController = async (request , response) => {
    const keyword = request.query.search
        ? {
            $or: [
                { name: { $regex: request.query.search, $options: "i" } },
                { email: { $regex: request.query.search, $options: "i" } },
            ],
        }
        : {};
    const users = await userModel.find(keyword).find({
        _id: { $ne: request.user._id },
    });
    response.send(users);
}

module.exports = getUserController;