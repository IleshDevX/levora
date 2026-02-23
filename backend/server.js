const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/levora';

// ─── Middleware ───
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
    credentials: true
}));

// Session configuration
app.use(session({
    secret: 'levora-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ─── Routes ───
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const managerRoutes = require('./routes/manager');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/leave', employeeRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Levora API is running', timestamp: new Date() });
});

// Catch-all: serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Connect to MongoDB & Start Server ───
console.log('🔧 Environment Check:');
console.log(`   PORT: ${PORT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   MONGO_URI set: ${process.env.MONGO_URI ? 'YES ✓' : 'NO ✗ (using default)'}`);
if (process.env.MONGO_URI) {
    console.log(`   MONGO_URI preview: ${process.env.MONGO_URI.substring(0, 40)}...`);
}

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('✓ MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`✓ Levora server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('✗ MongoDB connection error:');
        console.error(`  Message: ${err.message}`);
        console.error(`  Code: ${err.code}`);
        if (err.reason) console.error(`  Reason: ${err.reason}`);
        process.exit(1);
    });
