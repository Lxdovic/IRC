const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    unique: true,
    type: String,
    required: true,
  },

  password: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  isGuest: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
