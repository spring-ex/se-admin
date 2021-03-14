'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('ChaptersController', function($scope, $state, toastr, $uibModal, SuperUserFactory, LookupFactory) {

        $scope.createChapter = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            ChapterNames: []
        };

        $scope.csvNames = "";

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
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
            $scope.createChapter.BranchId = null;
            $scope.createChapter.SemesterId = null;
            $scope.createChapter.SubjectId = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            SuperUserFactory.getAllBranchesForCourse($scope.createChapter.CourseId)
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
            $scope.createChapter.SemesterId = null;
            $scope.createChapter.SubjectId = null;
            $scope.semesters = [];
            $scope.subjects = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.createChapter.BranchId, $scope.createChapter.CourseId)
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

        $scope.semesterSelected = function() {
            $scope.createChapter.SubjectId = null;
            $scope.subjects = [];
            LookupFactory.getAllSubjects($scope.createChapter.CourseId, $scope.createChapter.BranchId, $scope.createChapter.SemesterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.create = function() {
            $scope.createChapter.ChapterNames = $scope.csvNames.split("|");
            SuperUserFactory.createChapters($scope.createChapter)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Chapters created successfully');
                        $scope.createChapter.SubjectId = null;
                        $scope.createChapter.ChapterNames = [];
                        $scope.csvNames = "";
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllCourses();
    });