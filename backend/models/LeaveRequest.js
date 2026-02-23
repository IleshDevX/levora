const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    managerComment: { type: String, default: '' },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

// Indexes for performance
leaveRequestSchema.index({ employeeId: 1 });
leaveRequestSchema.index({ managerId: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ startDate: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
