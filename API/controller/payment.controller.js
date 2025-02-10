const handleResponse = require("../../helper/handleRespone.helper");
const baseModel = require("../../model/base.model");
const handleError = require("../../helper/handleError.helper");
const paymentTable = require("../../model/table/payment.table");
const paymentController = {
  getAll: async (req, res) => {
    let statusCode;
    try {
      const limit = Math.abs(parseInt(req.query.perpage)) || null;
      const offset = (Math.abs(parseInt(req.query.page) || 1) - 1) * limit;
      const payment = await baseModel.find(
        paymentTable.name,
        undefined,
        { limit },
        paymentTable.columns.paymentId
      );
      if (!payment || payment.length === 0) {
        statusCode = 400;
        throw new Error("No records of medicines");
      }
      return handleResponse(res, 200, { payment: payment });
    } catch (error) {
      return handleError(res, statusCode, error);
    }
  },
};

module.exports = paymentController;
