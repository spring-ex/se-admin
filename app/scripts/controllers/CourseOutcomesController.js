'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ApproveRejectStudentsController
 * @description
 * # ApproveRejectStudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('CourseOutcomesController', function($scope, $state, toastr, AssignPPTFactory, AttendanceFactory, SignInFactory, SuperUserFactory) {

        $scope.subjects = [];
        $scope.classes = [];
        $scope.programOutcomes = [];
        $scope.students = [];

        $scope.selected = {
            subject: null,
            class: null
        };

        $scope.descriptors = [{
            Name: "1"
        }, {
            Name: "2"
        }, {
            Name: "3"
        }]

        $scope.newCO = {
            Id: null,
            Name: null,
            Description: null,
            CollegeId: SignInFactory.loggedInUser.CollegeId,
            CourseId: null,
            BranchIds: [],
            SemesterId: null,
            ClassIds: [],
            SubjectIds: [],
            IsElective: null,
            ProgramOutcomes: []
        };

        $scope.cos = [{
            Name: "CO1"
        }, {
            Name: "CO2"
        }, {
            Name: "CO3"
        }, {
            Name: "CO4"
        }, {
            Name: "CO5"
        }, {
            Name: "CO6"
        }, {
            Name: "CO7"
        }, {
            Name: "CO8"
        }, {
            Name: "CO9"
        }, {
            Name: "CO10"
        }];

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

        $scope.getAllClassesForSubject = function() {
            if ($scope.selected.subject.IsElective == undefined) {
                $scope.selected.subject.IsElective = "true";
            }
            AttendanceFactory.getAllClassesForSubject($scope.selected.subject.Id, SignInFactory.loggedInUser.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(success.data.Message);
                });
        };

        $scope.getAllProgramOutcomes = function() {
            $scope.programOutcomes = [];
            if ($scope.selected.subject.IsElective == undefined) {
                $scope.selected.subject.IsElective = "true";
            }
            SuperUserFactory.getAllProgramOutcomesForSubject(SignInFactory.loggedInUser.CollegeId, $scope.selected.subject.CourseId, $scope.selected.subject.Id, $scope.selected.subject.IsElective)
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

        $scope.createNewCo = function() {
            $scope.newCO.CourseId = $scope.selected.subject.CourseId;
            $scope.newCO.SemesterId = $scope.selected.subject.SemesterId;
            $scope.newCO.IsElective = $scope.selected.subject.IsElective;
            for (var i = 0; i < $scope.programOutcomes.length; i++) {
                if ($scope.programOutcomes[i].isChecked) {
                    $scope.newCO.ProgramOutcomes.push({
                        Id: $scope.programOutcomes[i].Id,
                        Descriptor: $scope.programOutcomes[i].Descriptor
                    });
                }
            }
            console.log($scope.newCO);
            if ($scope.newCO.ProgramOutcomes.length == 0) {
                toastr.warning('Please select atleast on Program Outcome');
            } else {
                SuperUserFactory.addCourseOutcome($scope.newCO)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Creation Successful');
                            $scope.newCO.Description = "";
                            $scope.newCO.Name = "";
                            $scope.newCO.CourseId = null;
                            $scope.newCO.BranchIds = [];
                            $scope.newCO.SemesterId = null;
                            $scope.newCO.ClassIds = [];
                            $scope.newCO.SubjectIds = [];
                            $scope.newCO.IsElective = null;
                            $scope.newCO.ProgramOutcomes = [];
                            $scope.selected.class = null;
                            $scope.selected.subject = null;
                            $scope.programOutcomes = [];
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllStudentsInClass = function() {
            AttendanceFactory.getAllStudentsInClass(SignInFactory.loggedInUser.CollegeId, $scope.selected.subject.Id, $scope.selected.class.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.students = success.data.Data;
                        $scope.newCO.ClassIds = $scope.getUniqueIds($scope.students, 'ClassId');
                        $scope.newCO.BranchIds = $scope.getUniqueIds($scope.students, 'BranchId');
                        if ($scope.selected.subject.IsElective == "true") {
                            $scope.newCO.SubjectIds = $scope.getUniqueIds($scope.students, 'NormalSubjectId');
                        } else {
                            $scope.newCO.SubjectIds.push($scope.selected.subject.Id);
                        }
                    }
                    $scope.getAllProgramOutcomes();
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getUniqueIds = function(array, key) {
            return $scope.students.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.getAllSubjects();

    });