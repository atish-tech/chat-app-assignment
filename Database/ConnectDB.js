const mongoose = require('mongoose')

const host = "mongodb://127.0.0.1/chat-application";
const productionHost = "mongodb+srv://aatish:atish.tech@realtimechatappdb.5xmnrv8.mongodb.net/Chat-App"
const connectDB = async () => { 
    try { 
        await mongoose.connect(productionHost)
        console.log("Database is connected");
    } 
    catch (error) {
        console.log("Database in not connected" , error.message);
    } 
}

module.exports = connectDB;