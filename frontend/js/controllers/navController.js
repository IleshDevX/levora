// NavController — Top navigation bar
app.controller('NavController', ['$scope', '$rootScope', '$location', 'AuthService', 'ToastService',
    function ($scope, $rootScope, $location, AuthService, ToastService) {
        $scope.isLoggedIn = false;
        $scope.user = {};

        function setAuth(user) {
            $scope.isLoggedIn = true;
            $scope.user = user;
            $rootScope.isLoggedIn = true;
            $rootScope.currentUser = user;
        }

        function clearAuth() {
            $scope.isLoggedIn = false;
            $scope.user = {};
            $rootScope.isLoggedIn = false;
            $rootScope.currentUser = null;
        }

        function checkAuth() {
            AuthService.checkAuth().then(function (user) {
                if (user) {
                    setAuth(user);
                } else {
                    clearAuth();
                }
            });
        }

        checkAuth();

        $scope.$on('auth:login', function () {
            checkAuth();
        });

        $scope.$on('auth:logout', function () {
            clearAuth();
        });

        $scope.$on('$routeChangeSuccess', function () {
            checkAuth();
        });

        $scope.logout = function () {
            AuthService.logout().then(function () {
                clearAuth();
                $rootScope.$broadcast('auth:logout');
                ToastService.info('You have been logged out');
                $location.path('/login');
            });
        };

        $scope.navigate = function (path) {
            $location.path(path);
        };

        $scope.isActive = function (path) {
            return $location.path() === path;
        };
    }
]);
