'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('TopicsController', function($scope, $state, toastr, $uibModal, SuperUserFactory, LookupFactory) {

        $scope.assignTopic = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            ChapterId: null,
            TopicIds: []
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.topics = [];

        $scope.newTopic = {
            TopicNames: [],
            TopicVideoURLs: []
        };

        $scope.topicNames = "";
        $scope.topicURLs = "";

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
            $scope.assignTopic.BranchId = null;
            $scope.assignTopic.SemesterId = null;
            $scope.assignTopic.SubjectId = null;
            $scope.assignTopic.ChapterId = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllBranchesForCourse($scope.assignTopic.CourseId)
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
            $scope.assignTopic.SemesterId = null;
            $scope.assignTopic.SubjectId = null;
            $scope.assignTopic.ChapterId = null;
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.assignTopic.BranchId, $scope.assignTopic.CourseId)
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
            $scope.assignTopic.SubjectId = null;
            $scope.assignTopic.ChapterId = null;
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            LookupFactory.getAllSubjects($scope.assignTopic.CourseId, $scope.assignTopic.BranchId, $scope.assignTopic.SemesterId)
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
            $scope.assignTopic.ChapterId = null;
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllChaptersForSubject($scope.assignTopic.SubjectId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
            // SuperUserFactory.getAllTopics()
            //     .then(function(success) {
            //         if (success.data.Code != "S001") {
            //             toastr.error(success.data.Message);
            //         } else {
            //             $scope.topics = success.data.Data;
            //         }
            //     }, function(error) {
            //         toastr.error(error);
            //     });
        };

        $scope.createTopicsAndAssignToChapter = function() {
            if ($scope.topicNames.length == 0) {
                toastr.warning('Enter atleast one topic');
            } else {
                $scope.newTopic.TopicNames = $scope.topicNames.split("|");
                if ($scope.topicURLs.length != 0) {
                    $scope.newTopic.TopicVideoURLs = $scope.topicURLs.split("|");
                    for (var i = 0; i < $scope.newTopic.TopicVideoURLs.length; i++) {
                        if ($scope.newTopic.TopicVideoURLs[i] == "") {
                            $scope.newTopic.TopicVideoURLs[i] = null;
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.newTopic.TopicNames.length; i++) {
                        $scope.newTopic.TopicVideoURLs[i] = null;
                    }
                }
                $scope.assignTopicToChapter = {
                    CourseId: $scope.assignTopic.CourseId,
                    BranchId: $scope.assignTopic.BranchId,
                    SemesterId: $scope.assignTopic.SemesterId,
                    SubjectId: $scope.assignTopic.SubjectId,
                    ChapterId: $scope.assignTopic.ChapterId,
                    Topics: $scope.newTopic
                }
                SuperUserFactory.createTopicsAndAssignToChapter($scope.assignTopicToChapter)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Topics Created and Assigned Successfully');
                            $scope.assignTopic.ChapterId = null;
                            $scope.assignTopic.TopicIds = [];
                            $scope.topics = [];
                            $scope.topicNames = "";
                            $scope.topicURLs = "";
                            $scope.newTopic.TopicNames = [];
                            $scope.newTopic.TopicVideoURLs = [];
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.assign = function() {
            for (var i = 0; i < $scope.topics.length; i++) {
                if ($scope.topics[i].isChecked) {
                    $scope.assignTopic.TopicIds.push($scope.topics[i].Id);
                }
            }
            if ($scope.assignTopic.TopicIds.length == 0) {
                toastr.warning('Please choose atleast one topic');
            } else {
                SuperUserFactory.assignTopics($scope.assignTopic)
                    .then(function(success) {
                            if (success.data.Code != "S001") {
                                toastr.error(success.data.Message);
                            } else {
                                toastr.success('Assignment successfull');
                                $scope.assignTopic.ChapterId = null;
                                $scope.assignTopic.TopicIds = [];
                                $scope.topics = [];
                            }
                        },
                        function(error) {
                            toastr.error(error);
                        });
            }
        };

        $scope.addTopics = function() {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/AddTopics.html',
                controller: 'AddTopicsController'
            });

            modalInstance.result.then(function(response) {
                $scope.getAllCourses();
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.getAllCourses();
    }).controller('AddTopicsController', function($scope, $uibModalInstance, SuperUserFactory, toastr) {

        $scope.newTopic = {
            TopicNames: [],
            TopicVideoURLs: []
        };

        $scope.topicNames = "";
        $scope.topicURLs = "";

        $scope.ok = function() {
            if ($scope.topicNames.length == 0) {
                toastr.warning('Enter atleast one topic');
            } else {
                $scope.newTopic.TopicNames = $scope.topicNames.split("|");
                if ($scope.newTopic.TopicVideoURLs.length != 0) {
                    $scope.newTopic.TopicVideoURLs = $scope.topicURLs.split("|");
                    for (var i = 0; i < $scope.newTopic.TopicVideoURLs.length; i++) {
                        if ($scope.newTopic.TopicVideoURLs[i] == "") {
                            $scope.newTopic.TopicVideoURLs[i] = null;
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.newTopic.TopicNames.length; i++) {
                        $scope.newTopic.TopicVideoURLs[i] = null;
                    }
                }
                SuperUserFactory.addTopics($scope.newTopic)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Topics Created Successfully');
                            $uibModalInstance.close();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });