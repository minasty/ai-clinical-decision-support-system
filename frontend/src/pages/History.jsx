import Navbar from "../components/Navbar";
import PatientHistory from "../components/PatientHistory";

import "./History.css";

function History() {

    return (

        <div className="history-page">

            <Navbar />

            <main className="history-content">

                <h1>Patient Analysis History</h1>

                <p>
                    Review previous AI-assisted patient analyses.
                </p>

                <PatientHistory />

            </main>

        </div>

    );

}

export default History;
