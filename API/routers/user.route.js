const userController = require("../../API/controller/user.controller");
const route = require("express").Router();

route.post("/create", userController.create);
route.get("/getAll", userController.getAll);
route.get("/getdetail", userController.getDetail);
module.exports = route;
