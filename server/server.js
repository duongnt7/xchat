const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const http = require("http");
const socketio = require("socket.io");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./app/chat/users");

const router = require("./app/chat/router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors("http://localhost:8081"));
// app.use(
//   cors([
//     "http://localhost:8081",
//     "https://494120eb38b7.ngrok.io",
//     "http://494120eb38b7.ngrok.io",
//   ])
// );

app.use(router);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const { addMessage } = require("./app/controllers/message.controller");
const {
  updateConversation,
  getListConvSocket,
} = require("./app/controllers/conversation.controller");
const {
  updateRoom,
  getUserInfo,
  getRoom,
} = require("./app/controllers/user.controller");

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to xchat application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/message.routes")(app);
require("./app/routes/conversation.routes")(app);

// socket

const listCall = {};
io.on("connect", (socket) => {
  socket.on("join", ({ name, userId, partnerId, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      name,
      room,
      userId,
      partnerId,
    });

    listCall[userId] = socket.id;

    if (error) return callback(error);

    socket.join(user.room);

    getListConv(userId, room);

    updateRoom(user.userId, user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { message: message });
    addMessage(message);
    updateConversation(message);
    setTimeout(() => {
      getListConv(user.userId, user.room);
    }, 100);
    getRoom(user.partnerId, function (roomOnline) {
      if (roomOnline != null) getListConv(user.partnerId, roomOnline);
    });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      updateRoom(user.userId);
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  //call
  socket.on("disconnectCall", () => {
    delete listCall[userid];
  });

  socket.on("callUser", (data) => {
    io.to(listCall[data.userToCall]).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(listCall[data.to]).emit("callAccepted", data.signal);
  });

  socket.on("close", (data) => {
    io.to(listCall[data.to]).emit("close");
  });

  socket.on("rejected", (data) => {
    io.to(listCall[data.to]).emit("rejected");
  });

  //end call
});

const PORT = 8080;

server.listen(PORT, () => console.log(`Server has started.`));

function getListConv(userId, roomId) {
  getListConvSocket(userId, function (conversation) {
    let message = { type: 1, list: conversation, owner: userId };
    io.to(roomId).emit("message", { message: message });
  });
}
