// LoginController
app.controller('LoginController', ['$scope', '$location', '$rootScope', 'AuthService', 'ToastService',
    function ($scope, $location, $rootScope, AuthService, ToastService) {
        $scope.credentials = { email: '', password: '' };
        $scope.loginError = '';
        $scope.isSubmitting = false;

        // If already logged in, redirect
        AuthService.checkAuth().then(function (user) {
            if (user) {
                $location.path('/' + user.role + '/dashboard');
            }
        });

        $scope.login = function () {
            $scope.loginError = '';

            if (!$scope.credentials.email || !$scope.credentials.password) {
                $scope.loginError = 'Please enter email and password';
                return;
            }

            $scope.isSubmitting = true;

            AuthService.login($scope.credentials.email, $scope.credentials.password)
                .then(function (res) {
                    $scope.isSubmitting = false;
                    $rootScope.$broadcast('auth:login');
                    ToastService.success('Welcome back, ' + res.data.name + '!');
                    $location.path('/' + res.data.role + '/dashboard');
                })
                .catch(function (err) {
                    $scope.isSubmitting = false;
                    $scope.loginError = (err.data && err.data.message) || 'Login failed. Please try again.';
                });
        };
    }
]);
