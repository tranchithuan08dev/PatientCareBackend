const userTable = require("../../model/table/user.table");
const baseModel = require("../../model/base.model");
const handleResponse = require("../../helper/handleRespone.helper");
const handleError = require("../../helper/handleError.helper");
const userController = {
  create: async (req, res) => {
    try {
      const { fullName, gender, dateOfBirth, phoneNumber, address, role } =
        req.body;

      // Validate required fields
      if (!fullName || !gender || !dateOfBirth || !phoneNumber) {
        return res
          .status(400)
          .json({ message: "Required fields are missing." });
      }

      // Optional: Validate formats (e.g., phoneNumber or dateOfBirth)
      if (!/^\d{10}$/.test(phoneNumber)) {
        return res
          .status(400)
          .json({ message: "Invalid phone number format." });
      }

      // Default role if not provided
      const userRole = role || "Patient";

      // Create user record
      const newUser = await baseModel.create(
        userTable.name,
        Object.keys(userTable.columns).filter((key) => key !== "userId"),
        [fullName, gender, dateOfBirth, phoneNumber, address, userRole]
      );

      // Respond with the created user
      return handleResponse(res, 201, { user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);

      // Return a generic error message with status code 500
      return handleError(res, 500, {
        message: "An error occurred while creating the user.",
      });
    }
  },
  getAll: async (req, res) => {
    let statusCode;
    try {
      const limit = Math.abs(parseInt(req.query.perpage)) || null;
      const offset = (Math.abs(parseInt(req.query.page) || 1) - 1) * limit;
      const user = await baseModel.find(
        userTable.name,
        undefined,
        { limit },
        userTable.columns.userId
      );
      if (!user || user.length === 0) {
        statusCode = 400;
        throw new Error("No records of medicines");
      }
      return handleResponse(res, 200, { user: user });
    } catch (error) {
      return handleError(res, statusCode, error);
    }
  },
  getDetail: async (req, res) => {
    let statusCode = 500;
    try {
      const { id } = req.query;
      console.log("id", id);

      if (!id && !isValidId(id)) {
        statusCode = 400;
        throw new Error("Invalid ID");
      }
      const userDetail = await baseModel.findById(
        userTable.name,
        userTable.columns.userId,
        id
      );

      console.log("userDetail", userDetail);

      if (!userDetail) {
        statusCode = 404;
        throw new Error("Medicine details not found");
      }

      return handleResponse(res, 200, {
        data: userDetail,
      });
    } catch (error) {
      return handleError(res, statusCode, error);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.query;
      console.log("id", id);

      const updates = req.body;

      if (!id || Object.keys(updates).length === 0) {
        return res
          .status(400)
          .json({ message: "user ID and updates are required." });
      }

      const validColumns = Object.keys(updates).filter(
        (key) => userTable.columns[key]
      );
      const validValues = validColumns.map((key) => updates[key]);
      const dbColumns = validColumns.map((key) => userTable.columns[key]);

      if (dbColumns.length === 0) {
        return res.status(400).json({ message: "No valid columns to update." });
      }

      // Call your update method
      const updatedUser = await baseModel.update(
        userTable.name, // Table name
        userTable.columns.userId, // ID column
        id, // ID value
        dbColumns, // Columns to update
        validValues // Corresponding values
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating medicine:", error);
      res.status(500).json({ message: "Failed to update medicine." });
    }
  },
};

module.exports = userController;
