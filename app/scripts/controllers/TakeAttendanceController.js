'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ApproveRejectStudentsController
 * @description
 * # ApproveRejectStudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('TakeAttendanceController', function($scope, $state, toastr, AssignPPTFactory, AttendanceFactory, SignInFactory) {

        $scope.subjects = [];
        $scope.classes = [];
        $scope.students = [];
        $scope.topicPresentationURLs = [];

        $scope.selected = {
            subject: null,
            class: null,
            attendanceDate: moment().format("YYYY-MM-DD HH:mm:ss")
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

        $scope.getAllStudentsInClass = function() {
            $scope.students = [];
            AttendanceFactory.getAllStudentsInClass(SignInFactory.loggedInUser.CollegeId, $scope.selected.subject.Id, $scope.selected.class.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.students = success.data.Data;
                        for (var i = 0; i < $scope.students.length; i++) {
                            $scope.students[i].isPresent = true;
                        }
                    }
                }, function(error) {
                    toastr.error(success.data.Message);
                });
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(),
            minDate: new Date(2017, 1, 1),
            startingDay: 1
        };

        $scope.takeAttendance = function() {
            var attendanceTemplate = {
                Id: null,
                AttendanceDate: moment($scope.selected.attendanceDate).format('YYYY-MM-DD HH:mm:ss'),
                IsPresent: "",
                TakenBy: SignInFactory.loggedInUser.Id,
                StudentId: "",
                SubjectId: $scope.selected.subject.Id,
                ClassId: ""
            };
            var attendanceList = [];
            for (var i = 0; i < $scope.students.length; i++) {
                var temp = angular.copy(attendanceTemplate);
                if ($scope.students[i].isPresent == undefined) {
                    $scope.students[i].isPresent = false;
                }
                temp.IsPresent = $scope.students[i].isPresent.toString();
                temp.StudentId = $scope.students[i].Id;
                temp.ClassId = $scope.students[i].ClassId;
                if ($scope.selected.subject.IsElective == "true") {
                    temp.SubjectId = $scope.students[i].NormalSubjectId;
                }
                attendanceList.push(temp);
            }
            var obj = {
                Attendance: attendanceList,
                TopicsTaught: []
            };
            AttendanceFactory.takeAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Attendance was marked successfully');
                        $scope.students = [];
                        $scope.selected.attendanceDate = null;
                    }
                }, function(error) {
                    toastr.error(error.code);
                });
        };

        $scope.getAllSubjects();

    });