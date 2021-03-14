'use strict';

angular.module('smartAdminApp').factory('SignInFactory', function($q, $http) {
    var factory = {
        loggedInUser: {},
        isAuthenticated: false
    };

    var website = 'https://spring-equinoxx.herokuapp.com';
    var URL = website;

    factory.login = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/login',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            if (success.data.Data != null) {
                factory.loggedInUser = success.data.Data[0];
                $http.defaults.headers.common['Authorization'] = success.data.Data[0].Token;
                factory.isAuthenticated = true;
            }
            d.resolve(success);
        }, function(error) {
            factory.isAuthenticated = false;
            d.reject(error);
        });
        return d.promise;
    };

    factory.logout = function() {
        factory.isAuthenticated = false;
    };

    factory.getBaseUrl = function() {
        return website;
    };

    return factory;
});