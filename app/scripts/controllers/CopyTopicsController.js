'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('CopyTopicsController', function($scope, $state, SignInFactory, SuperUserFactory, toastr, LookupFactory) {

        $scope.source = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            ChapterId: null
        };

        $scope.sourceCourses = [];
        $scope.sourceBranches = [];
        $scope.sourceSemesters = [];
        $scope.sourceSubjects = [];
        $scope.sourceChapters = [];
        $scope.sourceTopics = [];

        $scope.destination = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            ChapterId: null,
            TopicIds: []
        };

        $scope.destinationCourses = [];
        $scope.destinationBranches = [];
        $scope.destinationSemesters = [];
        $scope.destinationSubjects = [];
        $scope.destinationChapters = [];
        $scope.destinationTopics = [];

        $scope.getAllCourses = function() {
            SuperUserFactory.getAllCourses()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.sourceCourses = success.data.Data;
                        $scope.destinationCourses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(flag) {
            var cid;
            if (flag) {
                $scope.source.BranchId = null;
                $scope.source.SemesterId = null;
                $scope.source.SubjectId = null;
                $scope.source.ChapterId = null;
                $scope.sourceBranches = [];
                $scope.sourceSemesters = [];
                $scope.sourceSubjects = [];
                $scope.sourceChapters = [];
                $scope.topics = [];
                cid = $scope.source.CourseId;
            } else {
                $scope.destination.BranchId = null;
                $scope.destination.SemesterId = null;
                $scope.destination.SubjectId = null;
                $scope.destination.ChapterId = null;
                $scope.destinationBranches = [];
                $scope.destinationSemesters = [];
                $scope.destinationSubjects = [];
                $scope.destinationChapters = [];
                cid = $scope.destination.CourseId;
            }
            SuperUserFactory.getAllBranchesForCourse(cid)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.sourceBranches = success.data.Data;
                        } else {
                            $scope.destinationBranches = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.branchSelected = function(flag) {
            var bid, cid;
            if (flag) {
                $scope.source.SemesterId = null;
                $scope.source.SubjectId = null;
                $scope.source.ChapterId = null;
                $scope.sourceSemesters = [];
                $scope.sourceSubjects = [];
                $scope.sourceChapters = [];
                $scope.topics = [];
                bid = $scope.source.BranchId;
                cid = $scope.source.CourseId;
            } else {
                $scope.destination.SemesterId = null;
                $scope.destination.SubjectId = null;
                $scope.destination.ChapterId = null;
                $scope.destinationSemesters = [];
                $scope.destinationSubjects = [];
                $scope.destinationChapters = [];
                bid = $scope.destination.BranchId;
                cid = $scope.destination.CourseId;
            }
            SuperUserFactory.getAllSemestersForBranchAndCourse(bid, cid)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.sourceSemesters = success.data.Data;
                        } else {
                            $scope.destinationSemesters = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.semesterSelected = function(flag) {
            var bid, cid, sid;
            if (flag) {
                $scope.source.SubjectId = null;
                $scope.source.ChapterId = null;
                $scope.sourceSubjects = [];
                $scope.sourceChapters = [];
                $scope.topics = [];
                bid = $scope.source.BranchId;
                cid = $scope.source.CourseId;
                sid = $scope.source.SemesterId;
            } else {
                $scope.destination.SubjectId = null;
                $scope.destination.ChapterId = null;
                $scope.destinationSubjects = [];
                $scope.destinationChapters = [];
                bid = $scope.destination.BranchId;
                cid = $scope.destination.CourseId;
                sid = $scope.destination.SemesterId;
            }
            LookupFactory.getAllSubjects(cid, bid, sid)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.sourceSubjects = success.data.Data;
                        } else {
                            $scope.destinationSubjects = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.subjectSelected = function(flag) {
            var sid;
            if (flag) {
                $scope.source.ChapterId = null;
                $scope.sourceChapters = [];
                $scope.topics = [];
                sid = $scope.source.SubjectId;
            } else {
                $scope.destination.ChapterId = null;
                $scope.destinationChapters = [];
                sid = $scope.destination.SubjectId;
            }
            SuperUserFactory.getAllChaptersForSubject(sid)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.sourceChapters = success.data.Data;
                        } else {
                            $scope.destinationChapters = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.chapterSelected = function(flag) {
            var cid = $scope.destination.ChapterId;
            if (flag) {
                $scope.sourceTopics = [];
                cid = $scope.source.ChapterId;
            } else {
                $scope.destinationTopics = [];
            }
            SuperUserFactory.getAllTopicsForChapter(cid)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.sourceTopics = success.data.Data;
                        } else {
                            $scope.destinationTopics = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.copyTopics = function() {
            if ($scope.destination.ChapterId == null) {
                toastr.warning('Please choose a destination chapter to copy topics');
            } else {
                $scope.destination.TopicIds = [];
                for (var i = 0; i < $scope.sourceTopics.length; i++) {
                    if ($scope.sourceTopics[i].IsSelected == "true") {
                        $scope.destination.TopicIds.push($scope.sourceTopics[i].Id);
                    }
                }
                SuperUserFactory.assignTopics($scope.destination)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Assignment successful!');
                            $scope.chapterSelected(0);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.selectAllTopics = function() {
            for (var i = 0; i < $scope.sourceTopics.length; i++) {
                $scope.sourceTopics[i].IsSelected = "true";
            }
        };

        $scope.getAllCourses();

    });