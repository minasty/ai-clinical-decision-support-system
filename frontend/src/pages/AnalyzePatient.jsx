import { useState } from "react";
import Navbar from "../components/Navbar";
import PatientForm from "../components/PatientForm";

import "./AnalyzePatient.css";

function AnalyzePatient() {

    const [analysisResult, setAnalysisResult] = useState(null);

    return (

        <div className="analyze-page">

            <Navbar />

            <main className="analyze-content">

                <h1>Patient Analysis</h1>

                <p>
                    Enter the patient's clinical information below.
                </p>

                <PatientForm
                    onAnalysisComplete={setAnalysisResult}
                />

                {analysisResult && (

                    <div className="result-card">

                        <h2>AI Analysis Result</h2>

                        <p>
                            <strong>Diagnosis:</strong>{" "}
                            {analysisResult.diagnosis}
                        </p>

                        <p>
                            <strong>Risk Level:</strong>{" "}
                            {analysisResult.risk}
                        </p>

                        <p>
                            <strong>Recommendation:</strong>{" "}
                            {analysisResult.recommendation}
                        </p>

                        <p>
                            <strong>Summary:</strong>{" "}
                            {analysisResult.summary}
                        </p>

                    </div>

                )}

            </main>

        </div>

    );

}

export default AnalyzePatient;
