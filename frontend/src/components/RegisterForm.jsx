import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerService } from "../services/authService";
import "./RegisterForm.css";

function RegisterForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "Doctor"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle input changes
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    // Handle form submission
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.full_name ||
            !formData.email ||
            !formData.password
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        try {

            setLoading(true);

            const response = await registerService(formData);

            setSuccess(response.message);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {

            setError(err.message || "Registration failed.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="register-wrapper">

            <div className="register-card">

                <div className="register-header">

                    <h2>Create Account</h2>

                    <p>
                        Register to access the AI Clinical Decision Support System
                    </p>

                </div>

                {error && (

                    <div className="alert error-alert">
                        {error}
                    </div>

                )}

                {success && (

                    <div className="alert success-alert">
                        {success}
                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />

                    </div>

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
                            placeholder="Create a password"
                        />

                    </div>

                    <div className="form-group">

                        <label>Role</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Doctor">Doctor</option>
                            <option value="Nurse">Nurse</option>
                        </select>
                        
                    </div>

                    <button
                        className="register-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

            </div>

        </div>

    );

}

export default RegisterForm;
