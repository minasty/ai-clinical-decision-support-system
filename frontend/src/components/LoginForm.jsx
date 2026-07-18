import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "./LoginForm.css";

function LoginForm() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


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

            login(response.user, response.token);

            navigate("/dashboard");


        } catch (err) {

            setError(err.message || "Login failed.");

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-card">

                <h2>Welcome Back</h2>

                <p className="login-subtitle">
                    Login to your account
                </p>


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>


                    <div className="form-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />

                    </div>


                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />

                    </div>



                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >

                        {loading ? "Logging in..." : "Login"}

                    </button>


                </form>

            </div>

        </div>

    );

}

export default LoginForm;
