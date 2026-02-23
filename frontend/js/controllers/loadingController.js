// LoadingController
app.controller('LoadingController', ['$scope', function ($scope) {
    $scope.isLoading = false;

    $scope.$on('loading:show', function () {
        $scope.isLoading = true;
    });

    $scope.$on('loading:hide', function () {
        $scope.isLoading = false;
    });
}]);
