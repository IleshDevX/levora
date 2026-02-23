// ═══════════════════════════════════════════════════════
// DashboardService — Dashboard counts and chart data
// ═══════════════════════════════════════════════════════

app.factory('DashboardService', ['$http', function ($http) {
    return {
        getCounts: function () {
            return $http.get('/api/dashboard/counts').then(function (res) { return res.data; });
        },

        getLeavesByMonth: function () {
            return $http.get('/api/dashboard/leaves-by-month').then(function (res) { return res.data; });
        },

        getStatusDistribution: function () {
            return $http.get('/api/dashboard/leave-status-distribution').then(function (res) { return res.data; });
        },

        getRecentActivity: function () {
            return $http.get('/api/dashboard/recent-activity').then(function (res) { return res.data; });
        },

        getLeaveTypes: function () {
            return $http.get('/api/dashboard/leave-types').then(function (res) { return res.data; });
        }
    };
}]);
