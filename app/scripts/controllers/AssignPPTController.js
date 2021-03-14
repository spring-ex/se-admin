'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ApproveRejectStudentsController
 * @description
 * # ApproveRejectStudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AssignPPTController', function($scope, $state, toastr, AssignPPTFactory, SignInFactory, SuperUserFactory) {

        $scope.subjects = [];
        $scope.chapters = [];
        $scope.topics = [];
        $scope.topicPresentationURLs = [];

        $scope.selected = {
            subjectId: null,
            chapterId: null,
            topicId: null
        };

        $scope.getAllSubjects = function() {
            AssignPPTFactory.getSubjectsByUser(SignInFactory.loggedInUser.Id)
                .then(function(success) {
                    $scope.subjects = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllChaptersForSubject = function(subjectId) {
            $scope.chapters = [];
            $scope.topics = [];
            $scope.selected.chapterId = null;
            $scope.selected.topicId = null;
            SuperUserFactory.getAllChaptersForSubject(subjectId)
                .then(function(success) {
                    $scope.chapters = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllTopicsForChapter = function(chapterId) {
            $scope.topics = [];
            SuperUserFactory.getAllTopicsForChapter(chapterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.topics = success.data.Data;
                        $scope.getAllTopicsWithPPTForChapter(chapterId);
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllTopicsWithPPTForChapter = function(chapterId) {
            $scope.topicPresentationURLs = [];
            AssignPPTFactory.getAllTopicsWithPPTForChapter(chapterId, SignInFactory.loggedInUser.Id)
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

        $scope.assignPPT = function(topic) {
            if (topic.MediaURL == null || topic.MediaURL == "") {
                toastr.warning('Enter URL to assign');
            } else {
                var obj = {
                    TopicId: topic.Id,
                    UserId: SignInFactory.loggedInUser.Id,
                    SubjectId: $scope.selected.subjectId,
                    MediaURL: topic.MediaURL
                };
                AssignPPTFactory.assignPPT(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Assignment successful');
                            $scope.getAllTopicsWithPPTForChapter($scope.selected.chapterId);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllSubjects();

    });