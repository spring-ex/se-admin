'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('TopicVideosController', function($scope, $state, toastr, SuperUserFactory, LookupFactory, $uibModal) {

        $scope.selected = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            Chapter: null
        };

        $scope.topicIds = [];

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
            $scope.selected.Chapter = null;
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
            $scope.selected.Chapter = null;
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
            $scope.selected.Chapter = null;
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
            $scope.selected.Chapter = null;
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
            SuperUserFactory.getAllTopicsForChapter($scope.selected.Chapter.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.topics = success.data.Data;
                        $scope.topicIds = [];
                        for (var i = 0; i < $scope.topics.length; i++) {
                            $scope.topicIds.push($scope.topics[i].Id);
                        }
                        $scope.getAllSubTopics($scope.topicIds);
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.assignVideos = function() {
            for (var i = 0; i < $scope.topics.length; i++) {
                if ($scope.topics[i].VideoURL != null && $scope.topics[i].VideoURL != "") {
                    if ($scope.topics[i].VideoURL.match("watch") != null) {
                        $scope.topics[i].VideoURL = $scope.topics[i].VideoURL.replace("watch?v=", "embed/");
                        $scope.topics[i].VideoURL += "?rel=0&amp;showinfo=0";
                    }
                }
            }
            for (var i = 0; i < $scope.subTopics.length; i++) {
                if ($scope.subTopics[i].VideoURL != null && $scope.subTopics[i].VideoURL != "") {
                    if ($scope.subTopics[i].VideoURL.match("watch") != null) {
                        $scope.subTopics[i].VideoURL = $scope.subTopics[i].VideoURL.replace("watch?v=", "embed/");
                        $scope.subTopics[i].VideoURL += "?rel=0&amp;showinfo=0";
                    }
                } else {
                    toastr.error('Please enter all subtopic videos. Else delete the subtopic.');
                    return;
                }
            }
            console.log($scope.topics);
            SuperUserFactory.assignVideosToTopics($scope.topics)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Videos assigned successfully');
                        $scope.selected.Chapter = null;
                        $scope.topics = [];
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllSubTopics = function(topicIds) {
            $scope.subTopics = [];
            SuperUserFactory.getAllSubTopics(topicIds)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.subTopics = success.data.Data;
                        for (var i = 0; i < $scope.topics.length; i++) {
                            $scope.topics[i].SubTopics = [];
                            for (var j = 0; j < $scope.subTopics.length; j++) {
                                if ($scope.topics[i].Id == $scope.subTopics[j].TopicId) {
                                    $scope.topics[i].SubTopics.push($scope.subTopics[j]);
                                }
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.addSubTopics = function(topic) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/AddSubTopics.html',
                controller: 'AddSubTopicsController',
                resolve: {
                    topicId: function() {
                        return topic.Id;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                $scope.chapterSelected();
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.deleteSubTopic = function(subTopic) {
            SuperUserFactory.deleteSubTopic(subTopic)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Sub-Topics deleted successfully');
                        $scope.chapterSelected();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.editChapter = function(chapter) {
            if (chapter.Name == "") {
                toastr.warning("Name cannot be empty");
            } else {
                SuperUserFactory.editChapter(chapter)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Chapter Name edited successfully');
                            $scope.subjectSelected();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.editTopic = function(topic) {
            if (topic.Name == "") {
                toastr.warning("Name cannot be empty");
            } else {
                SuperUserFactory.editTopic(topic)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Topic Name edited successfully');
                            $scope.chapterSelected();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.editSubTopic = function(subTopic) {
            if (subTopic.Name == "") {
                toastr.warning("Name cannot be empty");
            } else {
                SuperUserFactory.editSubTopic(subTopic)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Sub Topic Name edited successfully');
                            $scope.chapterSelected();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.deleteTopic = function(topic) {
            var r = confirm("Are you sure you want to delete this topic?");
            if (r == true) {
                SuperUserFactory.deleteTopic(topic)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Topic deleted successfully');
                            $scope.chapterSelected();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllCourses();
    }).controller('AddSubTopicsController', function($scope, $uibModalInstance, SuperUserFactory, toastr, topicId) {

        $scope.newSubTopic = {
            Id: null,
            Names: [],
            TopicId: topicId,
            VideoURL: null
        };

        $scope.subTopicNames = "";

        $scope.ok = function() {
            if ($scope.subTopicNames.length == 0) {
                toastr.warning('Enter SubTopic Name');
            } else {
                $scope.newSubTopic.Names = $scope.subTopicNames.split("|");
                SuperUserFactory.addSubTopics($scope.newSubTopic)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Sub-Topics created successfully');
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