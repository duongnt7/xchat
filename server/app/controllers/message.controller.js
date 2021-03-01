const db = require("../models");

const Message = db.message;

exports.addMessage = (textSocket) => {
  const value = JSON.parse(textSocket);
  const message = new Message({
    roomId: value.roomId,
    sender: value.sender,
    receive: value.receive,
    text: value.text,
    time: value.time,
    owner: [value.sender.id, value.receive.id],
  });

  message.save((err, message) => {
    if (err) {
      console.log({ error: err });
      return;
    }
    // console.log({ success: message });
  });
};

exports.getMessageSocket = (roomId) => {
  let mess = Message.find({ roomId: roomId })
    .limit(10)
    .sort({ time: -1 })
    .exec((err, message) => {
      if (err) {
        return;
      }
      return message;
    });
  return mess;
};

exports.getMessages = (req, res) => {
  if (req.query.roomId) {
    Message.find({
      roomId: req.query.roomId,
    })
      .limit(20)
      .sort({ time: -1 })
      // .skip(10 * req.query.offset )
      .exec((err, messages) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(200).send({
          message: messages,
        });
      });
  }
};
