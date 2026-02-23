// ManagerDashboardController
app.controller('ManagerDashboardController', ['$scope', 'DashboardService', 'LeaveService', 'AuthService', 'ToastService',
    function ($scope, DashboardService, LeaveService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.counts = {};
        $scope.pendingLeaves = [];
        $scope.loading = true;

        function loadDashboard() {
            $scope.loading = true;

            DashboardService.getCounts().then(function (res) {
                $scope.counts = res.data;
            });

            LeaveService.getPendingLeaves().then(function (res) {
                $scope.pendingLeaves = res.data.slice(0, 5);
                $scope.loading = false;
            }).catch(function () {
                $scope.loading = false;
            });
        }

        loadDashboard();
    }
]);
