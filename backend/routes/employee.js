const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const LeaveType = require('../models/LeaveType');
const { isAuthenticated } = require('../middleware/auth');

// Apply authentication to all employee routes
router.use(isAuthenticated);

// POST /api/leave/apply — Apply for leave
router.post('/apply', async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const employeeId = req.session.user.id;

        // Validation
        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({ success: false, message: 'Start date must be before or equal to end date' });
        }

        // Check leave type exists
        const type = await LeaveType.findOne({ code: leaveType });
        if (!type) {
            return res.status(400).json({ success: false, message: 'Invalid leave type' });
        }

        // Check yearly limit
        const year = start.getFullYear();
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);

        const usedLeaves = await LeaveRequest.find({
            employeeId,
            leaveType,
            status: { $in: ['Pending', 'Approved'] },
            startDate: { $gte: yearStart, $lte: yearEnd }
        });

        let totalDaysUsed = 0;
        usedLeaves.forEach(leave => {
            const s = new Date(leave.startDate);
            const e = new Date(leave.endDate);
            totalDaysUsed += Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
        });

        const requestedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (totalDaysUsed + requestedDays > type.yearlyLimit) {
            return res.status(400).json({
                success: false,
                message: `Leave limit exceeded. You have ${type.yearlyLimit - totalDaysUsed} ${leaveType} days remaining.`
            });
        }

        const leave = new LeaveRequest({
            employeeId,
            leaveType,
            startDate: start,
            endDate: end,
            reason
        });

        await leave.save();

        res.status(201).json({ success: true, message: 'Leave applied successfully', data: leave });
    } catch (err) {
        console.error('Apply leave error:', err);
        res.status(500).json({ success: false, message: 'Failed to apply leave' });
    }
});

// GET /api/leave/my — View own leave history
router.get('/my', async (req, res) => {
    try {
        const leaves = await LeaveRequest.find({ employeeId: req.session.user.id })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: leaves });
    } catch (err) {
        console.error('Fetch leaves error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch leave history' });
    }
});

// GET /api/leave/balance — View leave balance
router.get('/balance', async (req, res) => {
    try {
        const employeeId = req.session.user.id;
        const year = new Date().getFullYear();
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);

        const leaveTypes = await LeaveType.find();
        const balances = [];

        for (const type of leaveTypes) {
            const usedLeaves = await LeaveRequest.find({
                employeeId,
                leaveType: type.code,
                status: { $in: ['Approved', 'Pending'] },
                startDate: { $gte: yearStart, $lte: yearEnd }
            });

            let totalDaysUsed = 0;
            usedLeaves.forEach(leave => {
                const s = new Date(leave.startDate);
                const e = new Date(leave.endDate);
                totalDaysUsed += Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
            });

            balances.push({
                code: type.code,
                name: type.name,
                yearlyLimit: type.yearlyLimit,
                used: totalDaysUsed,
                remaining: type.yearlyLimit - totalDaysUsed
            });
        }

        res.json({ success: true, data: balances });
    } catch (err) {
        console.error('Balance error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch leave balance' });
    }
});

// PUT /api/leave/:id — Edit leave (only if Pending)
router.put('/:id', async (req, res) => {
    try {
        const leave = await LeaveRequest.findOne({ _id: req.params.id, employeeId: req.session.user.id });

        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Only pending requests can be edited' });
        }

        const { leaveType, startDate, endDate, reason } = req.body;

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ success: false, message: 'Start date must be before or equal to end date' });
        }

        if (leaveType) leave.leaveType = leaveType;
        if (startDate) leave.startDate = new Date(startDate);
        if (endDate) leave.endDate = new Date(endDate);
        if (reason) leave.reason = reason;

        await leave.save();

        res.json({ success: true, message: 'Leave request updated', data: leave });
    } catch (err) {
        console.error('Edit leave error:', err);
        res.status(500).json({ success: false, message: 'Failed to update leave request' });
    }
});

// DELETE /api/leave/:id — Delete leave (only if Pending)
router.delete('/:id', async (req, res) => {
    try {
        const leave = await LeaveRequest.findOne({ _id: req.params.id, employeeId: req.session.user.id });

        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Only pending requests can be deleted' });
        }

        await LeaveRequest.deleteOne({ _id: req.params.id });

        res.json({ success: true, message: 'Leave request deleted' });
    } catch (err) {
        console.error('Delete leave error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete leave request' });
    }
});

module.exports = router;
