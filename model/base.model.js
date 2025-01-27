const pool = require("../config/connection");

pool.connect();

const baseModel = {
  find: async (
    tableName,
    columns = ["*"],
    { limit, skip } = {},
    orderBy = "id"
  ) => {
    try {
      const setColumns = columns.join(", ");
      let query = `SELECT ${setColumns} FROM "${tableName}"`;

      const values = [];

      if (orderBy) {
        query += ` ORDER BY ${orderBy} DESC`;
      }

      if (limit && skip !== undefined) {
        query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit);
        values.push(skip);
      }

      return (await pool.query(query, values)).rows;
    } catch (error) {
      console.error("Error executing pagination query:", error);
      throw new Error(`Pagination operation failed: ${error.message}`);
    }
  },

  getAllMedicines: async (req, res) => {
    try {
      const limit = Math.abs(parseInt(req.query.perpage)) || 10; // Default to 10 per page
      const page = Math.abs(parseInt(req.query.page) || 1); // Default to page 1
      const offset = (page - 1) * limit;

      const medicines = await baseModel.find(
        medicinesTable.name,
        undefined,
        { limit, skip: offset },
        medicinesTable.columns.medicineId // Assumes medicineId exists
      );

      if (!medicines || medicines.length === 0) {
        return handleResponse(res, 200, { medicines: [] });
      }

      return handleResponse(res, 200, { medicines });
    } catch (error) {
      console.error("Error fetching medicines:", error);
      return handleError(res, 500, error);
    }
  },

  findById: async (tableName, columnName, value) => {
    try {
      const query = `SELECT * FROM "${tableName}" WHERE "${columnName}" = $1`;
      console.log(query);

      const result = await pool.query(query, [value]);
      if (result.rows.length === 0) {
        return null; // No record found
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error executing findById:", error);
      throw new Error(`Find by phone operation failed: ${error.message}`);
    }
  },

  create: async (tableName, columns, values) => {
    try {
      // Ensure columns and values are provided
      if (!columns || !values || columns.length !== values.length) {
        throw new Error(
          "Columns and values must be provided and match in length."
        );
      }

      // Generate the query dynamically
      const columnsString = columns.join(", ");
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
      const query = `INSERT INTO ${tableName} (${columnsString}) VALUES (${placeholders}) RETURNING *;`;

      // Execute the query
      const result = await pool.query(query, values);

      // Return the first row or null if no rows were returned
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error executing create:", error);
      throw new Error(`Create operation failed: ${error.message}`);
    }
  },

  executeTransaction: async (transactionCallback) => {
    try {
      await pool.query("BEGIN"); // Start transaction
      const result = await transactionCallback(); // Execute the callback
      await pool.query("COMMIT"); // Commit transaction if successful
      return result;
    } catch (error) {
      await pool.query("ROLLBACK"); // Rollback if there's an error
      throw error;
    } finally {
      (await pool.connect()).release();
    }
  },
  update: async (tableName, idColumn, idValue, columns, values) => {
    try {
      const setClause = columns
        .map((col, i) => `"${col}" = $${i + 1}`)
        .join(", ");

      const query = `UPDATE "${tableName}" SET ${setClause} WHERE "${idColumn}" = $${
        columns.length + 1
      } RETURNING *`;

      const result = await pool.query(query, [...values, idValue]);

      return result.rows[0];
    } catch (error) {
      console.error("Error executing update:", error);
      throw new Error(`Update operation failed: ${error.message}`);
    }
  },
};

module.exports = baseModel;
