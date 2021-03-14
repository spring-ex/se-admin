'use strict';

angular.module('smartAdminApp').factory('LookupFactory', function($q, $http, SignInFactory) {
    var factory = {};

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.getAllCourses = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/course/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBranches = function(courseId, collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/branch/getAllByCourse/' + courseId + '/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSemesters = function(branchId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/semester/getAllByBranch/' + branchId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllClasses = function(branchId, semesterId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/class/getAllBySemester/' + branchId + '/' + semesterId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjects = function(courseId, branchId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemester/' + courseId + '/' + branchId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getSubjectsBySemester = function(courseId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllByCourseAndSem/' + courseId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllNonElectiveSubjects = function(courseId, branchId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllNonElectiveBySemester/' + courseId + '/' + branchId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllElectiveSubjects = function(courseId, branchId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllElectivesBySemester/' + courseId + '/' + branchId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllGenders = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/gender'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});