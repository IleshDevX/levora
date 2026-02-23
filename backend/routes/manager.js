const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { isAuthenticated, isManager } = require('../middleware/auth');

router.use(isAuthenticated, isManager);

// GET /api/manager/pending-leaves — View pending team leaves
router.get('/pending-leaves', async (req, res) => {
    try {
        const managerId = req.session.user.id;

        // Find team members
        const teamMembers = await User.find({ managerId, status: 'active' }).select('_id');
        const teamIds = teamMembers.map(m => m._id);

        const leaves = await LeaveRequest.find({
            employeeId: { $in: teamIds },
            status: 'Pending'
        })
            .populate('employeeId', 'name email department')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: leaves });
    } catch (err) {
        console.error('Pending leaves error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch pending leaves' });
    }
});

// GET /api/manager/team-history — View team leave history
router.get('/team-history', async (req, res) => {
    try {
        const managerId = req.session.user.id;

        const teamMembers = await User.find({ managerId, status: 'active' }).select('_id');
        const teamIds = teamMembers.map(m => m._id);

        const leaves = await LeaveRequest.find({ employeeId: { $in: teamIds } })
            .populate('employeeId', 'name email department')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: leaves });
    } catch (err) {
        console.error('Team history error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch team history' });
    }
});

// PUT /api/manager/leave/:id/approve — Approve leave
router.put('/leave/:id/approve', async (req, res) => {
    try {
        const { comment } = req.body;
        const managerId = req.session.user.id;

        const leave = await LeaveRequest.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Only pending requests can be approved' });
        }

        // Verify this employee belongs to this manager
        const employee = await User.findOne({ _id: leave.employeeId, managerId });
        if (!employee) {
            return res.status(403).json({ success: false, message: 'This employee is not in your team' });
        }

        leave.status = 'Approved';
        leave.managerComment = comment || '';
        leave.managerId = managerId;
        await leave.save();

        res.json({ success: true, message: 'Leave approved', data: leave });
    } catch (err) {
        console.error('Approve error:', err);
        res.status(500).json({ success: false, message: 'Failed to approve leave' });
    }
});

// PUT /api/manager/leave/:id/reject — Reject leave
router.put('/leave/:id/reject', async (req, res) => {
    try {
        const { comment } = req.body;
        const managerId = req.session.user.id;

        if (!comment) {
            return res.status(400).json({ success: false, message: 'Comment is required when rejecting' });
        }

        const leave = await LeaveRequest.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Only pending requests can be rejected' });
        }

        // Verify team member
        const employee = await User.findOne({ _id: leave.employeeId, managerId });
        if (!employee) {
            return res.status(403).json({ success: false, message: 'This employee is not in your team' });
        }

        leave.status = 'Rejected';
        leave.managerComment = comment;
        leave.managerId = managerId;
        await leave.save();

        res.json({ success: true, message: 'Leave rejected', data: leave });
    } catch (err) {
        console.error('Reject error:', err);
        res.status(500).json({ success: false, message: 'Failed to reject leave' });
    }
});

module.exports = router;
