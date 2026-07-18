import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

function Register() {

    return (

        <div className="register-page">

            <h1>AI Clinical Decision Support System</h1>

            <p>Create a new account to access the system.</p>

            <RegisterForm />

            <p style={{ marginTop: "20px" }}>
                Already have an account?{" "}
                <Link to="/login">Login here</Link>
            </p>

        </div>

    );

}

export default Register;
