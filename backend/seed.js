const mongoose = require('mongoose');
const User = require('./models/User');
const LeaveType = require('./models/LeaveType');
const LeaveRequest = require('./models/LeaveRequest');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/levora';

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await LeaveType.deleteMany({});
    await LeaveRequest.deleteMany({});
    console.log('Cleared existing data');

    // Create Leave Types
    const leaveTypes = await LeaveType.insertMany([
        { name: 'Casual Leave', code: 'CL', yearlyLimit: 12, description: 'For personal/casual reasons' },
        { name: 'Sick Leave', code: 'SL', yearlyLimit: 10, description: 'For medical/health reasons' },
        { name: 'Privilege Leave', code: 'PL', yearlyLimit: 15, description: 'Planned/earned leave' }
    ]);
    console.log('Leave types created');

    // Create Admin
    const admin = new User({
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@levora.in',
        password: 'Admin@123',
        role: 'admin',
        department: 'Human Resources'
    });
    await admin.save();

    // Create Managers
    const manager1 = new User({
        name: 'Priya Sharma',
        email: 'priya.sharma@levora.in',
        password: 'Manager@123',
        role: 'manager',
        department: 'Engineering'
    });
    await manager1.save();

    const manager2 = new User({
        name: 'Amit Patel',
        email: 'amit.patel@levora.in',
        password: 'Manager@123',
        role: 'manager',
        department: 'Marketing'
    });
    await manager2.save();

    // Create Employees
    const emp1 = new User({
        name: 'Sneha Reddy',
        email: 'sneha.reddy@levora.in',
        password: 'Emp@123',
        role: 'employee',
        managerId: manager1._id,
        department: 'Engineering'
    });
    await emp1.save();

    const emp2 = new User({
        name: 'Vikram Singh',
        email: 'vikram.singh@levora.in',
        password: 'Emp@123',
        role: 'employee',
        managerId: manager1._id,
        department: 'Engineering'
    });
    await emp2.save();

    const emp3 = new User({
        name: 'Ananya Desai',
        email: 'ananya.desai@levora.in',
        password: 'Emp@123',
        role: 'employee',
        managerId: manager2._id,
        department: 'Marketing'
    });
    await emp3.save();

    console.log('Users created');

    // Create Sample Leave Requests
    const sampleLeaves = [
        {
            employeeId: emp1._id,
            leaveType: 'CL',
            startDate: new Date(2026, 0, 15),
            endDate: new Date(2026, 0, 16),
            reason: 'Family function',
            status: 'Approved',
            managerComment: 'Approved. Enjoy!',
            managerId: manager1._id
        },
        {
            employeeId: emp1._id,
            leaveType: 'SL',
            startDate: new Date(2026, 1, 5),
            endDate: new Date(2026, 1, 6),
            reason: 'Not feeling well',
            status: 'Approved',
            managerComment: 'Get well soon',
            managerId: manager1._id
        },
        {
            employeeId: emp2._id,
            leaveType: 'CL',
            startDate: new Date(2026, 1, 20),
            endDate: new Date(2026, 1, 21),
            reason: 'Personal work',
            status: 'Pending'
        },
        {
            employeeId: emp2._id,
            leaveType: 'PL',
            startDate: new Date(2026, 2, 10),
            endDate: new Date(2026, 2, 14),
            reason: 'Vacation trip',
            status: 'Pending'
        },
        {
            employeeId: emp3._id,
            leaveType: 'SL',
            startDate: new Date(2026, 0, 28),
            endDate: new Date(2026, 0, 29),
            reason: 'Doctor appointment',
            status: 'Rejected',
            managerComment: 'Please reschedule, important deadline',
            managerId: manager2._id
        },
        {
            employeeId: emp3._id,
            leaveType: 'CL',
            startDate: new Date(2026, 2, 1),
            endDate: new Date(2026, 2, 2),
            reason: 'Festival celebration',
            status: 'Pending'
        },
        {
            employeeId: emp1._id,
            leaveType: 'PL',
            startDate: new Date(2026, 3, 10),
            endDate: new Date(2026, 3, 15),
            reason: 'Annual vacation',
            status: 'Pending'
        }
    ];

    await LeaveRequest.insertMany(sampleLeaves);
    console.log('Sample leave requests created');

    console.log('\n═══════════════════════════════════════');
    console.log('  LEVORA — Seed Data Created Successfully');
    console.log('═══════════════════════════════════════');
    console.log('\nDemo Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:    rajesh.kumar@levora.in    / Admin@123');
    console.log('Manager:  priya.sharma@levora.in    / Manager@123');
    console.log('Manager:  amit.patel@levora.in      / Manager@123');
    console.log('Employee: sneha.reddy@levora.in     / Emp@123');
    console.log('Employee: vikram.singh@levora.in    / Emp@123');
    console.log('Employee: ananya.desai@levora.in    / Emp@123');
    console.log('─────────────────────────────────────\n');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
