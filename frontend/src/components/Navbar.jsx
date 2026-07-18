import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    return (

        <nav className="navbar">

            <div className="navbar-logo">

                <h2>AI Clinical Decision Support System</h2>

            </div>

            <div className="navbar-links">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/analyze">
                    Analyze Patient
                </Link>

                <Link to="/history">
                    Patient History
                </Link>

            </div>

            <div className="navbar-user">

                <span className="user-name">
                    Welcome, {user?.full_name} ({user?.role})
                </span>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );

}

export default Navbar;
