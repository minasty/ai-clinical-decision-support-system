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

    const symptomCategories = {

        "General": [
            "Fever",
            "Chills",
            "Fatigue",
            "Weight Loss",
            "Weight Gain",
            "Night Sweats",
            "Weakness"
        ],

        "Respiratory": [
            "Cough",
            "Dry Cough",
            "Productive Cough",
            "Shortness of Breath",
            "Wheezing",
            "Chest Tightness",
            "Sore Throat",
            "Runny Nose",
            "Nasal Congestion",
            "Sneezing"
        ],

        "Cardiovascular": [
            "Chest Pain",
            "Palpitations",
            "Rapid Heartbeat",
            "Slow Heartbeat",
            "Swollen Legs"
        ],

        "Gastrointestinal": [
            "Abdominal Pain",
            "Nausea",
            "Vomiting",
            "Diarrhea",
            "Constipation",
            "Loss of Appetite",
            "Heartburn",
            "Difficulty Swallowing"
        ],

        "Neurological": [
            "Headache",
            "Dizziness",
            "Confusion",
            "Seizures",
            "Fainting",
            "Memory Loss",
            "Difficulty Speaking",
            "Numbness",
            "Tingling"
        ],

        "Musculoskeletal": [
            "Muscle Pain",
            "Joint Pain",
            "Back Pain",
            "Neck Pain",
            "Joint Swelling"
        ],

        "Skin": [
            "Skin Rash",
            "Itching",
            "Bruising",
            "Pale Skin",
            "Yellow Skin"
        ],

        "Urinary": [
            "Painful Urination",
            "Frequent Urination",
            "Blood in Urine",
            "Dark Urine"
        ],

        "Endocrine": [
            "Excessive Thirst",
            "Frequent Hunger",
            "Excessive Sweating"
        ],

        "Mental Health": [
            "Anxiety",
            "Depression",
            "Insomnia",
            "Mood Changes"
        ]

    };

    // Handle input fields

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    // Handle symptom selection

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

    // Submit form

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (
            !formData.age ||
            !formData.temperature ||
            !formData.heart_rate ||
            formData.symptoms.length === 0
        ) {

            setError(
                "Please complete all patient information."
            );

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

                <div className="error">

                    {error}

                </div>

            )}

            <label>

                Age

                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter patient's age"
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
                    placeholder="36.5"
                />

            </label>

            <label>

                Heart Rate (BPM)

                <input
                    type="number"
                    name="heart_rate"
                    value={formData.heart_rate}
                    onChange={handleChange}
                    placeholder="72"
                />

            </label>

            <div className="symptoms">

                <h3>Select Patient Symptoms</h3>

                {Object.entries(symptomCategories).map(

                    ([category, symptoms]) => (

                        <div
                            key={category}
                            className="symptom-category"
                        >

                            <h4>{category}</h4>

                            <div className="symptom-grid">

                                {symptoms.map((symptom) => (

                                    <label
                                        key={symptom}
                                        className="checkbox"
                                    >

                                        <input
                                            type="checkbox"
                                            value={symptom}
                                            checked={formData.symptoms.includes(symptom)}
                                            onChange={handleSymptomChange}
                                        />

                                        {symptom}

                                    </label>

                                ))}

                            </div>

                        </div>

                    )

                )}

            </div>

            <button
                type="submit"
                disabled={loading}
            >

                {

                    loading

                        ? "Analyzing Patient..."

                        : "Analyze Patient"

                }

            </button>

        </form>

    );

}

export default PatientForm;
