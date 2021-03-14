'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('SubjectsController', function($scope, toastr, SuperUserFactory) {
        $scope.newSubject = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectNames: []
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjectNames = "";

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            SuperUserFactory.getAllCourses()
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
            SuperUserFactory.getAllBranchesForCourse($scope.newSubject.CourseId)
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

        $scope.addSubject = function() {
            var obj = {
                BranchId: $scope.newSubject.BranchId,
                SemesterId: $scope.newSubject.SemesterId,
                CourseId: $scope.newSubject.CourseId,
            };
            obj.SubjectNames = $scope.subjectNames.split("|");
            SuperUserFactory.addSubject(obj)
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

        $scope.getAllCourses();
    });