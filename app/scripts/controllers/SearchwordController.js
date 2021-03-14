'use strict';
angular.module('smartAdminApp')
    .controller('SearchwordController', function($scope, toastr, $state, SuperUserFactory, LookupFactory) {

        $scope.searchwords = [];
        $scope.newSearchword = {
            Id: null,
            Name: null,
            SubjectId: null,
            ChapterId: null,
            Searchwords: null,
            Type: 1
        };

        $scope.selected = {
            CourseId: null,
            BranchId: null,
            SemesterId: null
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
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
            $scope.newSearchword.SubjectId = null;
            $scope.newSearchword.ChapterId = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
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
            $scope.newSearchword.SubjectId = null;
            $scope.newSearchword.ChapterId = null;
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
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
            $scope.newSearchword.SubjectId = null;
            $scope.newSearchword.ChapterId = null;
            $scope.subjects = [];
            $scope.chapters = [];
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
            $scope.searchwords = [];
            var obj = {
                SubjectIds: [$scope.newSearchword.SubjectId],
                Type: 1
            };
            SuperUserFactory.getAllTags(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.searchwords = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addSearchword = function() {
            SuperUserFactory.addSearchword($scope.newSearchword)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Keywords created successfully');
                        $scope.subjectSelected();
                        $scope.newSearchword.Searchwords = null;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deleteSearchword = function(searchword) {
            SuperUserFactory.deleteSearchword(searchword)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Keywords deleted successfully');
                        $scope.subjectSelected();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.updateSearchword = function(searchword) {
            SuperUserFactory.updateSearchword(searchword)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Keywords updated successfully');
                        $scope.subjectSelected();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses();
    });