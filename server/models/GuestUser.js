const mongoose = require("mongoose");

const GuestUserSchema = new mongoose.Schema({
  username: {
    unique: true,
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d",
  },

  isGuest: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("GuestUser", GuestUserSchema);
