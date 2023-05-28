const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },

  author: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  attachments: {
    type: Array,
  },
});

module.exports = mongoose.model("message", MessageSchema);
