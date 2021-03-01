const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
  {
    roomId: String,
    sender: Object,
    receive: Object,
    text: String,
    time: String,
  }
  )
);

module.exports = Message;
