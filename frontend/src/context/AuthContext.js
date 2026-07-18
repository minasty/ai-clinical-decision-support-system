import { createContext, useContext, useEffect, useState } from "react";

// Create the context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Load saved user when the app starts
    useEffect(() => {

        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

    }, []);

    // Login
    const login = (userData, jwtToken) => {

        setUser(userData);
        setToken(jwtToken);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", jwtToken);

    };

    // Logout
    const logout = () => {

        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

// Custom hook
export function useAuth() {

    return useContext(AuthContext);

}