const diagnosisController = require("../../API/controller/diagnosis.controller");
const route = require("express").Router();

route.post("/create", diagnosisController.create);
module.exports = route;
