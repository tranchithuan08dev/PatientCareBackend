const route = require("express").Router();
const paymentController = require("../../API/controller/payment.controller");

route.get("/getAll", paymentController.getAll);

module.exports = route;
