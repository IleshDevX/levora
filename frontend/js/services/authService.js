// ═══════════════════════════════════════════════════════
// AuthService — Handles login, logout, session checks
// ═══════════════════════════════════════════════════════

app.factory('AuthService', ['$http', '$q', function ($http, $q) {
    var currentUser = null;

    return {
        login: function (email, password) {
            return $http.post('/api/auth/login', { email: email, password: password })
                .then(function (res) {
                    currentUser = res.data.data;
                    return res.data;
                });
        },

        logout: function () {
            return $http.post('/api/auth/logout').then(function () {
                currentUser = null;
            });
        },

        checkAuth: function () {
            var deferred = $q.defer();
            $http.get('/api/auth/me').then(function (res) {
                currentUser = res.data.data;
                deferred.resolve(currentUser);
            }).catch(function () {
                currentUser = null;
                deferred.resolve(null);
            });
            return deferred.promise;
        },

        getUser: function () {
            return currentUser;
        },

        setUser: function (user) {
            currentUser = user;
        }
    };
}]);
