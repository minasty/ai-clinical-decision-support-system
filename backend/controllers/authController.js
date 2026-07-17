const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// Register user
exports.register = async (req, res) => {

    try {

        const { full_name, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const result = await pool.query(
            `INSERT INTO users
            (full_name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, full_name, email, role`,
            [
                full_name,
                email,
                hashedPassword,
                role || "Doctor"
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// Login user
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare passwords
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};