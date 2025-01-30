const pool = require("../../config/connection");

pool.connect();

const diagnosisController = {
  create: async (req, res) => {
    try {
      const { medicinesDetails, diagnois } = req.body;
      const queryUser = "SELECT userid FROM users ORDER BY userid DESC LIMIT 1";
      const resultUser = await pool.query(queryUser);
      if (resultUser.rows.length > 0) {
        const userId = resultUser.rows[0].userid;
        const queryInsertDiagnosis = `INSERT INTO diagnosis (
    userid, pulserate, respirationrate, bloodpressure,
    height, weight, medicalhistory, clinicalsigns,
    diagnosis, resolution, nextappointment
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
);`;
        const {
          pulserate,
          respirationrate,
          bloodpressure,
          height,
          weight,
          medicalhistory,
          clinicalsigns,
          diagnosis,
          resolution,
          nextappointment,
        } = diagnois;
        const resultDiagnosis = await pool.query(queryInsertDiagnosis, [
          pulserate,
          respirationrate,
          bloodpressure,
          height,
          weight,
          medicalhistory,
          clinicalsigns,
          diagnosis,
          resolution,
          nextappointment,
        ]);
        if (resultDiagnosis.rows.length > 0) {
          const diagnosisId = resultUser.rows[0].diagnosisId;
          await client.query("BEGIN");

          for (const medicineDetail of medicinesDetails) {
            const {
              medicineId,
              dosageUnit,
              morningDosage,
              afternoonDosage,
              eveningDosage,
              nightDosage,
              days,
              quantity,
              usageInstructions,
              notes,
            } = medicineDetail;

            if (!medicineId || !quantity || !days) {
              throw new Error("Missing required fields in medicine detail");
            }

            // Lấy số lượng thuốc hiện tại từ bảng Medicines
            const medicineQuery = `SELECT quantity, priceOut FROM Medicines WHERE medicinesId = $1`;
            const medicineResult = await client.query(medicineQuery, [
              medicineId,
            ]);

            if (medicineResult.rows.length === 0) {
              throw new Error(`Medicine with ID ${medicineId} not found`);
            }

            const { quantity: availableQuantity, priceOut } =
              medicineResult.rows[0];

            if (availableQuantity < quantity) {
              throw new Error(
                `Not enough stock for medicine with ID ${medicineId}`
              );
            }

            // Tạo ID cho DiagnosisDetail
            const diagnosisDetailId = uuidv4();

            // Cập nhật DiagnosisDetail
            const insertDiagnosisDetailQuery = `
                INSERT INTO DiagnosisDetail (
                    diagnosisDetailId, diagnosisId, medicineId, dosageUnit, morningDosage, afternoonDosage, 
                    eveningDosage, nightDosage, days, quantity, price, usageInstructions, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            `;

            await client.query(insertDiagnosisDetailQuery, [
              diagnosisDetailId,
              diagnosisId,
              medicineId,
              dosageUnit || null,
              morningDosage || 0,
              afternoonDosage || 0,
              eveningDosage || 0,
              nightDosage || 0,
              days,
              quantity,
              priceOut * quantity,
              usageInstructions || null,
              notes || null,
            ]);

            // Trừ số lượng thuốc trong bảng Medicines
            const updateMedicineQuery = `
                UPDATE Medicines
                SET quantity = quantity - $1
                WHERE medicinesId = $2
            `;
            await client.query(updateMedicineQuery, [quantity, medicineId]);
          }

          await client.query("COMMIT");
          res.status(200).json({
            message:
              "Diagnosis details updated and medicine quantities deducted successfully",
          });
        }
      } else {
        return res.status(404).json({ message: "No users found" });
      }
    } catch (error) {
      console.error("Error retrieving userid:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = diagnosisController;
