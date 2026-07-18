import { useState } from "react";
import api from "../services/api";
import "./PatientForm.css";

function PatientForm({ onAnalysisComplete }) {

    const [formData, setFormData] = useState({
        age: "",
        temperature: "",
        heart_rate: "",
        symptoms: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const symptomOptions = [
        "Fever",
        "Cough",
        "Headache",
        "Fatigue",
        "Chest Pain",
        "Shortness of Breath",
        "Sore Throat",
        "Nausea",
        "Vomiting",
        "Diarrhea"
    ];

    // Handle text/number inputs
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    // Handle symptom checkboxes
    const handleSymptomChange = (e) => {

        const { value, checked } = e.target;

        if (checked) {

            setFormData({
                ...formData,
                symptoms: [...formData.symptoms, value]
            });

        } else {

            setFormData({
                ...formData,
                symptoms: formData.symptoms.filter(
                    symptom => symptom !== value
                )
            });

        }

    };

    // Submit patient information
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (
            !formData.age ||
            !formData.temperature ||
            !formData.heart_rate ||
            formData.symptoms.length === 0
        ) {

            setError("Please complete all patient information.");

            return;

        }

        try {

            setLoading(true);

            const response = await api.post(
                "/analyze-patient",
                formData
            );

            onAnalysisComplete(response.data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.error ||
                "Unable to analyze patient."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <form
            className="patient-form"
            onSubmit={handleSubmit}
        >

            <h2>Patient Information</h2>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            <label>

                Age

                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                />

            </label>

            <label>

                Temperature (°C)

                <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                />

            </label>

            <label>

                Heart Rate (BPM)

                <input
                    type="number"
                    name="heart_rate"
                    value={formData.heart_rate}
                    onChange={handleChange}
                />

            </label>

            <div className="symptoms">

                <h3>Symptoms</h3>

                {symptomOptions.map((symptom) => (

                    <label
                        key={symptom}
                        className="checkbox"
                    >

                        <input
                            type="checkbox"
                            value={symptom}
                            onChange={handleSymptomChange}
                        />

                        {symptom}

                    </label>

                ))}

            </div>

            <button
                type="submit"
                disabled={loading}
            >

                {loading
                    ? "Analyzing..."
                    : "Analyze Patient"}

            </button>

        </form>

    );

}

export default PatientForm;
