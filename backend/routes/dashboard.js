const express = require('express');
const router = express.Router();
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const LeaveType = require('../models/LeaveType');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

// GET /api/dashboard/counts — Dashboard counts
router.get('/counts', async (req, res) => {
    try {
        const role = req.session.user.role;
        const userId = req.session.user.id;
        const data = {};

        if (role === 'admin') {
            data.totalEmployees = await User.countDocuments({ status: 'active' });
            data.totalLeaves = await LeaveRequest.countDocuments();
            data.pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });
            data.approvedLeaves = await LeaveRequest.countDocuments({ status: 'Approved' });
            data.rejectedLeaves = await LeaveRequest.countDocuments({ status: 'Rejected' });

            // This month stats
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            data.approvedThisMonth = await LeaveRequest.countDocuments({
                status: 'Approved',
                updatedAt: { $gte: monthStart, $lte: monthEnd }
            });
            data.rejectedThisMonth = await LeaveRequest.countDocuments({
                status: 'Rejected',
                updatedAt: { $gte: monthStart, $lte: monthEnd }
            });
        }

        if (role === 'manager') {
            const teamMembers = await User.find({ managerId: userId, status: 'active' }).select('_id');
            const teamIds = teamMembers.map(m => m._id);

            data.teamSize = teamMembers.length;
            data.pendingApprovals = await LeaveRequest.countDocuments({
                employeeId: { $in: teamIds },
                status: 'Pending'
            });
            data.teamLeavesThisMonth = await LeaveRequest.countDocuments({
                employeeId: { $in: teamIds },
                status: 'Approved',
                startDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
            });
        }

        if (role === 'employee') {
            const year = new Date().getFullYear();
            const yearStart = new Date(year, 0, 1);
            const yearEnd = new Date(year, 11, 31);

            const leaveTypes = await LeaveType.find();
            let totalLimit = 0;
            let totalUsed = 0;

            for (const type of leaveTypes) {
                totalLimit += type.yearlyLimit;
                const used = await LeaveRequest.find({
                    employeeId: userId,
                    leaveType: type.code,
                    status: { $in: ['Approved', 'Pending'] },
                    startDate: { $gte: yearStart, $lte: yearEnd }
                });
                used.forEach(l => {
                    const s = new Date(l.startDate);
                    const e = new Date(l.endDate);
                    totalUsed += Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
                });
            }

            data.totalLeaveBalance = totalLimit;
            data.leavesUsed = totalUsed;
            data.leavesRemaining = totalLimit - totalUsed;
            data.pendingRequests = await LeaveRequest.countDocuments({ employeeId: userId, status: 'Pending' });
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error('Dashboard counts error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
    }
});

// GET /api/dashboard/leaves-by-month — Chart data
router.get('/leaves-by-month', async (req, res) => {
    try {
        const year = new Date().getFullYear();

        const result = await LeaveRequest.aggregate([
            {
                $match: {
                    startDate: {
                        $gte: new Date(year, 0, 1),
                        $lte: new Date(year, 11, 31)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDate' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = months.map((month, idx) => {
            const found = result.find(r => r._id === idx + 1);
            return { month, count: found ? found.count : 0 };
        });

        res.json({ success: true, data: chartData });
    } catch (err) {
        console.error('Chart data error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch chart data' });
    }
});

// GET /api/dashboard/leave-status-distribution — Pie chart data
router.get('/leave-status-distribution', async (req, res) => {
    try {
        const result = await LeaveRequest.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const data = {};
        result.forEach(r => { data[r._id] = r.count; });

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch status distribution' });
    }
});

// GET /api/dashboard/recent-activity — Recent leaves
router.get('/recent-activity', async (req, res) => {
    try {
        const leaves = await LeaveRequest.find()
            .populate('employeeId', 'name email')
            .sort({ updatedAt: -1 })
            .limit(10);

        res.json({ success: true, data: leaves });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch activity' });
    }
});

// GET /api/dashboard/leave-types — public leave types
router.get('/leave-types', async (req, res) => {
    try {
        const types = await LeaveType.find().sort({ code: 1 });
        res.json({ success: true, data: types });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch leave types' });
    }
});

module.exports = router;
