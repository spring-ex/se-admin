'use strict';

angular.module('smartAdminApp').factory('AttendanceFactory', function($q, $http, SignInFactory) {
    var factory = {};

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.getAttendance = function(subjectId, classId, collegeId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAttendanceStatisticsByRange/' + subjectId + '/' + classId + '/' + collegeId + '/1/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getDaysAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getDaysAttendance',
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

    factory.deleteDaysAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteDaysAttendance',
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

    factory.editAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/editAttendanceForStudent',
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
    }

    factory.getAllSubjectsForUser = function(userId) {
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

    factory.getAllClassesForSubject = function(subjectId, userId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/class/getAllBySubject/' + subjectId + '/' + userId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllStudentsInClass = function(collegeId, subjectId, classId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getByClass/' + collegeId + '/' + subjectId + '/' + classId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.takeAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/takeAttendance',
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