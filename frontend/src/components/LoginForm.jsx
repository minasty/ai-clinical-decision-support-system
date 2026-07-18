import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function LoginForm() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // Update input fields
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    // Submit login
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {

            setError("Email and password are required.");

            return;

        }

        try {

            setLoading(true);

            const response = await loginService(formData);

            // Save user in AuthContext
            login(response.user, response.token);

            // Redirect to dashboard
            navigate("/dashboard");

        } catch (err) {

            setError(err.message || "Login failed.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            <h2>Login</h2>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                    />

                </div>

                <br />

                <div>

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                    />

                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading ? "Logging in..." : "Login"}

                </button>

            </form>

        </div>

    );

}

export default LoginForm;