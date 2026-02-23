// ═══════════════════════════════════════════════════════
// LeaveService — Employee leave operations
// ═══════════════════════════════════════════════════════

app.factory('LeaveService', ['$http', function ($http) {
    return {
        applyLeave: function (data) {
            return $http.post('/api/leave/apply', data).then(function (res) { return res.data; });
        },

        getMyLeaves: function () {
            return $http.get('/api/leave/my').then(function (res) { return res.data; });
        },

        getLeaveBalance: function () {
            return $http.get('/api/leave/balance').then(function (res) { return res.data; });
        },

        updateLeave: function (id, data) {
            return $http.put('/api/leave/' + id, data).then(function (res) { return res.data; });
        },

        deleteLeave: function (id) {
            return $http.delete('/api/leave/' + id).then(function (res) { return res.data; });
        },

        // Manager operations
        getPendingLeaves: function () {
            return $http.get('/api/manager/pending-leaves').then(function (res) { return res.data; });
        },

        getTeamHistory: function () {
            return $http.get('/api/manager/team-history').then(function (res) { return res.data; });
        },

        approveLeave: function (id, comment) {
            return $http.put('/api/manager/leave/' + id + '/approve', { comment: comment })
                .then(function (res) { return res.data; });
        },

        rejectLeave: function (id, comment) {
            return $http.put('/api/manager/leave/' + id + '/reject', { comment: comment })
                .then(function (res) { return res.data; });
        }
    };
}]);
