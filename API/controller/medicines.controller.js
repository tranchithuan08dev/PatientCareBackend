const baseModel = require("../../model/base.model");
const medicinesTable = require("../../model/table/medicines.table");
const handleResponse = require("../../helper/handleRespone.helper");
const handleError = require("../../helper/handleError.helper");
const isValidId = require("../../validates/reqIdParam.validate");
const handleRespone = require("../../helper/handleRespone.helper");
const medicinesController = {
  getAllMedicines: async (req, res) => {
    let statusCode;
    try {
      const limit = Math.abs(parseInt(req.query.perpage)) || null;
      const offset = (Math.abs(parseInt(req.query.page) || 1) - 1) * limit;
      const medicines = await baseModel.find(medicinesTable.name, undefined, {
        limit,
      });
      if (!medicines || medicines.length === 0) {
        statusCode = 400;
        throw new Error("No records of medicines");
      }

      return handleResponse(res, 200, { medicines: medicines });
    } catch (error) {
      return handleError(res, statusCode, error);
    }
  },

  getDetailMedicines: async (req, res) => {
    let statusCode = 500;
    try {
      const { id } = req.query;
      if (!id) {
        statusCode = 400;
        throw new Error("Invalid ID");
      }

      const medicinesDetail = await baseModel.findById(
        medicinesTable.name,
        medicinesTable.colums.medicineId,
        id
      );

      console.log("medicinesDetail", medicinesDetail);

      if (!medicinesDetail) {
        statusCode = 404;
        throw new Error("Medicine details not found");
      }

      return handleRespone(res, 200, {
        data: medicinesDetail,
      });
    } catch (error) {
      return handleError(res, statusCode, error);
    }
  },
};
module.exports = medicinesController;
