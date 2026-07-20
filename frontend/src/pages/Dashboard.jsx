import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Dashboard.css";

function Dashboard() {

    const { user } = useAuth();

    return (

        <div className="dashboard-page">

            {/* Navigation Bar */}
            <Navbar />

            <main className="dashboard-content">

                {/* User Profile */}

                <section className="profile-card">

                    <h2>
                        Welcome, {user?.full_name}
                    </h2>

                    <div className="user-details">

                        <p>
                            <strong>Email:</strong>{" "}
                            {user?.email}
                        </p>

                        <p>
                            <strong>Role:</strong>{" "}
                            {user?.role}
                        </p>

                    </div>

                </section>

                {/* Quick Actions */}

                <section>

                    <h2>
                        Quick Actions
                    </h2>

                    <div className="action-container">

                        <Link
                            to="/analyze"
                            className="action-card"
                        >

                            <h3>
                                🩺 Analyze Patient
                            </h3>

                            <p>
                                Use AI to analyze patient symptoms and provide clinical insights.
                            </p>

                        </Link>

                        <Link
                            to="/history"
                            className="action-card"
                        >

                            <h3>
                                📋 Patient History
                            </h3>

                            <p>
                                View previous patient analysis records.
                            </p>

                        </Link>

                    </div>

                </section>

                {/* System Information */}

                <section className="system-card">

                    <h2>
                        System Information
                    </h2>

                    <p>
                        ✅ Logged in successfully
                    </p>

                    <p>
                        ✅ AI Clinical Decision Support System is ready
                    </p>

                    <p>
                        ✅ Current User Role: {user?.role}
                    </p>

                </section>

            </main>
            <Footer />
        </div>

    );

}

export default Dashboard;
