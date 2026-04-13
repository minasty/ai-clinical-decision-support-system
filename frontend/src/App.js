import React, { useState } from "react";
import axios from "axios";

function App() {
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/analyze-patient", {
        age: Number(age),
        symptoms: symptoms.split(",").map(s => s.trim()),
        temperature: Number(temperature),
        heart_rate: Number(heartRate)
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/patients");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load history.");
    }
  };

  const handleClear = () => {
    setAge("");
    setSymptoms("");
    setTemperature("");
    setHeartRate("");
    setResult(null);
    setHistory([]);
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={{ textAlign: "center" }}>AI Clinical Decision Support</h2>

        {/* Inputs */}
        <input
          style={styles.input}
          placeholder="Age"
          value={age}
          onChange={e => setAge(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Symptoms (comma separated)"
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Temperature"
          value={temperature}
          onChange={e => setTemperature(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Heart Rate"
          value={heartRate}
          onChange={e => setHeartRate(e.target.value)}
        />

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          <button onClick={loadHistory}>History</button>

          <button onClick={handleClear} style={styles.clearBtn}>
            Clear
          </button>
        </div>

        {/* Error */}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {/* Result */}
        {result && (
          <div style={styles.card}>
            <h3>Clinical Assessment</h3>

            <p><b>Diagnosis:</b><br />{result.diagnosis}</p>

            <p>
              <b>Risk Level:</b>{" "}
              <span
                style={{
                  color:
                    result.risk === "High"
                      ? "red"
                      : result.risk === "Medium"
                      ? "orange"
                      : "green",
                  fontWeight: "bold"
                }}
              >
                {result.risk}
              </span>
            </p>

            <p><b>Recommendation:</b><br />{result.recommendation}</p>
            <p><b>Summary:</b><br />{result.summary}</p>
          </div>
        )}

        {/* History */}
        <h3 style={{ textAlign: "center" }}>Patient History</h3>

        {history.length === 0 && (
          <p style={{ textAlign: "center" }}>No history loaded</p>
        )}

        {history.map((p, index) => (
          <div key={index} style={styles.historyCard}>
            <p><b>Age:</b> {p.age}</p>
            <p><b>Symptoms:</b> {p.symptoms.join(", ")}</p>
            <p><b>Diagnosis:</b> {p.diagnosis}</p>
            <p><b>Risk:</b> {p.risk_level}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#020a182a"
  },
  container: {
    width: "400px",
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    border: "1px solid #ccc"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10
  },
  clearBtn: {
    backgroundColor: "red",
    color: "white"
  },
  card: {
    marginTop: 15,
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa"
  },
  historyCard: {
    border: "1px solid #ddd",
    padding: 10,
    marginTop: 8,
    borderRadius: 6
  }
};

export default App;