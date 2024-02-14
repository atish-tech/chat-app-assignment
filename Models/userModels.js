const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, "please provide email"],
        unique: true,
        // match: [/.+@.+\..+/, "please enter valid email address"],
        lowerecase: true,
        trim: true,
    },
    password: {
        type: String, required: true,
        minlength: 3,
    },
    contacts : [{id: String}],

},
    {
        timeStamp: true,
    });

// Hash Password
// chech for password match -> convert client password to hashed text
user.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

user.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model('Users', user);

module.exports = userModel;