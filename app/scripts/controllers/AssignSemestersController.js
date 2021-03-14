'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AssignSemestersController', function($scope, $state, toastr, $uibModal, SuperUserFactory) {

        $scope.assignSemester = {
            CourseId: null,
            BranchId: null
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];

        $scope.getAllCourses = function() {
            $scope.assignSemester.CourseId = null;
            $scope.assignSemester.BranchId = null;
            $scope.assignSemester.SemesterId = null;
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
            $scope.assignSemester.BranchId = null;
            $scope.assignSemester.SemesterId = null;
            $scope.branches = [];
            $scope.semesters = [];
            SuperUserFactory.getAllBranchesForCourse($scope.assignSemester.CourseId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });

            $scope.getAllSemesters();
        };

        $scope.getAllSemesters = function() {
            SuperUserFactory.getAllSemesters()
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

        $scope.assign = function() {
            var obj = {
                CourseId: $scope.assignSemester.CourseId,
                BranchId: $scope.assignSemester.BranchId,
                SemesterIds: []
            };
            for (var i = 0; i < $scope.semesters.length; i++) {
                if ($scope.semesters[i].isChecked) {
                    obj.SemesterIds.push($scope.semesters[i].Id);
                }
            }
            SuperUserFactory.assignSemestersToBranch(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Assignment Successful');
                    }
                    $scope.assignSemester.BranchId = null;
                    $scope.semesters = [];
                    $scope.getAllSemesters();
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses();

    });