// AdminEmployeesController — User CRUD
app.controller('AdminEmployeesController', ['$scope', 'AdminService', 'AuthService', 'ToastService',
    function ($scope, AdminService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.users = [];
        $scope.managers = [];
        $scope.loading = true;
        $scope.showForm = false;
        $scope.isEditing = false;
        $scope.formError = '';
        $scope.deleteTarget = null;
        $scope.searchQuery = '';

        $scope.formData = {
            name: '', email: '', password: '', role: 'employee', managerId: '', department: '', status: 'active'
        };

        function loadUsers() {
            $scope.loading = true;
            AdminService.getUsers().then(function (res) {
                $scope.users = res.data;
                $scope.loading = false;
            }).catch(function () {
                ToastService.error('Failed to load users');
                $scope.loading = false;
            });
        }

        function loadManagers() {
            AdminService.getManagers().then(function (res) {
                $scope.managers = res.data;
            });
        }

        loadUsers();
        loadManagers();

        $scope.openAddForm = function () {
            $scope.isEditing = false;
            $scope.formData = { name: '', email: '', password: '', role: 'employee', managerId: '', department: '', status: 'active' };
            $scope.formError = '';
            $scope.showForm = true;
        };

        $scope.openEditForm = function (user) {
            $scope.isEditing = true;
            $scope.formData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                password: '',
                role: user.role,
                managerId: user.managerId ? user.managerId._id : '',
                department: user.department || '',
                status: user.status
            };
            $scope.formError = '';
            $scope.showForm = true;
        };

        $scope.closeForm = function () {
            $scope.showForm = false;
            $scope.formError = '';
        };

        $scope.saveUser = function () {
            $scope.formError = '';

            if (!$scope.formData.name || !$scope.formData.email || !$scope.formData.role) {
                $scope.formError = 'Name, email, and role are required';
                return;
            }

            if (!$scope.isEditing && !$scope.formData.password) {
                $scope.formError = 'Password is required for new users';
                return;
            }

            var data = angular.copy($scope.formData);
            if (!data.password) delete data.password;

            var promise;
            if ($scope.isEditing) {
                promise = AdminService.updateUser(data._id, data);
            } else {
                promise = AdminService.createUser(data);
            }

            promise.then(function (res) {
                ToastService.success(res.message);
                $scope.closeForm();
                loadUsers();
                loadManagers();
            }).catch(function (err) {
                $scope.formError = (err.data && err.data.message) || 'Failed to save user';
            });
        };

        $scope.confirmDelete = function (user) {
            $scope.deleteTarget = user;
        };

        $scope.deleteUser = function () {
            if (!$scope.deleteTarget) return;
            AdminService.deleteUser($scope.deleteTarget._id).then(function (res) {
                ToastService.success(res.message);
                $scope.deleteTarget = null;
                loadUsers();
            }).catch(function (err) {
                ToastService.error((err.data && err.data.message) || 'Failed to delete');
                $scope.deleteTarget = null;
            });
        };

        $scope.cancelDelete = function () {
            $scope.deleteTarget = null;
        };

        $scope.filteredUsers = function () {
            if (!$scope.searchQuery) return $scope.users;
            var q = $scope.searchQuery.toLowerCase();
            return $scope.users.filter(function (u) {
                return u.name.toLowerCase().indexOf(q) > -1 ||
                    u.email.toLowerCase().indexOf(q) > -1 ||
                    u.role.toLowerCase().indexOf(q) > -1;
            });
        };
    }
]);
