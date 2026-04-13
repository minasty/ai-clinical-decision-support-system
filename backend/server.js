const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const pool = require('./db');
const { analyzePatient } = require('./aiService');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Test route
app.get('/', (req, res) => {
  res.send('AI Clinical API Running (MySQL)');
});


// 🔹 Analyze patient
app.post('/analyze-patient', async (req, res) => {
  try {
    const data = req.body;

    const result = await analyzePatient(data);

    await pool.query(
      `INSERT INTO patients 
      (age, symptoms, temperature, heart_rate, diagnosis, risk_level, recommendation, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
app.get('/patients', async (req, res) => {
  try {
    //const [rows] = await pool.query("SELECT * FROM patients ORDER BY created_at DESC");
    const [rows] = await pool.query("SELECT * FROM patients ORDER BY id DESC LIMIT 2;");
    // convert JSON string back to array
    const formatted = rows.map(row => ({
      ...row,
      symptoms: JSON.parse(row.symptoms)
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: "Error fetching patients" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});