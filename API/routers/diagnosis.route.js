const diagnosisController = require("../../API/controller/diagnosis.controller");
const route = require("express").Router();

route.post("/create", diagnosisController.create);
route.get("/getdetail", diagnosisController.getDetail);
module.exports = route;
