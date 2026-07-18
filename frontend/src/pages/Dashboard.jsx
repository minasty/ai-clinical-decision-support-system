import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    return (

        <div className="dashboard-container">

            <h1>AI Clinical Decision Support System</h1>

            <hr />

            <h2>
                Welcome, {user?.full_name}
            </h2>

            <p>
                <strong>Email:</strong> {user?.email}
            </p>

            <p>
                <strong>Role:</strong> {user?.role}
            </p>

            <hr />

            <h3>Quick Actions</h3>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "20px"
                }}
            >

                <Link to="/analyze">
                    <button>
                        Analyze Patient
                    </button>
                </Link>

                <Link to="/history">
                    <button>
                        Patient History
                    </button>
                </Link>

            </div>

            <hr />

            <h3>System Information</h3>

            <p>✔ Logged in successfully</p>

            <p>✔ AI Clinical Decision Support System is ready.</p>

            <p>
                ✔ Current User: {user?.role}
            </p>

            <br />

            <button
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>

    );

}

export default Dashboard;
