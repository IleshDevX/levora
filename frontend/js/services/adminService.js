// ═══════════════════════════════════════════════════════
// AdminService — Admin CRUD operations
// ═══════════════════════════════════════════════════════

app.factory('AdminService', ['$http', function ($http) {
    return {
        // User CRUD
        getUsers: function () {
            return $http.get('/api/admin/users').then(function (res) { return res.data; });
        },

        createUser: function (data) {
            return $http.post('/api/admin/user', data).then(function (res) { return res.data; });
        },

        updateUser: function (id, data) {
            return $http.put('/api/admin/user/' + id, data).then(function (res) { return res.data; });
        },

        deleteUser: function (id) {
            return $http.delete('/api/admin/user/' + id).then(function (res) { return res.data; });
        },

        getManagers: function () {
            return $http.get('/api/admin/managers').then(function (res) { return res.data; });
        },

        // Leave Types
        getLeaveTypes: function () {
            return $http.get('/api/admin/leave-types').then(function (res) { return res.data; });
        },

        createLeaveType: function (data) {
            return $http.post('/api/admin/leave-type', data).then(function (res) { return res.data; });
        },

        updateLeaveType: function (id, data) {
            return $http.put('/api/admin/leave-type/' + id, data).then(function (res) { return res.data; });
        },

        deleteLeaveType: function (id) {
            return $http.delete('/api/admin/leave-type/' + id).then(function (res) { return res.data; });
        },

        // Leave Monitoring
        getAllLeaves: function (params) {
            var query = '';
            if (params) {
                var parts = [];
                if (params.sort) parts.push('sort=' + params.sort);
                if (params.status) parts.push('status=' + params.status);
                if (params.leaveType) parts.push('leaveType=' + params.leaveType);
                if (params.search) parts.push('search=' + encodeURIComponent(params.search));
                query = '?' + parts.join('&');
            }
            return $http.get('/api/admin/leaves' + query).then(function (res) { return res.data; });
        }
    };
}]);
