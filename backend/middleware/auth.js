// Check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ success: false, message: 'Please login first' });
}

// Check if user is employee
function isEmployee(req, res, next) {
    if (req.session.user && req.session.user.role === 'employee') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Employee role required.' });
}

// Check if user is manager
function isManager(req, res, next) {
    if (req.session.user && req.session.user.role === 'manager') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Manager role required.' });
}

// Check if user is admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
}

// Check if user is manager or admin
function isManagerOrAdmin(req, res, next) {
    if (req.session.user && (req.session.user.role === 'manager' || req.session.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied.' });
}

module.exports = { isAuthenticated, isEmployee, isManager, isAdmin, isManagerOrAdmin };
