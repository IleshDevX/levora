// ManagerPendingController — Approve/Reject leaves
app.controller('ManagerPendingController', ['$scope', 'LeaveService', 'AuthService', 'ToastService',
    function ($scope, LeaveService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.leaves = [];
        $scope.loading = true;
        $scope.actionTarget = null;
        $scope.actionType = '';
        $scope.comment = '';

        function loadPending() {
            $scope.loading = true;
            LeaveService.getPendingLeaves().then(function (res) {
                $scope.leaves = res.data;
                $scope.loading = false;
            }).catch(function () {
                ToastService.error('Failed to load pending requests');
                $scope.loading = false;
            });
        }

        loadPending();

        $scope.openAction = function (leave, type) {
            $scope.actionTarget = leave;
            $scope.actionType = type;
            $scope.comment = '';
        };

        $scope.cancelAction = function () {
            $scope.actionTarget = null;
            $scope.actionType = '';
            $scope.comment = '';
        };

        $scope.performAction = function () {
            if (!$scope.actionTarget) return;

            if ($scope.actionType === 'reject' && !$scope.comment) {
                ToastService.error('Comment is required when rejecting');
                return;
            }

            var promise;
            if ($scope.actionType === 'approve') {
                promise = LeaveService.approveLeave($scope.actionTarget._id, $scope.comment);
            } else {
                promise = LeaveService.rejectLeave($scope.actionTarget._id, $scope.comment);
            }

            promise.then(function (res) {
                ToastService.success(res.message);
                $scope.cancelAction();
                loadPending();
            }).catch(function (err) {
                ToastService.error((err.data && err.data.message) || 'Action failed');
            });
        };
    }
]);
