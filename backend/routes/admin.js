const express = require('express');
const router = express.Router();
const User = require('../models/User');
const LeaveType = require('../models/LeaveType');
const LeaveRequest = require('../models/LeaveRequest');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

// ────── Employee Management ──────

// GET /api/admin/users — View all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('managerId', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (err) {
        console.error('Fetch users error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

// POST /api/admin/user — Add employee
router.post('/user', async (req, res) => {
    try {
        const { name, email, password, role, managerId, department } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Name, email, password, and role are required' });
        }

        // Check duplicate email
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const user = new User({ name, email, password, role, managerId: managerId || null, department: department || '' });
        await user.save();

        const userData = user.toObject();
        delete userData.password;

        res.status(201).json({ success: true, message: 'User created successfully', data: userData });
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ success: false, message: 'Failed to create user' });
    }
});

// PUT /api/admin/user/:id — Edit employee
router.put('/user/:id', async (req, res) => {
    try {
        const { name, email, role, managerId, department, status, password } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check duplicate email if changed
        if (email && email.toLowerCase() !== user.email) {
            const existing = await User.findOne({ email: email.toLowerCase() });
            if (existing) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (department !== undefined) user.department = department;
        if (status) user.status = status;
        if (managerId !== undefined) user.managerId = managerId || null;
        if (password) user.password = password;

        await user.save();

        const userData = user.toObject();
        delete userData.password;

        res.json({ success: true, message: 'User updated successfully', data: userData });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ success: false, message: 'Failed to update user' });
    }
});

// DELETE /api/admin/user/:id — Delete employee
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});

// GET /api/admin/managers — Get all managers (for dropdown)
router.get('/managers', async (req, res) => {
    try {
        const managers = await User.find({ role: 'manager', status: 'active' }).select('name email _id');
        res.json({ success: true, data: managers });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch managers' });
    }
});

// ────── Leave Type Management ──────

// GET /api/admin/leave-types
router.get('/leave-types', async (req, res) => {
    try {
        const types = await LeaveType.find().sort({ code: 1 });
        res.json({ success: true, data: types });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch leave types' });
    }
});

// POST /api/admin/leave-type
router.post('/leave-type', async (req, res) => {
    try {
        const { name, code, yearlyLimit, description } = req.body;

        if (!name || !code || yearlyLimit === undefined) {
            return res.status(400).json({ success: false, message: 'Name, code, and yearly limit are required' });
        }

        const existing = await LeaveType.findOne({ $or: [{ code: code.toUpperCase() }, { name }] });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Leave type already exists' });
        }

        const type = new LeaveType({ name, code: code.toUpperCase(), yearlyLimit, description: description || '' });
        await type.save();

        res.status(201).json({ success: true, message: 'Leave type created', data: type });
    } catch (err) {
        console.error('Create leave type error:', err);
        res.status(500).json({ success: false, message: 'Failed to create leave type' });
    }
});

// PUT /api/admin/leave-type/:id
router.put('/leave-type/:id', async (req, res) => {
    try {
        const { name, yearlyLimit, description } = req.body;

        const type = await LeaveType.findById(req.params.id);
        if (!type) {
            return res.status(404).json({ success: false, message: 'Leave type not found' });
        }

        if (name) type.name = name;
        if (yearlyLimit !== undefined) type.yearlyLimit = yearlyLimit;
        if (description !== undefined) type.description = description;

        await type.save();

        res.json({ success: true, message: 'Leave type updated', data: type });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update leave type' });
    }
});

// DELETE /api/admin/leave-type/:id
router.delete('/leave-type/:id', async (req, res) => {
    try {
        const type = await LeaveType.findById(req.params.id);
        if (!type) {
            return res.status(404).json({ success: false, message: 'Leave type not found' });
        }

        // Check if any leave requests use this type
        const usedCount = await LeaveRequest.countDocuments({ leaveType: type.code });
        if (usedCount > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete — ' + usedCount + ' leave request(s) use this type' });
        }

        await LeaveType.deleteOne({ _id: req.params.id });
        res.json({ success: true, message: 'Leave type deleted successfully' });
    } catch (err) {
        console.error('Delete leave type error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete leave type' });
    }
});

// ────── Leave Monitoring ──────

// GET /api/admin/leaves — View all leave records
router.get('/leaves', async (req, res) => {
    try {
        const { sort, status, leaveType, search } = req.query;
        const query = {};
        if (status) query.status = status;
        if (leaveType) query.leaveType = leaveType;

        let sortObj = { createdAt: -1 };
        if (sort === 'date') sortObj = { startDate: -1 };
        if (sort === 'status') sortObj = { status: 1 };

        let leaves = await LeaveRequest.find(query)
            .populate('employeeId', 'name email department')
            .sort(sortObj);

        // Server-side search filter on populated employee name
        if (search) {
            const searchLower = search.toLowerCase();
            leaves = leaves.filter(l => 
                (l.employeeId && l.employeeId.name && l.employeeId.name.toLowerCase().includes(searchLower)) ||
                (l.employeeId && l.employeeId.email && l.employeeId.email.toLowerCase().includes(searchLower)) ||
                (l.leaveType && l.leaveType.toLowerCase().includes(searchLower)) ||
                (l.reason && l.reason.toLowerCase().includes(searchLower))
            );
        }

        res.json({ success: true, data: leaves });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch leaves' });
    }
});

module.exports = router;
