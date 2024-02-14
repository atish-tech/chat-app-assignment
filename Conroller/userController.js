const generateToken = require("../Config/generateToken");
const userModel = require("../Models/userModels");


// Register
const registerController = async (request , response) => {
    const {name , email , password} = request.body;

    // empty fields 
    if(!name || !email || !password){        
        return response.status(400).json({message : "All fields are complassery"});
    }

    // email exist
    if(await userModel.findOne({email})) {
        return response.status(400).json({message : "Email already exist"});
    }

    // Create new entry
    const newUser = await userModel.create({name , email , password});
    if(newUser) {
        response.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id)
        })
    }
}


// Login
const loginController = async (request, response) => {
    const { email, password } = request.body;
    const user = await userModel.findOne({ email });  // find email in data base

    // check email
    if(!user) {
        return response.status(400).json({message : "Email not exist"});
    }

    // check password & create new token
    if (user && (await user.matchPassword(password))) {  
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    }

    // if password is not correct
    else {
        return response.status(400).json({message : "Incorrect Password"});
    }
}


module.exports = {registerController , loginController};