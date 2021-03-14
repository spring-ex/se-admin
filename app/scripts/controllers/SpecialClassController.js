'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('SpecialClassController', function($scope, $state, SuperUserFactory, toastr, LookupFactory, SignInFactory) {
        $scope.newClass = {
            Name: null,
            SpecialSubjectId: null,
            CollegeId: null,
            CourseId: null,
            SemesterId: null
        };
        $scope.colleges = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.specialSubjects = [];

        $scope.getAllColleges = function() {
            $scope.colleges = [];
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.specialSubjects = [];
            $scope.newClass.College = null;
            $scope.newClass.CourseId = null;
            $scope.newClass.BranchId = null;
            $scope.newClass.SemesterId = null;
            $scope.newClass.SpecialSubjectId = null;
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

        $scope.collegeSelected = function() {
            $scope.newClass.CourseId = null;
            $scope.newClass.BranchId = null;
            $scope.newClass.SemesterId = null;
            $scope.newClass.SpecialSubjectId = null;
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.specialSubjects = [];
            SuperUserFactory.getAllCoursesForCollege($scope.newClass.CollegeId)
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
            $scope.newClass.BranchId = null;
            $scope.newClass.SemesterId = null;
            $scope.newClass.SpecialSubjectId = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.specialSubjects = [];
            LookupFactory.getAllBranches($scope.newClass.CourseId, $scope.newClass.CollegeId)
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
            $scope.newClass.SemesterId = null;
            $scope.newClass.SpecialSubjectId = null;
            $scope.semesters = [];
            $scope.specialSubjects = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.newClass.BranchId, $scope.newClass.CourseId)
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
            $scope.newClass.SpecialSubjectId = null;
            $scope.specialSubjects = [];
            SuperUserFactory.getAllSpecialSubjects($scope.newClass.CollegeId, $scope.newClass.CourseId, $scope.newClass.SemesterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.specialSubjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        }

        $scope.subjectSelected = function() {
            SuperUserFactory.getAllSpecialClassesForSpecialSubject($scope.newClass.SpecialSubjectId, $scope.newClass.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        }

        $scope.addSpecialClass = function() {
            var obj = {
                Id: null,
                Name: $scope.newClass.Name,
                SpecialSubjectId: $scope.newClass.SpecialSubjectId,
                CollegeId: $scope.newClass.CollegeId,
                SemesterId: $scope.newClass.SemesterId,
                CourseId: $scope.newClass.CourseId,
            };
            SuperUserFactory.addSpecialClass(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Special Class addition Successful');
                        $scope.subjectSelected();
                    }
                    $scope.newClass.SpecialSubjectId = null;
                    $scope.newClass.Name = "";
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllColleges();

    });