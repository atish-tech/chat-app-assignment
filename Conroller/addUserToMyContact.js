const userModel = require("../Models/userModels");

const addUserToMyContact = async (request, response) => {
    const { user, contact } = request.body;
    try {
        const check = await userModel.findOne(
            { _id: user , contacts: { id: contact } });
        console.log(check);
        if (check != null) {
            return response.json({ message: "already present" });
        }
        await userModel.findOneAndUpdate(
            { _id: user },
            { $push: { contacts: { id: contact } } }
        )
        await userModel.findOneAndUpdate(
            { _id: contact },
            { $push: { contacts: { id: user } } }
        )
        return response.json({ message: "done" });
    }
    catch (error) {
        return response.json({ message: "faild" });
    }
}

module.exports = addUserToMyContact;