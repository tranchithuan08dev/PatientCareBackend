const baseModel = require("../../model/base.model");
const medicinesTable = require("../../model/table/medicines.table");
const handleResponse = require("../../helper/handleRespone.helper");
const handleError = require("../../helper/handleError.helper");
const isValidId = require("../../validates/reqIdParam.validate");
const handleRespone = require("../../helper/handleRespone.helper");
const { getColsVals } = require("../../helper/getColsVals.helper");
const medicinesController = {
  createMedicine: async (req, res) => {
    try {
      const {
        medicinesName,
        dosageInstructions,
        description,
        priceIn,
        priceOut,
        quantity,
      } = req.body;
      console.log(req.body);

      if (!medicinesName || !priceIn || !priceOut || !quantity) {
        return res
          .status(400)
          .json({ message: "Required fields are missing." });
      }

      const newMedicine = await baseModel.create(
        medicinesTable.name,
        Object.keys(medicinesTable.columns).filter(
          (key) => key !== "medicineId"
        ),
        [
          medicinesName,
          dosageInstructions,
          description,
          priceIn,
          priceOut,
          quantity,
        ]
      );
      return handleResponse(res, 201, { medicines: newMedicine });
    } catch (error) {
      console.error("Error creating medicine:", error);
      return handleError(res, statusCode, error);
    }
  },

  updateMedicine: async (req, res) => {
    try {
      const { id } = req.query;
      const updates = req.body;

      if (!id || Object.keys(updates).length === 0) {
        return res
          .status(400)
          .json({ message: "Medicine ID and updates are required." });
      }

      const validColumns = Object.keys(updates).filter(
        (key) => medicinesTable.columns[key]
      );
      const validValues = validColumns.map((key) => updates[key]);
      const dbColumns = validColumns.map((key) => medicinesTable.columns[key]);

      if (dbColumns.length === 0) {
        return res.status(400).json({ message: "No valid columns to update." });
      }

      // Call your update method
      const updatedMedicine = await baseModel.update(
        medicinesTable.name, // Table name
        medicinesTable.columns.medicineId, // ID column
        id, // ID value
        dbColumns, // Columns to update
        validValues // Corresponding values
      );

      if (!updatedMedicine) {
        return res.status(404).json({ message: "Medicine not found." });
      }

      res.status(200).json(updatedMedicine);
    } catch (error) {
      console.error("Error updating medicine:", error);
      res.status(500).json({ message: "Failed to update medicine." });
    }
  },

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
      console.log("id", id);

      if (!id && !isValidId(id)) {
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
