const mongoose = require("mongoose");

const schema = mongoose.Schema({
  groupName: { type: String, require: true },
  groupChat: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
      message: { type: String },
    },
  ],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }],
});

module.exports = mongoose.model("GroupChat" , schema);