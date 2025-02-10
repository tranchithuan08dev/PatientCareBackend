const medicinesRouter = require("../routers/medicines.route");
const userRouter = require("../routers/user.route");
const diagnosisRouter = require("../routers/diagnosis.route");
const paymentRouter = require("../routers/payment.route");
module.exports = (app) => {
  app.use("/api/medicines", medicinesRouter);
  app.use("/api/user", userRouter);
  app.use("/api/diagnosis", diagnosisRouter);
  app.use("/api/payment", paymentRouter);
};
