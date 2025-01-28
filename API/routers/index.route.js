const medicinesRouter = require("../routers/medicines.route");
const userRouter = require("../routers/user.route");
module.exports = (app) => {
  app.use("/api/medicines", medicinesRouter);
  app.use("/api/user", userRouter);
};
