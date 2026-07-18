import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AnalyzePatient from "./pages/AnalyzePatient";
import History from "./pages/History";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Default Route */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Public Routes */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Routes */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analyze"
                    element={
                        <ProtectedRoute>
                            <AnalyzePatient />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown Route */}

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;