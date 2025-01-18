const pool = require("../config/connection");
pool.connect();

const baseModel = {
  find: async (tableName, columns = ["*"], { limit, skip } = {}) => {
    try {
      const setColumns = columns.join(", ");
      let query = `SELECT ${setColumns} FROM "${tableName}"`;

      const values = [];

      if (limit && skip !== undefined) {
        const clause = `
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}`;

        query += clause;
        values.push(limit);
        values.push(skip);
      }

      return (await pool.query(query, values)).rows;
    } catch (error) {
      console.error("Error executing pagination query:", error);
      throw new Error(`Pagination operation failed: ${error.message}`);
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
      console.error("Error executing findByPhone:", error);
      throw new Error(`Find by phone operation failed: ${error.message}`);
    }
  },
};

module.exports = baseModel;
