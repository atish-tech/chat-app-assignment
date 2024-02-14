const jsonwebtoken = require('jsonwebtoken');
const usermodel = require("../Models/userModels");

const protect = async (request , responnse , next) => {
    let token;

    if(
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = request.headers.authorization.split(" ")[1];
            const decod = jsonwebtoken.verify(token , process.env.JWT_SECRET);
            request.user = await usermodel.findById(decod.id).select("-password");
            next();
        } 
        catch (error) {
            responnse.status(401);
            throw new Error("user not authorized");
        }
    }

    if(!token) {
        responnse.status(401);
        // throw new Error("user not authorized");
        console.log("user not authorized");
        next();
    }
}

module.exports = protect;