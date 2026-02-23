// ApplyLeaveController — Apply or Edit leave
app.controller('ApplyLeaveController', ['$scope', '$location', '$routeParams', 'LeaveService', 'DashboardService', 'AuthService', 'ToastService',
    function ($scope, $location, $routeParams, LeaveService, DashboardService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.isEdit = !!$routeParams.id;
        $scope.leaveTypes = [];
        $scope.formError = '';
        $scope.isSubmitting = false;

        $scope.leave = {
            leaveType: '',
            startDate: '',
            endDate: '',
            reason: ''
        };

        // Load leave types
        DashboardService.getLeaveTypes().then(function (res) {
            $scope.leaveTypes = res.data;
        });

        // If editing, load existing data
        if ($scope.isEdit) {
            LeaveService.getMyLeaves().then(function (res) {
                var found = res.data.find(function (l) { return l._id === $routeParams.id; });
                if (found && found.status === 'Pending') {
                    $scope.leave = {
                        leaveType: found.leaveType,
                        startDate: new Date(found.startDate),
                        endDate: new Date(found.endDate),
                        reason: found.reason
                    };
                } else {
                    ToastService.error('Leave request not found or cannot be edited');
                    $location.path('/employee/history');
                }
            });
        }

        $scope.submitLeave = function () {
            $scope.formError = '';

            if (!$scope.leave.leaveType || !$scope.leave.startDate || !$scope.leave.endDate || !$scope.leave.reason) {
                $scope.formError = 'All fields are required';
                return;
            }

            var start = new Date($scope.leave.startDate);
            var end = new Date($scope.leave.endDate);

            if (start > end) {
                $scope.formError = 'Start date must be before or equal to end date';
                return;
            }

            $scope.isSubmitting = true;

            var data = {
                leaveType: $scope.leave.leaveType,
                startDate: $scope.leave.startDate,
                endDate: $scope.leave.endDate,
                reason: $scope.leave.reason
            };

            var promise;
            if ($scope.isEdit) {
                promise = LeaveService.updateLeave($routeParams.id, data);
            } else {
                promise = LeaveService.applyLeave(data);
            }

            promise.then(function (res) {
                $scope.isSubmitting = false;
                ToastService.success(res.message);
                $location.path('/employee/history');
            }).catch(function (err) {
                $scope.isSubmitting = false;
                $scope.formError = (err.data && err.data.message) || 'Failed to submit leave request';
                ToastService.error($scope.formError);
            });
        };

        $scope.cancel = function () {
            $location.path('/employee/history');
        };
    }
]);
