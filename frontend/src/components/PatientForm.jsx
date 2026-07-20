import { useState } from "react";
import api from "../services/api";
import "./PatientForm.css";

function PatientForm({ onAnalysisComplete }) {

    const [formData, setFormData] = useState({

        // Patient Demographics
        patient_name: "",
        age: "",
        gender: "",

        // Physical Measurements
        weight: "",
        height: "",

        // Vital Signs
        temperature: "",
        heart_rate: "",
        blood_pressure: "",
        oxygen_saturation: "",

        // Pregnancy
        pregnancy_status: "Not Applicable",

        // Symptoms
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

    // Handle text fields

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

    // Submit form

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (

            !formData.patient_name ||
            !formData.age ||
            !formData.gender ||
            !formData.weight ||
            !formData.height ||
            !formData.temperature ||
            !formData.heart_rate ||
            !formData.blood_pressure ||
            !formData.oxygen_saturation ||
            formData.symptoms.length === 0

        ) {

            setError(
                "Please complete all required patient information."
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

            {/* ============================
                Patient Demographics
            ============================ */}

            <section className="form-section">

                <h3>Patient Demographics</h3>

                <div className="form-grid">

                    <label>

                        Patient Name

                        <input
                            type="text"
                            name="patient_name"
                            value={formData.patient_name}
                            onChange={handleChange}
                            placeholder="Enter patient's full name"
                        />

                    </label>

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

                        Gender

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                        </select>

                    </label>

                </div>

            </section>

            {/* ============================
                Physical Measurements
            ============================ */}

            <section className="form-section">

                <h3>Physical Measurements</h3>

                <div className="form-grid">

                    <label>

                        Weight (kg)

                        <input
                            type="number"
                            step="0.1"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        Height (cm)

                        <input
                            type="number"
                            step="0.1"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                        />

                    </label>

                </div>

            </section>

            {/* Continue with Vital Signs in Part 2 */}
                {/* ============================
                Vital Signs
            ============================ */}

            <section className="form-section">

                <h3>Vital Signs</h3>

                <div className="form-grid">

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

                    <label>

                        Blood Pressure (mmHg)

                        <input
                            type="text"
                            name="blood_pressure"
                            value={formData.blood_pressure}
                            onChange={handleChange}
                            placeholder="120/80"
                        />

                    </label>

                    <label>

                        Oxygen Saturation (SpO₂ %)

                        <input
                            type="number"
                            name="oxygen_saturation"
                            value={formData.oxygen_saturation}
                            onChange={handleChange}
                            placeholder="98"
                            min="0"
                            max="100"
                        />

                    </label>

                </div>

            </section>


            {/* ============================
                Pregnancy Status
            ============================ */}

            {
                formData.gender === "Female" && (

                    <section className="form-section">

                        <h3>Pregnancy Information</h3>

                        <div className="form-grid">

                            <label>

                                Pregnancy Status

                                <select
                                    name="pregnancy_status"
                                    value={formData.pregnancy_status}
                                    onChange={handleChange}
                                >

                                    <option value="Not Applicable">
                                        Not Applicable
                                    </option>

                                    <option value="Pregnant">
                                        Pregnant
                                    </option>

                                    <option value="Not Pregnant">
                                        Not Pregnant
                                    </option>

                                    <option value="Unknown">
                                        Unknown
                                    </option>

                                </select>

                            </label>

                        </div>

                    </section>

                )
            }


            {/* ============================
                Symptoms
            ============================ */}

            <section className="form-section">

                <h3>Select Patient Symptoms</h3>

                <div className="categories-grid">

                    {

                        Object.entries(symptomCategories).map(

                            ([category, symptoms]) => (

                                <div
                                    key={category}
                                    className="symptom-category"
                                >

                                    <h4>

                                        {category}

                                    </h4>

                                    <div className="symptom-list">

                                        {

                                            symptoms.map(

                                                (symptom) => (

                                                    <label
                                                        key={symptom}
                                                        className="checkbox"
                                                    >

                                                        <input
                                                            type="checkbox"
                                                            value={symptom}
                                                            checked={
                                                                formData.symptoms.includes(symptom)
                                                            }
                                                            onChange={
                                                                handleSymptomChange
                                                            }
                                                        />

                                                        {symptom}

                                                    </label>

                                                )

                                            )

                                        }

                                    </div>

                                </div>

                            )

                        )

                    }

                </div>

            </section>


            {/* ============================
                Submit Button
            ============================ */}

            <button
                className="submit-button"
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
