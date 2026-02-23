// LeaveHistoryController — Employee leave history
app.controller('LeaveHistoryController', ['$scope', '$location', 'LeaveService', 'AuthService', 'ToastService',
    function ($scope, $location, LeaveService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.leaves = [];
        $scope.loading = true;
        $scope.deleteTarget = null;

        function loadLeaves() {
            $scope.loading = true;
            LeaveService.getMyLeaves().then(function (res) {
                $scope.leaves = res.data;
                $scope.loading = false;
            }).catch(function () {
                ToastService.error('Failed to load leave history');
                $scope.loading = false;
            });
        }

        loadLeaves();

        $scope.editLeave = function (leave) {
            if (leave.status === 'Pending') {
                $location.path('/employee/edit/' + leave._id);
            }
        };

        $scope.confirmDelete = function (leave) {
            $scope.deleteTarget = leave;
        };

        $scope.deleteLeave = function () {
            if (!$scope.deleteTarget) return;
            LeaveService.deleteLeave($scope.deleteTarget._id).then(function (res) {
                ToastService.success(res.message);
                $scope.deleteTarget = null;
                loadLeaves();
            }).catch(function (err) {
                ToastService.error((err.data && err.data.message) || 'Failed to delete');
                $scope.deleteTarget = null;
            });
        };

        $scope.cancelDelete = function () {
            $scope.deleteTarget = null;
        };
    }
]);
