const medicinesRouter = require("../routers/medicines.route");

module.exports = (app) => {
  app.use("/api/medicines", medicinesRouter);
};
