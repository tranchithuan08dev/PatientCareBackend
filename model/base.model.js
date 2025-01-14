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

      return (await pool.query(query, values)).row;
    } catch (error) {
      console.error("Error executing pagination query:", error);
      throw new Error(`Pagination operation failed: ${error.message}`);
    }
  },
};

module.exports = baseModel;
