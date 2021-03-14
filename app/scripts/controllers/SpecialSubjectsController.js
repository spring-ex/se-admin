'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('SpecialSubjectsController', function($scope, $state, SuperUserFactory, toastr, LookupFactory, SignInFactory) {
        $scope.newSubject = {
            CollegeId: null,
            CourseId: null,
            SemesterId: null,
            SubjectNames: []
        };
        $scope.colleges = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjectNames = "";

        $scope.getAllColleges = function() {
            $scope.colleges = [];
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.newSubject.College = null;
            $scope.newSubject.CourseId = null;
            $scope.newSubject.BranchId = null;
            $scope.newSubject.SemesterId = null;
            SuperUserFactory.getAllColleges()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.colleges = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.collegeSelected = function() {
            $scope.newSubject.CourseId = null;
            $scope.newSubject.BranchId = null;
            $scope.newSubject.SemesterId = null;
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            SuperUserFactory.getAllCoursesForCollege($scope.newSubject.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function() {
            $scope.newSubject.BranchId = null;
            $scope.newSubject.SemesterId = null;
            $scope.branches = [];
            $scope.semesters = [];
            LookupFactory.getAllBranches($scope.newSubject.CourseId, $scope.newSubject.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.branchSelected = function() {
            $scope.newSubject.SemesterId = null;
            $scope.semesters = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.newSubject.BranchId, $scope.newSubject.CourseId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addSpecialSubject = function() {
            var obj = {
                CollegeId: $scope.newSubject.CollegeId,
                SemesterId: $scope.newSubject.SemesterId,
                CourseId: $scope.newSubject.CourseId,
            };
            obj.SubjectNames = $scope.subjectNames.split("|");
            SuperUserFactory.addSpecialSubject(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Subject addition Successful');
                    }
                    $scope.newSubject.SemesterId = null;
                    $scope.newSubject.SubjectNames = [];
                    $scope.subjectNames = "";
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllColleges();

    });