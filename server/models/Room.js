const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  messages: {
    type: Array,
    default: [],
  },
  logs: {
    type: Array,
    default: [],
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Room", RoomSchema);
