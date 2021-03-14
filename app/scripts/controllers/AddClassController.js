'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AddClassController', function($scope, $state, toastr, $uibModal, SuperUserFactory, SignInFactory, LookupFactory) {

        $scope.newClass = {
            College: null,
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            Names: []
        };
        $scope.colleges = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classNames = ""

        $scope.getAllColleges = function() {
            $scope.colleges = [];
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
            $scope.newClass.Name = "";
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            SuperUserFactory.getAllCoursesForCollege($scope.newClass.College.Id)
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
            $scope.newClass.Name = "";
            $scope.branches = [];
            $scope.semesters = [];
            LookupFactory.getAllBranches($scope.newClass.CourseId, $scope.newClass.College.Id)
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
            $scope.newClass.Name = "";
            $scope.semesters = [];
            SuperUserFactory.getAllSemestersForBranch($scope.newClass.BranchId, $scope.newClass.College.Id, $scope.newClass.CourseId, $scope.newClass.College.UniversityId, $scope.newClass.College.StateId)
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
            LookupFactory.getAllClasses($scope.newClass.BranchId, $scope.newClass.SemesterId, $scope.newClass.College.Id, $scope.newClass.CourseId, $scope.newClass.College.UniversityId, $scope.newClass.College.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addClasses = function() {
            $scope.newClass.Names = $scope.classNames.split("|");
            if ($scope.newClass.Names.length == 0) {
                toastr.error("Enter atleast 1 class name");
            } else {
                var obj = {
                    Names: $scope.newClass.Names,
                    BranchId: $scope.newClass.BranchId,
                    SemesterId: $scope.newClass.SemesterId,
                    CollegeId: $scope.newClass.College.Id,
                    CourseId: $scope.newClass.CourseId,
                    UniversityId: $scope.newClass.College.UniversityId,
                    StateId: $scope.newClass.College.StateId
                };
                SuperUserFactory.addClasses(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Class addition Successful');
                            $scope.semesterSelected();
                            $scope.newClass.SemesterId = null;
                            $scope.classNames = "";
                            $scope.newClass.Names = [];
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllColleges();

    });