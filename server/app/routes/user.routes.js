const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user/search", [authJwt.verifyToken], controller.searchUser);

  app.get(
    "/api/user/getUserInfo",
    [authJwt.verifyToken],
    controller.getUserInfo
  );

  app.get(
    "/api/user/updateUserInfo",
    [authJwt.verifyToken],
    controller.updateUserInfo
  );

  app.get(
    "/api/user/updateUserPassword",
    [authJwt.verifyToken],
    controller.updateUserPassword
  );

  app.get("/api/user/addBlock", [authJwt.verifyToken], controller.blockUser);
  app.get("/api/user/unBlock", [authJwt.verifyToken], controller.unBlock);
};
