'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ApproveRejectStudentsController
 * @description
 * # ApproveRejectStudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('LinkSpecialSubjectsController', function($scope, toastr, $state, SuperUserFactory, LookupFactory, SignInFactory) {

        $scope.source = {
            CollegeId: null,
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SpecialSubjectId: null
        };

        $scope.sourceColleges = [];
        $scope.sourceCourses = [];
        $scope.sourceBranches = [];
        $scope.sourceSemesters = []

        $scope.subjects = [];
        $scope.specialSubjects = [];

        $scope.destination = {
            CollegeId: null,
            CourseId: null,
            BranchId: null,
            SemesterId: null
        };

        $scope.destinationColleges = [];
        $scope.destinationCourses = [];
        $scope.destinationBranches = [];
        $scope.destinationSemesters = [];

        $scope.getAllColleges = function() {
            $scope.source.CourseId = null;
            $scope.source.BranchId = null;
            $scope.source.SemesterId = null;
            $scope.sourceCourses = [];
            $scope.sourceBranches = [];
            $scope.sourceSemesters = [];

            $scope.destination.CourseId = null;
            $scope.destination.BranchId = null;
            $scope.destination.SemesterId = null;
            $scope.destinationCourses = [];
            $scope.destinationBranches = [];
            $scope.destinationSemesters = [];
            SuperUserFactory.getAllColleges()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.sourceColleges = success.data.Data;
                        $scope.destinationColleges = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.collegeSelected = function(flag) {
            var cid;
            if (flag) {
                $scope.source.CourseId = null;
                $scope.source.BranchId = null;
                $scope.source.SemesterId = null;
                $scope.sourceCourses = [];
                $scope.sourceBranches = [];
                $scope.sourceSemesters = [];
                cid = $scope.source.CollegeId;
            } else {
                $scope.destination.CourseId = null;
                $scope.destination.BranchId = null;
                $scope.destination.SemesterId = null;
                $scope.destinationCourses = [];
                $scope.destinationBranches = [];
                $scope.destinationSemesters = [];
                cid = $scope.destination.CollegeId;
            }
            SuperUserFactory.getAllCoursesForCollege(cid)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.sourceCourses = success.data.Data;
                        } else {
                            $scope.destinationCourses = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(flag) {
            var cid, coid;
            if (flag) {
                $scope.source.BranchId = null;
                $scope.source.SemesterId = null;
                $scope.sourceBranches = [];
                $scope.sourceSemesters = [];
                $scope.topics = [];
                cid = $scope.source.CourseId;
                coid = $scope.source.CollegeId;
            } else {
                $scope.destination.BranchId = null;
                $scope.destination.SemesterId = null;
                $scope.destinationBranches = [];
                $scope.destinationSemesters = [];
                cid = $scope.destination.CourseId;
                coid = $scope.destination.CollegeId;
            }
            LookupFactory.getAllBranches(cid, coid)
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
                $scope.sourceSemesters = [];
                $scope.topics = [];
                bid = $scope.source.BranchId;
                cid = $scope.source.CourseId;
            } else {
                $scope.destination.SemesterId = null;
                $scope.destinationSemesters = [];
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

        $scope.getAllSubjects = function() {
            var cid, sid;
            cid = $scope.destination.CourseId;
            sid = $scope.destination.SemesterId;
            LookupFactory.getSubjectsBySemester(cid, sid)
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

        $scope.getAllSpecialSubjects = function() {
            var coid, cid, sid;
            coid = $scope.source.CollegeId;
            cid = $scope.source.CourseId;
            sid = $scope.source.SemesterId;
            SuperUserFactory.getAllSpecialSubjects(coid, cid, sid)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.specialSubjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.linkSubjects = function() {
            var obj = {
                SubjectIds: [],
                SpecialSubjectId: $scope.source.SpecialSubjectId
            };
            for (var i = 0; i < $scope.subjects.length; i++) {
                if ($scope.subjects[i].IsSelected == "true") {
                    obj.SubjectIds.push($scope.subjects[i].Id);
                }
            }
            SuperUserFactory.linkSubjects(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Link Successful');
                        $scope.destination.SemesterId = null;
                        $scope.subjects = [];
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllColleges();
    });