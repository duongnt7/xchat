const { authJwt } = require("../middlewares");
const controller = require("../controllers/conversation.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/conversation/getList",
    [authJwt.verifyToken],
    controller.getListConversation
  );
  app.get("/api/conversation/addConversation", controller.addConversation);

  app.get(
    "/api/conversation/updateConversation",
    [authJwt.verifyToken],
    controller.updateConversation
  );
};
