const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    yearlyLimit: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('LeaveType', leaveTypeSchema);
