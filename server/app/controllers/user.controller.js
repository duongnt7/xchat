const db = require("../models");
var bcrypt = require("bcryptjs");
const { use } = require("../chat/router");

const User = db.user;

exports.searchUser = (req, res) => {
  if (req.query.username) {
    let nam = req.query.username;
    User.find(
      { username: { $regex: new RegExp("^" + nam.toLowerCase(), "i") } },
      (err, users) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.status(200).send({
          users: users,
        });
      }
    );
  }
};

exports.getUserInfo = (req, res) => {
  if (req.query.id) {
    User.findOne({ _id: req.query.id }, (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          listBlock: user.listBlock,
        },
      });
    });
  }
};

exports.updateUserInfo = (req, res) => {
  User.findOne({ _id: req.query.id }).exec((err, user) => {
    var passwordIsValid = bcrypt.compareSync(req.query.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }
    User.updateOne(
      { _id: req.query.id },
      {
        username: req.query.newUsername,
        email: req.query.newEmail,
      },
      (err, user) => {
        if (err) {
          res.status(500).send({ error: err });
          return;
        }

        res.status(200).send({ user: user });
      }
    );
  });
};

exports.updateUserPassword = (req, res) => {
  if (req.query.newPassword !== req.query.rePassword) {
    return res.status(401).send({
      message: "RePassword incorrect!",
    });
  }

  User.findOne({ _id: req.query.id }).exec((err, user) => {
    var passwordIsValid = bcrypt.compareSync(req.query.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    User.updateOne(
      { _id: req.query.id },
      {
        password: bcrypt.hashSync(req.query.newPassword, 8),
      },
      (err, user) => {
        if (err) {
          res.status(500).send({ error: err });
          return;
        }

        res.status(200).send({ user: user });
      }
    );
  });
};

exports.updateRoom = (userId, roomId) => {
  User.updateOne(
    { _id: userId },
    {
      roomOnline: roomId,
    },
    (err, user) => {
      if (err) {
        console.log({ error: err });
        return;
      }

      // console.log({ message: "update room success" });
      return;
    }
  );
};

exports.getRoom = (id, callback) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      console.log({ message: err });
      return;
    }
    return callback(user.roomOnline);
  });
};

exports.blockUser = (req, res) => {
  updateBlock(req.query.userId, req.query.blockId, req.query.blockName);

  function updateBlock(userId, blockId, blockName) {
    User.findOne({ _id: userId }, (err, blk) => {
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
          if (blk.blockId === blockId) {
            indexfor = index;
            updated = true;
            blk.listBlock[index] = block;
          }
        });
        if (!updated && indexfor === blk.listBlock.length - 1) {
          blk.listBlock.push(block);
        }
      } else blk.listBlock.push(block);

      User.updateOne(
        { _id: userId },
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

exports.unBlock = (req, res) => {
  updateBlock(req.query.userId, req.query.blockId);

  function updateBlock(userId, blockId) {
    User.findOne({ _id: userId }, (err, blks) => {
      if (err) {
        console.log({ error: err });
        return;
      }

      let updated = false;
      let indexfor = 0;
      if (blks.listBlock.length > 0) {
        blks.listBlock.forEach((blk, index) => {
          if (blk.blockId === blockId) {
            indexfor = index;
            updated = true;
            blks.listBlock.splice(index, 1);
          }
        });
        if (!updated && indexfor === blk.listBlock.length - 1) {
          blks.listBlock.push(block);
        }
      } else blks.listBlock.push(block);

      User.updateOne(
        { _id: userId },
        { $set: { listBlock: blks.listBlock } },
        (err, updateCon) => {
          if (err) {
            console.log("err---", err);
            return;
          }

          return res.status(200).send({
            message: "UnBlock success!",
          });
        }
      );
    });
  }
};
