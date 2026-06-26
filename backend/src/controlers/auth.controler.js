const userModel = require('../models/user.model');
const registrationModel = require('../models/registration.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper to validate email format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Cookie configuration helper
const getCookieOptions = () => {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
};

const registerUser = async (req, res) => {
    try {
        const name = req.body.name ? req.body.name.trim() : "";
        const email = req.body.email ? req.body.email.toLowerCase().trim() : "";
        const password = req.body.password;
        const role = req.body.role;

        // Validation checks
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields (name, email, password) are required" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        if (role && !['student', 'coordinator'].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Allowed values: student, coordinator" });
        }

        // Check if user already exists (optimized query using projection and lean)
        const doUserExist = await userModel.findOne({ email }).select('_id').lean();
        if (doUserExist) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        });

        // Generate token with expiration
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
        res.cookie("EVNT_token", token, getCookieOptions());
        
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, token }
        });

    } catch (err) {
        console.error("Error in registerUser:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const email = req.body.email ? req.body.email.toLowerCase().trim() : "";
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Optimize query by using lean to retrieve a plain javascript object
        const user = await userModel.findOne({ email }).lean();
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate token with expiration
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
        
        res.cookie("EVNT_token", token, getCookieOptions());
        return res.status(200).json({
            message: "User logged in successfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role, token }
        });

    } catch (err) {
        console.error("Error in loginUser:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const logoutUser = (req, res) => {
    const clearCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };
    res.clearCookie("EVNT_token", clearCookieOptions);
    return res.status(200).json({ message: "User logged out successfully" });
};

const updateProfile = async (req, res) => {
    try {
        const name = req.body.name ? req.body.name.trim() : "";
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.name = name;
        await user.save();

        const token = req.cookies.EVNT_token || 
            (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                ? req.headers.authorization.split(' ')[1] 
                : null);

        return res.status(200).json({
            message: "Profile updated successfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role, token }
        });
    } catch (err) {
        console.error("Error in updateProfile:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteAccount = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.user._id);
        // Cascade delete registrations for this student
        await registrationModel.deleteMany({ student: req.user._id });

        const clearCookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        };
        res.clearCookie("EVNT_token", clearCookieOptions);
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Error in deleteAccount:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { registerUser, loginUser, logoutUser, updateProfile, deleteAccount };