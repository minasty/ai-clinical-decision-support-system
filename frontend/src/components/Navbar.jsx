import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

                <span>
                    Welcome, {user?.full_name}
                </span>

                <button
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );

}

export default Navbar;
