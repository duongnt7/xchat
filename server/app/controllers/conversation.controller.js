const { use } = require("../chat/router");
const { conversation } = require("../models");
const db = require("../models");
const { update } = require("../models/user.model");

const Conversation = db.conversation;

function compare(a, b) {
  if (a.time > b.time) {
    return -1;
  }
  if (a.time < b.time) {
    return 1;
  }
  return 0;
}

exports.addConversation = (req, res) => {
  if (req.query.userId) {
    const conversation = new Conversation({
      userId: req.query.userId,
      listConversations: [],
      listBlock: [],
    });

    conversation.save((err, conversation) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send({
        users: conversation,
      });
    });
  }
};

// exports.getConversation = (req, res) => {
//   Conversation.findOne({ userId: req.query.userId }, (err, conversation) => {
//     if (err) {
//       res.status(500).send({ conversation: err });
//       return;
//     }
//     res.status(200).send({ conversation: conversation });
//   });
// };

exports.updateConversation = (info) => {
  const data = JSON.parse(info);
  let roomId = data.roomId;
  let userId = data.sender.id;
  let username = data.sender.username;
  let partnerId = data.receive.id;
  let partnername = data.receive.username;

  updateInDB(userId, partnerId, partnername);
  updateInDB(partnerId, userId, username);

  function updateInDB(idUser, idPartner, name) {
    Conversation.findOne({ userId: idUser }, (err, conversation) => {
      if (err) {
        console.log({ error: err });
        return;
      }

      conv = {
        idPartner: idPartner,
        name: name,
        roomId: roomId,
        time: new Date().getTime(),
      };

      let updated = false;
      let indexfor = 0;
      if (conversation.listConversations.length > 0) {
        conversation.listConversations.forEach((con, index) => {
          if (con.roomId === roomId) {
            indexfor = index;
            updated = true;
            conversation.listConversations[index] = conv;
          }
        });
        if (
          !updated &&
          indexfor === conversation.listConversations.length - 1
        ) {
          conversation.listConversations.push(conv);
        }
      } else conversation.listConversations.push(conv);

      Conversation.updateOne(
        { userId: idUser },
        { $set: { listConversations: conversation.listConversations } },
        (err, updateCon) => {
          if (err) {
            console.log("err---", err);
            return;
          }

          // return getListConversation;
        }
      );
    });
  }
};

exports.getListConversation = (req, res) => {
  if (req.query.userId) {
    Conversation.findOne({ userId: req.query.userId })
      //   .limit(10)
      // .skip(10 * req.query.offset )
      .exec((err, conversation) => {
        // console.log(conversation);
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        let result = conversation.listConversations.sort(compare);
        res.status(200).send({
          conversations: result,
        });
      });
  }
};

exports.getListConvSocket = (userId, callback) => {
  Conversation.findOne({ userId: userId })
    //   .limit(10)
    // .skip(10 * req.query.offset )
    .exec((err, conversation) => {
      // console.log(conversation);
      if (err) {
        console.log({ message: err });
        return;
      }
      let result = conversation.listConversations.sort(compare);
      return callback(result);
    });
};

exports.getListBlock = (req, res) => {
  if (req.query.userId) {
    Conversation.findOne({ userId: req.query.userId }).exec(
      (err, listBlock) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        let result = conversation.listBlock;
        res.status(200).send({
          listBlock: result,
        });
      }
    );
  } else {
    return res.status(401).send({
      message: "Not found user",
    });
  }
};

exports.blockUser = (req, res) => {
  updateBlock(req.query.userId, req.query.blockId, req.query.blockName);

  function updateBlock(userId, blockId, blockName) {
    Conversation.findOne({ userId: userId }, (err, blk) => {
      if (err) {
        console.log({ error: err });
        return;
      }

      block = {
        blockId: blockId,
        blockName: blockName,
        time: new Date().getTime(),
      };

      let updated = false;
      let indexfor = 0;
      if (blk.listBlock.length > 0) {
        blk.listBlock.forEach((blk, index) => {
          if (blk.blockId === req.query.blockId) {
            indexfor = index;
            updated = true;
            blk.listBlock[index] = block;
          }
        });
        if (!updated && indexfor === blk.listBlock.length - 1) {
          blk.listBlock.push(block);
        }
      } else blk.listBlock.push(block);

      Conversation.updateOne(
        { userId: userId },
        { $set: { listBlock: blk.listBlock } },
        (err, updateCon) => {
          if (err) {
            console.log("err---", err);
            return;
          }

          return res.status(200).send({
            message: "Block success!",
          });
        }
      );
    });
  }
};
