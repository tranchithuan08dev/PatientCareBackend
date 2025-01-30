const diagnosisController = require("../../API/controller/diagnosis.controller");
const route = require("express").Router();

route.get("/create", diagnosisController.create);
module.exports = route;
