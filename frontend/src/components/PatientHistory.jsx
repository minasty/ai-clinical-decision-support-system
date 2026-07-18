import { useEffect, useState } from "react";
import api from "../services/api";
import "./PatientHistory.css";

function PatientHistory() {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        fetchPatients();

    }, []);

    const fetchPatients = async () => {

        try {

            setLoading(true);

            const response = await api.get("/patients");

            setPatients(response.data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.error ||
                "Unable to load patient history."
            );

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <p>Loading patient history...</p>;

    }

    if (error) {

        return <p className="history-error">{error}</p>;

    }

    return (

        <div className="history-container">

            <h2>Patient Analysis History</h2>

            {patients.length === 0 ? (

                <p>No patient history found.</p>

            ) : (

                <table className="history-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Age</th>

                            <th>Symptoms</th>

                            <th>Temperature</th>

                            <th>Heart Rate</th>

                            <th>Diagnosis</th>

                            <th>Risk</th>

                            <th>Recommendation</th>

                        </tr>

                    </thead>

                    <tbody>

                        {patients.map((patient) => (

                            <tr key={patient.id}>

                                <td>{patient.id}</td>

                                <td>{patient.age}</td>

                                <td>
                                    {Array.isArray(patient.symptoms)
                                        ? patient.symptoms.join(", ")
                                        : patient.symptoms}
                                </td>

                                <td>{patient.temperature} °C</td>

                                <td>{patient.heart_rate} BPM</td>

                                <td>{patient.diagnosis}</td>

                                <td>{patient.risk_level}</td>

                                <td>{patient.recommendation}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>

    );

}

export default PatientHistory;
