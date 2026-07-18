import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerService } from "../services/authService";

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

            // Redirect to login after 2 seconds
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

        <div className="register-container">

            <h2>Create Account</h2>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {success && (
                <p style={{ color: "green" }}>
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                    />

                </div>

                <br />

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

                <div>

                    <label>Role</label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Administrator">Administrator</option>
                    </select>

                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>

            </form>

        </div>

    );

}

export default RegisterForm;
