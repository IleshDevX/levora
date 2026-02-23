// EmployeeDashboardController
app.controller('EmployeeDashboardController', ['$scope', 'DashboardService', 'LeaveService', 'AuthService', 'ToastService',
    function ($scope, DashboardService, LeaveService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.counts = {};
        $scope.balances = [];
        $scope.recentLeaves = [];
        $scope.loading = true;

        function loadDashboard() {
            $scope.loading = true;

            DashboardService.getCounts().then(function (res) {
                $scope.counts = res.data;
            }).catch(function () {
                ToastService.error('Failed to load dashboard data');
            });

            LeaveService.getLeaveBalance().then(function (res) {
                $scope.balances = res.data;
            });

            LeaveService.getMyLeaves().then(function (res) {
                $scope.recentLeaves = res.data.slice(0, 5);
                $scope.loading = false;
            }).catch(function () {
                $scope.loading = false;
            });
        }

        loadDashboard();
    }
]);
