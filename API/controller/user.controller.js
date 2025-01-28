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
};

module.exports = userController;
