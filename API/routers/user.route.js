const userController = require("../../API/controller/user.controller");
const route = require("express").Router();

route.post("/create", userController.create);
module.exports = route;
