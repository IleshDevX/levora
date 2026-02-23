const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase(), status: 'active' });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Store user in session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
        };

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// GET /api/auth/me — get current logged in user
router.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ success: true, data: req.session.user });
    }
    return res.status(401).json({ success: false, message: 'Not authenticated' });
});

module.exports = router;
