const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authenticate = require("./middleware/authenticate");
const pool = require('./db');
const { analyzePatient } = require('./aiService');
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Test route
app.get('/', (req, res) => {
  res.send('AI Clinical API Running (PostgreSQL)');
});

// 🔹 Analyze patient
app.post("/analyze-patient", authenticate, async (req, res) => {

    try {

        const data = req.body;

        // Get AI analysis
        const result = await analyzePatient(data);

        // Save patient and AI analysis
        await pool.query(

            `INSERT INTO patients
            (
                patient_name,
                age,
                gender,
                weight,
                height,
                temperature,
                heart_rate,
                blood_pressure,
                oxygen_saturation,
                pregnancy_status,
                symptoms,
                diagnosis,
                risk_level,
                recommendation,
                summary
            )

            VALUES
            (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15
            )`,

            [
                data.patient_name,
                data.age,
                data.gender,
                data.weight,
                data.height,
                data.temperature,
                data.heart_rate,
                data.blood_pressure,
                data.oxygen_saturation,
                data.pregnancy_status,
                JSON.stringify(data.symptoms),
                result.diagnosis,
                result.risk,
                result.recommendation,
                result.summary
            ]

        );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Server error"
        });

    }

});



// 🔹 Get patient history
app.get('/patients', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM patients ORDER BY id DESC LIMIT 2"
    );

   const formatted = result.rows.map(row => ({

    id: row.id,

    patient_name: row.patient_name,

    age: row.age,

    gender: row.gender,

    weight: row.weight,

    height: row.height,

    temperature: row.temperature,

    heart_rate: row.heart_rate,

    blood_pressure: row.blood_pressure,

    oxygen_saturation: row.oxygen_saturation,

    pregnancy_status: row.pregnancy_status,

    symptoms: JSON.parse(row.symptoms),

    diagnosis: row.diagnosis,

    risk_level: row.risk_level,

    recommendation: row.recommendation,

    summary: row.summary

}));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 Test database
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");

    res.json({
      message: "DB Connected ✅",
      rows: result.rows
    });

  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// verify connected database
app.get("/db-info", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT current_database(), current_schema(), current_user;
    `);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// verify tables
app.get("/tables", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
