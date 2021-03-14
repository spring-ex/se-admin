'use strict';

angular.module('smartAdminApp').factory('UsersFactory', function($q, $http, SignInFactory) {
    var factory = {};

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.getAllUsers = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/user/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getUserById = function(userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/user/getById/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addUser = function(newUser) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/user',
            data: newUser,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.resetUserPassword = function(user) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/resetUserPassword',
            data: user,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateUser = function(newUser) {
        delete newUser.CreatedAt;
        delete newUser.UpdatedAt;
        newUser.UserEducation.forEach(function(element) {
            delete element.CreatedAt;
            delete element.UpdatedAt;
        }, this);
        newUser.UserExperience.forEach(function(element) {
            delete element.CreatedAt;
            delete element.UpdatedAt;
        }, this);
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/user',
            data: newUser,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateUserNew = function(newUser) {
        delete newUser.CreatedAt;
        delete newUser.UpdatedAt;
        newUser.UserEducation.forEach(function(element) {
            delete element.CreatedAt;
            delete element.UpdatedAt;
        }, this);
        newUser.UserExperience.forEach(function(element) {
            delete element.CreatedAt;
            delete element.UpdatedAt;
        }, this);
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/user/updateNew',
            data: newUser,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteUser = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/user',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});