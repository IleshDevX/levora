// ManagerHistoryController — Team leave history
app.controller('ManagerHistoryController', ['$scope', 'LeaveService', 'AuthService', 'ToastService',
    function ($scope, LeaveService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.leaves = [];
        $scope.loading = true;
        $scope.filterStatus = '';

        function loadHistory() {
            $scope.loading = true;
            LeaveService.getTeamHistory().then(function (res) {
                $scope.allLeaves = res.data;
                $scope.leaves = res.data;
                $scope.loading = false;
            }).catch(function () {
                ToastService.error('Failed to load team history');
                $scope.loading = false;
            });
        }

        loadHistory();

        $scope.applyFilter = function () {
            if ($scope.filterStatus) {
                $scope.leaves = $scope.allLeaves.filter(function (l) {
                    return l.status === $scope.filterStatus;
                });
            } else {
                $scope.leaves = $scope.allLeaves;
            }
        };
    }
]);
