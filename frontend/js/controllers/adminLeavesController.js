// AdminLeavesController — View all leaves
app.controller('AdminLeavesController', ['$scope', 'AdminService', 'DashboardService', 'AuthService', 'ToastService',
    function ($scope, AdminService, DashboardService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.leaves = [];
        $scope.leaveTypes = [];
        $scope.loading = true;
        $scope.sortBy = '';
        $scope.filterStatus = '';
        $scope.filterLeaveType = '';
        $scope.searchQuery = '';

        // Load leave types for filter dropdown
        DashboardService.getLeaveTypes().then(function (res) {
            $scope.leaveTypes = res.data;
        });

        function loadLeaves() {
            $scope.loading = true;
            var params = {};
            if ($scope.sortBy) params.sort = $scope.sortBy;
            if ($scope.filterStatus) params.status = $scope.filterStatus;
            if ($scope.filterLeaveType) params.leaveType = $scope.filterLeaveType;
            if ($scope.searchQuery) params.search = $scope.searchQuery;

            AdminService.getAllLeaves(params).then(function (res) {
                $scope.leaves = res.data;
                $scope.loading = false;
            }).catch(function () {
                ToastService.error('Failed to load leaves');
                $scope.loading = false;
            });
        }

        loadLeaves();

        $scope.applyFilters = function () {
            loadLeaves();
        };

        $scope.clearFilters = function () {
            $scope.sortBy = '';
            $scope.filterStatus = '';
            $scope.filterLeaveType = '';
            $scope.searchQuery = '';
            loadLeaves();
        };

        $scope.exportCSV = function () {
            if (!$scope.leaves || $scope.leaves.length === 0) {
                ToastService.error('No data to export');
                return;
            }
            var headers = ['Employee', 'Email', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Manager Comment'];
            var rows = $scope.leaves.map(function (l) {
                return [
                    l.employeeId ? l.employeeId.name : '',
                    l.employeeId ? l.employeeId.email : '',
                    l.employeeId ? (l.employeeId.department || '') : '',
                    l.leaveType,
                    l.startDate ? new Date(l.startDate).toLocaleDateString() : '',
                    l.endDate ? new Date(l.endDate).toLocaleDateString() : '',
                    '"' + (l.reason || '').replace(/"/g, '""') + '"',
                    l.status,
                    '"' + (l.managerComment || '').replace(/"/g, '""') + '"'
                ].join(',');
            });
            var csv = headers.join(',') + '\\n' + rows.join('\\n');
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'levora_leaves_' + new Date().toISOString().slice(0, 10) + '.csv';
            link.click();
            ToastService.success('Exported ' + $scope.leaves.length + ' records');
        };
    }
]);
