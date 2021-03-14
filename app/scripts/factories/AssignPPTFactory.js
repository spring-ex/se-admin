'use strict';

angular.module('smartAdminApp').factory('AssignPPTFactory', function($q, $http, SignInFactory) {
    var factory = {};

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.assignPPT = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addPresentationToTopic',
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

    factory.assignDefaultPPT = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addDefaultPresentationToTopic',
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

    factory.getSubjectsByUser = function(userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllByUser/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllTopicsWithPPTForChapter = function(chapterId, userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/topic/getAllByChapterWithPPT/' + chapterId + '/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllTopicsWithDefaultPPTForChapter = function(chapterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getTopicDefaultPresentationByChapter/' + chapterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});