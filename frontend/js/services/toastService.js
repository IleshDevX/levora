// ═══════════════════════════════════════════════════════
// ToastService — Notification management
// ═══════════════════════════════════════════════════════

app.factory('ToastService', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    $rootScope.toastList = [];

    function addToast(type, message) {
        var toast = { type: type, message: message };
        $rootScope.toastList.push(toast);
        $rootScope.$broadcast('toast:added');

        $timeout(function () {
            var idx = $rootScope.toastList.indexOf(toast);
            if (idx > -1) {
                $rootScope.toastList.splice(idx, 1);
            }
        }, 4000);
    }

    return {
        success: function (msg) { addToast('success', msg); },
        error: function (msg) { addToast('error', msg); },
        info: function (msg) { addToast('info', msg); }
    };
}]);
