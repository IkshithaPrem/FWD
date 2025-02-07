const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Ensure this matches your User model
const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate inputs
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query user from database
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If successful
        console.log('Login successful for user:', username);
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Unexpected error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

