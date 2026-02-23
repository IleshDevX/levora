// ToastController
app.controller('ToastController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.toasts = $rootScope.toastList || [];

    $scope.$on('toast:added', function () {
        $scope.toasts = $rootScope.toastList;
    });

    $scope.removeToast = function (index) {
        $rootScope.toastList.splice(index, 1);
    };
}]);
