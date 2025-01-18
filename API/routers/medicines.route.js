const medicinesController = require("../../API/controller/medicines.controller");
const route = require("express").Router();

route.get("/getAll", medicinesController.getAllMedicines);
route.get("/detail", medicinesController.getDetailMedicines);

module.exports = route;
