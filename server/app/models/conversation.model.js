const mongoose = require("mongoose");

const Conversation = mongoose.model(
  "Conversation",
  new mongoose.Schema(
  {
    userId: String,
    listConversations: Array,
  }
  )
);

module.exports = Conversation;
