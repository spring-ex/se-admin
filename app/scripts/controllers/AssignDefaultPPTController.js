'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ApproveRejectStudentsController
 * @description
 * # ApproveRejectStudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AssignDefaultPPTController', function($scope, $state, toastr, AssignPPTFactory, SignInFactory, SuperUserFactory, LookupFactory) {

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
                        $scope.getAllTopicsWithPPTForChapter();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllTopicsWithPPTForChapter = function() {
            $scope.topicPresentationURLs = [];
            AssignPPTFactory.getAllTopicsWithDefaultPPTForChapter($scope.selected.ChapterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.topicPresentationURLs = success.data.Data;
                        for (var i = 0; i < $scope.topics.length; i++) {
                            $scope.topics[i].MediaURL = null;
                            for (var j = 0; j < $scope.topicPresentationURLs.length; j++) {
                                if ($scope.topics[i].Id == $scope.topicPresentationURLs[j].TopicId) {
                                    $scope.topics[i].MediaURL = $scope.topicPresentationURLs[j].MediaURL;
                                }
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.assignPPT = function() {
            var obj = {
                Topics: $scope.topics,
                ChapterId: $scope.selected.ChapterId
            }
            AssignPPTFactory.assignDefaultPPT(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Assignment successful');
                        $scope.selected.ChapterId = null;
                        $scope.topics = [];
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses();

    });