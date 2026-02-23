// AdminLeaveTypesController
app.controller('AdminLeaveTypesController', ['$scope', 'AdminService', 'AuthService', 'ToastService',
    function ($scope, AdminService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.leaveTypes = [];
        $scope.loading = true;
        $scope.showForm = false;
        $scope.isEditing = false;
        $scope.formError = '';

        $scope.formData = { name: '', code: '', yearlyLimit: '', description: '' };

        function loadTypes() {
            $scope.loading = true;
            AdminService.getLeaveTypes().then(function (res) {
                $scope.leaveTypes = res.data;
                $scope.loading = false;
            }).catch(function () {
                ToastService.error('Failed to load leave types');
                $scope.loading = false;
            });
        }

        loadTypes();

        $scope.openAddForm = function () {
            $scope.isEditing = false;
            $scope.formData = { name: '', code: '', yearlyLimit: '', description: '' };
            $scope.formError = '';
            $scope.showForm = true;
        };

        $scope.openEditForm = function (type) {
            $scope.isEditing = true;
            $scope.formData = {
                _id: type._id,
                name: type.name,
                code: type.code,
                yearlyLimit: type.yearlyLimit,
                description: type.description || ''
            };
            $scope.formError = '';
            $scope.showForm = true;
        };

        $scope.closeForm = function () {
            $scope.showForm = false;
            $scope.formError = '';
        };

        $scope.saveLeaveType = function () {
            $scope.formError = '';

            if (!$scope.formData.name || !$scope.formData.code || !$scope.formData.yearlyLimit) {
                $scope.formError = 'Name, code, and yearly limit are required';
                return;
            }

            var promise;
            if ($scope.isEditing) {
                promise = AdminService.updateLeaveType($scope.formData._id, $scope.formData);
            } else {
                promise = AdminService.createLeaveType($scope.formData);
            }

            promise.then(function (res) {
                ToastService.success(res.message);
                $scope.closeForm();
                loadTypes();
            }).catch(function (err) {
                $scope.formError = (err.data && err.data.message) || 'Failed to save leave type';
            });
        };

        $scope.deleteLeaveType = function (type) {
            if (!confirm('Delete "' + type.name + '"? This cannot be undone.')) return;

            AdminService.deleteLeaveType(type._id).then(function (res) {
                ToastService.success(res.message);
                loadTypes();
            }).catch(function (err) {
                ToastService.error((err.data && err.data.message) || 'Failed to delete leave type');
            });
        };
    }
]);
