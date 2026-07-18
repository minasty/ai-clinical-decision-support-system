import api from "./api";

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Promise}
 */
export const register = async (userData) => {
    try {
        const response = await api.post("/api/auth/register", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Registration failed."
        };
    }
};

/**
 * Login user
 * @param {Object} credentials
 * @returns {Promise}
 */
export const login = async (credentials) => {
    try {
        const response = await api.post("/api/auth/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Login failed."
        };
    }
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};