'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('TreeViewController', function($scope, $state, toastr, $uibModal, SuperUserFactory, LookupFactory, SignInFactory) {

        $scope.colleges = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];

        $scope.selected = {
            college: null,
            course: null,
            branch: null,
            semester: null,
            class: null
        };

        $scope.getAllColleges = function() {
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

        $scope.getAllCourses = function(college) {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.college = null;
            SuperUserFactory.getAllCoursesForCollege(college.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                        $scope.selected.college = college;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllBranches = function(course) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.course = null;
            LookupFactory.getAllBranches(course.Id, $scope.selected.college.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                        $scope.selected.course = course;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllSemesters = function(branch) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.branch = null;
            SuperUserFactory.getAllSemestersForBranch(branch.Id, $scope.selected.college.Id, $scope.selected.course.Id, $scope.selected.college.UniversityId, $scope.selected.college.StateId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.semesters = success.data.Data;
                        $scope.selected.branch = branch;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllClasses = function(semester) {
            $scope.classes = [];
            $scope.selected.semester = null;
            SuperUserFactory.getAllClassesForSemester($scope.selected.branch.Id, semester.Id, $scope.selected.college.Id, $scope.selected.course.Id, $scope.selected.college.UniversityId, $scope.selected.college.StateId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.classes = success.data.Data;
                        $scope.selected.semester = semester;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllColleges();
    });