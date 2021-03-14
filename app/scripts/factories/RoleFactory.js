'use strict';

angular.module('smartAdminApp').factory('RoleFactory', function ($q, $http, SignInFactory) {
    var factory = {};

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.getAllRoles = function(collegeId){
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/role'
        }).then(function (success) {
            d.resolve(success);
        }, function (error) {
            d.reject(error);
        });
        return d.promise;
    };    

    return factory;
});