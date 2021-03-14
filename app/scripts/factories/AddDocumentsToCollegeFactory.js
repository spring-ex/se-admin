'use strict';

angular.module('smartAdminApp').factory('AddDocumentsToCollegeFactory', function($q, $http, SignInFactory) {
    var factory = {};

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.getAllDocuments = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllDocuments'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getDocumentsForCollege = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getDocumentsForCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addDocumentToCollege = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addDocumentToCollege',
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