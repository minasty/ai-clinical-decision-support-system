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
app.post('/analyze-patient',authenticate, async (req, res) => {
  try {
    const data = req.body;

    const result = await analyzePatient(data);

    await pool.query(
      `INSERT INTO patients 
      (age, symptoms, temperature, heart_rate, diagnosis, risk_level, recommendation, summary)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        data.age,
        JSON.stringify(data.symptoms),
        data.temperature,
        data.heart_rate,
        result.diagnosis,
        result.risk,
        result.recommendation,
        result.summary
      ]
    );

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔹 Get patient history
app.get('/patients', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM patients ORDER BY id DESC LIMIT 2"
    );

    const formatted = result.rows.map(row => ({
      ...row,
      symptoms: JSON.parse(row.symptoms)
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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
