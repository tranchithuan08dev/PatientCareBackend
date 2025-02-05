const userController = require("../../API/controller/user.controller");
const route = require("express").Router();

route.post("/create", userController.create);
route.get("/getAll", userController.getAll);
module.exports = route;
