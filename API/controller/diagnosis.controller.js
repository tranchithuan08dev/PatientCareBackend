const pool = require("../../config/connection");

const diagnosisController = {
  create: async (req, res) => {
    const client = await pool.connect();
    try {
      const { medicinesDetails, diagnois } = req.body;

      // Retrieve the latest user ID
      const queryUser = "SELECT userid FROM users ORDER BY userid DESC LIMIT 1";
      const resultUser = await client.query(queryUser);

      if (resultUser.rows.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      const userId = resultUser.rows[0].userid;

      // Insert into Diagnosis and retrieve the ID
      const queryInsertDiagnosis = `
        INSERT INTO diagnosis (
          userid, pulserate, respirationrate, bloodpressure,
          height, weight, temperature, medicalhistory, clinicalsigns,
          diagnosis, resolution, nextappointment
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        ) RETURNING diagnosisId;
      `;
      const {
        pulserate,
        respirationrate,
        bloodpressure,
        height,
        weight,
        temperature,
        medicalhistory,
        clinicalsigns,
        diagnosis,
        resolution,
        nextappointment,
      } = diagnois;

      const resultDiagnosis = await client.query(queryInsertDiagnosis, [
        userId,
        pulserate,
        respirationrate,
        bloodpressure,
        height,
        weight,
        temperature,
        medicalhistory,
        clinicalsigns,
        diagnosis,
        resolution,
        nextappointment,
      ]);

      const diagnosisId = resultDiagnosis.rows[0].diagnosisid;

      // Start a transaction
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

        // Fetch medicine data
        const medicineQuery = `SELECT quantity, priceout FROM Medicines WHERE medicinesId = $1`;
        const medicineResult = await client.query(medicineQuery, [medicineId]);

        if (medicineResult.rows.length === 0) {
          throw new Error(`Medicine with ID ${medicineId} not found`);
        }

        const { quantity: availableQuantity, priceout } =
          medicineResult.rows[0];

        if (availableQuantity < quantity) {
          throw new Error(
            `Not enough stock for medicine with ID ${medicineId}`
          );
        }

        // Insert into DiagnosisDetail
        const insertDiagnosisDetailQuery = `
          INSERT INTO DiagnosisDetail (
            diagnosisId, medicineId, dosageUnit, morningDosage, afternoonDosage, 
            eveningDosage, nightDosage, days, quantity, price, usageInstructions, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;
        await client.query(insertDiagnosisDetailQuery, [
          diagnosisId,
          medicineId,
          dosageUnit || null,
          morningDosage || 0,
          afternoonDosage || 0,
          eveningDosage || 0,
          nightDosage || 0,
          days,
          quantity,
          priceout * quantity,
          usageInstructions || null,
          notes || null,
        ]);

        // Update Medicines table
        const updateMedicineQuery = `
          UPDATE Medicines
          SET quantity = quantity - $1
          WHERE medicinesId = $2
        `;
        await client.query(updateMedicineQuery, [quantity, medicineId]);
      }

      // Commit the transaction
      await client.query("COMMIT");

      res.status(200).json({
        message:
          "Diagnosis details updated and medicine quantities deducted successfully",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      client.release();
    }
  },
};

module.exports = diagnosisController;
