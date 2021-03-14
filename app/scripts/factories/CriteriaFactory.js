'use strict';

angular.module('smartAdminApp').factory('CriteriaFactory', function($q, $http, SignInFactory) {
    var factory = {};

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.createCriteria = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/createCriteria',
            headers: {
                'Content-Type': 'application/json',
            },
            data: obj
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.editCriteria = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/editCriteria',
            headers: {
                'Content-Type': 'application/json',
            },
            data: obj
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteCriteria = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteCriteria',
            headers: {
                'Content-Type': 'application/json',
            },
            data: obj
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.removeCriteriaImage = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/removeCriteriaImage',
            headers: {
                'Content-Type': 'application/json',
            },
            data: obj
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});