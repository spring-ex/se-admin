'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('TopicQPController', function($scope, $state, toastr, SuperUserFactory, LookupFactory, $uibModal) {

        $scope.selected = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            ChapterId: null
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.topics = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
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
            $scope.selected.BranchId = null;
            $scope.selected.SemesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllBranchesForCourse($scope.selected.CourseId)
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
            $scope.selected.SemesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.selected.BranchId, $scope.selected.CourseId)
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
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            LookupFactory.getAllSubjects($scope.selected.CourseId, $scope.selected.BranchId, $scope.selected.SemesterId)
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

        $scope.subjectSelected = function() {
            $scope.selected.ChapterId = null;
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllChaptersForSubject($scope.selected.SubjectId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.chapterSelected = function() {
            $scope.topics = [];
            SuperUserFactory.getAllTopicsForChapter($scope.selected.ChapterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.topics = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.assignQPs = function() {
            console.log($scope.topics);
            SuperUserFactory.assignQPToTopics($scope.topics)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Question papers assigned successfully');
                        $scope.selected.ChapterId = null;
                        $scope.topics = [];
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllCourses();
    });