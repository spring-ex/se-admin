'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('ProgramOutcomesController', function($scope, $state, toastr, SuperUserFactory, SignInFactory) {

        $scope.newPO = {
            Id: null,
            Name: null,
            Description: null,
            CollegeId: null,
            CourseId: null,
            BranchId: null
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.programOutcomes = [];
        $scope.selected = {
            po: null
        };
        $scope.pos = [{
            Name: "PO1"
        }, {
            Name: "PO2"
        }, {
            Name: "PO3"
        }, {
            Name: "PO4"
        }, {
            Name: "PO5"
        }, {
            Name: "PO6"
        }, {
            Name: "PO7"
        }, {
            Name: "PO8"
        }, {
            Name: "PO9"
        }, {
            Name: "PO10"
        }, {
            Name: "PO11"
        }, {
            Name: "PO12"
        }, {
            Name: "PSO1"
        }, {
            Name: "PSO2"
        }, {
            Name: "PSO3"
        }, {
            Name: "PSO4"
        }, {
            Name: "PSO5"
        }, {
            Name: "PSO6"
        }, {
            Name: "PSO7"
        }, {
            Name: "PSO8"
        }];

        $scope.getAllCourses = function() {
            $scope.newPO.CourseId = null;
            $scope.newPO.BranchId = null;
            $scope.selected.po = null;
            $scope.courses = [];
            $scope.branches = [];
            $scope.programOutcomes = [];
            SuperUserFactory.getAllCoursesForCollege(SignInFactory.loggedInUser.CollegeId)
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
            $scope.newPO.BranchId = null;
            $scope.selected.po = null;
            $scope.branches = [];
            $scope.programOutcomes = [];
            SuperUserFactory.getAllBranchesForCourse($scope.newPO.CourseId)
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
            $scope.selected.po = null;
            $scope.programOutcomes = [];
            $scope.getAllProgramOutcomes();
        };

        $scope.getAllProgramOutcomes = function() {
            SuperUserFactory.getAllProgramOutcomes(SignInFactory.loggedInUser.CollegeId, $scope.newPO.CourseId, $scope.newPO.BranchId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.programOutcomes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.createPO = function() {
            var obj = {
                Id: null,
                Name: $scope.newPO.Name,
                Description: $scope.newPO.Description,
                CollegeId: SignInFactory.loggedInUser.CollegeId,
                CourseId: $scope.newPO.CourseId,
                BranchId: $scope.newPO.BranchId
            };
            SuperUserFactory.addProgramOutcome(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Creation Successful');
                        $scope.newPO.Description = "";
                        $scope.newPO.Name = "";
                        $scope.getAllProgramOutcomes();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.updatePO = function(po) {
            SuperUserFactory.updateProgramOutcome(po)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Update Successful');
                        $scope.getAllProgramOutcomes();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deletePO = function(po) {
            SuperUserFactory.deleteProgramOutcome(po)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Deletion Successful');
                        $scope.getAllProgramOutcomes();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses();

    });