// ═══════════════════════════════════════════════════════
// LEVORA — AngularJS Application Module
// ═══════════════════════════════════════════════════════

var app = angular.module('levoraApp', ['ngRoute']);

// ─── Route Configuration ───
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider

        // Login
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })

        // Employee Routes
        .when('/employee/dashboard', {
            templateUrl: 'views/employee/dashboard.html',
            controller: 'EmployeeDashboardController',
            resolve: { auth: resolveAuth('employee') }
        })
        .when('/employee/apply', {
            templateUrl: 'views/employee/apply-leave.html',
            controller: 'ApplyLeaveController',
            resolve: { auth: resolveAuth('employee') }
        })
        .when('/employee/history', {
            templateUrl: 'views/employee/leave-history.html',
            controller: 'LeaveHistoryController',
            resolve: { auth: resolveAuth('employee') }
        })
        .when('/employee/edit/:id', {
            templateUrl: 'views/employee/apply-leave.html',
            controller: 'ApplyLeaveController',
            resolve: { auth: resolveAuth('employee') }
        })

        // Manager Routes
        .when('/manager/dashboard', {
            templateUrl: 'views/manager/dashboard.html',
            controller: 'ManagerDashboardController',
            resolve: { auth: resolveAuth('manager') }
        })
        .when('/manager/pending', {
            templateUrl: 'views/manager/pending.html',
            controller: 'ManagerPendingController',
            resolve: { auth: resolveAuth('manager') }
        })
        .when('/manager/history', {
            templateUrl: 'views/manager/history.html',
            controller: 'ManagerHistoryController',
            resolve: { auth: resolveAuth('manager') }
        })

        // Admin Routes
        .when('/admin/dashboard', {
            templateUrl: 'views/admin/dashboard.html',
            controller: 'AdminDashboardController',
            resolve: { auth: resolveAuth('admin') }
        })
        .when('/admin/employees', {
            templateUrl: 'views/admin/employees.html',
            controller: 'AdminEmployeesController',
            resolve: { auth: resolveAuth('admin') }
        })
        .when('/admin/leave-types', {
            templateUrl: 'views/admin/leave-types.html',
            controller: 'AdminLeaveTypesController',
            resolve: { auth: resolveAuth('admin') }
        })
        .when('/admin/leaves', {
            templateUrl: 'views/admin/leaves.html',
            controller: 'AdminLeavesController',
            resolve: { auth: resolveAuth('admin') }
        })

        // Default
        .otherwise({ redirectTo: '/login' });
}]);

// ─── Route Auth Resolver ───
function resolveAuth(requiredRole) {
    return ['$q', '$location', 'AuthService', function ($q, $location, AuthService) {
        var deferred = $q.defer();
        AuthService.checkAuth().then(function (user) {
            if (user && user.role === requiredRole) {
                deferred.resolve(user);
            } else if (user) {
                $location.path('/' + user.role + '/dashboard');
                deferred.reject();
            } else {
                $location.path('/login');
                deferred.reject();
            }
        }).catch(function () {
            $location.path('/login');
            deferred.reject();
        });
        return deferred.promise;
    }];
}

// ─── Uppercase Filter ───
app.filter('uppercase', function () {
    return function (input) {
        return input ? input.toUpperCase() : '';
    };
});

// ─── Date Format Filter ───
app.filter('formatDate', function () {
    return function (dateStr) {
        if (!dateStr) return '';
        var d = new Date(dateStr);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    };
});

// ─── Days Count Filter ───
app.filter('dayCount', function () {
    return function (start, end) {
        if (!start || !end) return 0;
        var s = new Date(start);
        var e = new Date(end);
        return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    };
});
