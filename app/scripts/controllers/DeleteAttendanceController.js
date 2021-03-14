'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:AddOrEditStudentController
 * @description
 * # AddOrEditStudentController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('DeleteAttendanceController', function($scope, toastr, $state, DashboardFactory, LookupFactory, SignInFactory, AttendanceFactory, UsersFactory) {

        $scope.selected = {
            subject: null,
            class: null,
            DateRange: null,
            user: null
        };

        $scope.subjects = [];
        $scope.classes = [];

        $scope.attendance = [];
        $scope.studentNames = [];
        $scope.dates = [];
        $scope.keywords = DashboardFactory.keywords;

        $scope.options = {
            locale: {
                applyLabel: "Apply",
                fromLabel: "From",
                format: "DD-MMM-YYYY",
                toLabel: "To",
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            startDate: moment(),
            endDate: moment().add(1, 'year'),
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }

        $scope.getAllUsers = function() {
            UsersFactory.getAllUsers(SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                        $scope.users = success.data.Data;
                    } else {
                        $scope.users = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.userSelected = function(user) {
            $scope.attendance = [];
            $scope.uniqueDates = [];
            $scope.studentIds = [];
            $scope.Students = [];
            $scope.ClassIds = [];
            $scope.SubjectIds = [];
            AttendanceFactory.getAllSubjectsForUser(user.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.subjectSelected = function(selectedSubject) {
            $scope.attendance = [];
            $scope.uniqueDates = [];
            $scope.studentIds = [];
            $scope.Students = [];
            $scope.ClassIds = [];
            $scope.SubjectIds = [];
            $scope.selected.subject = selectedSubject;
            if ($scope.selected.subject.IsElective == undefined) {
                $scope.selected.subject.IsElective = "true";
            }
            AttendanceFactory.getAllClassesForSubject($scope.selected.subject.Id, $scope.selected.user.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.checkAttendance = function() {
            $scope.attendance = [];
            $scope.uniqueDates = [];
            $scope.studentIds = [];
            for (var i = 0; i < $scope.Students.length; i++) {
                $scope.studentIds.push($scope.Students[i].Id);
            }
            var obj = {
                SubjectIds: $scope.SubjectIds,
                ClassIds: $scope.ClassIds,
                DateRange: $scope.selected.DateRange,
                StudentIds: $scope.studentIds
            }
            AttendanceFactory.getDaysAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.attendance = success.data.Data;
                        $scope.formatAttendance();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.openDatePicker = function() {
            $scope.datePicker.opened = true;
        };

        $scope.getAttendance = function() {
            if ($scope.selected.subject != null) {
                $scope.getAllStudentsInClass();
            }
        };

        $scope.getAllStudentsInClass = function() {
            $scope.Students = [];
            $scope.ClassIds = [];
            $scope.SubjectIds = [];
            AttendanceFactory.getAllStudentsInClass($scope.selected.user.CollegeId, $scope.selected.subject.Id, $scope.selected.class.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.Students = success.data.Data;
                        $scope.ClassIds = $scope.getUniqueIds($scope.Students, 'ClassId');
                        if ($scope.selected.subject.IsElective == "true") {
                            $scope.SubjectIds = $scope.getUniqueIds($scope.Students, 'NormalSubjectId');
                        } else {
                            $scope.SubjectIds.push($scope.selected.subject.Id);
                        }
                    }
                    $scope.checkAttendance();
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getUniqueIds = function(array, key) {
            return array.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.formatAttendance = function() {
            $scope.uniqueDates = [];
            $scope.uniqueDates = $scope.getUniqueIds($scope.attendance, 'AttendanceDate');
        };

        $scope.deleteDaysAttendance = function(dat) {
            var attendanceIdsToDelete = [];
            for (var i = 0; i < $scope.attendance.length; i++) {
                if ($scope.attendance[i].AttendanceDate == dat) {
                    attendanceIdsToDelete.push($scope.attendance[i].Id);
                }
            }
            var obj = {
                Ids: attendanceIdsToDelete
            };
            AttendanceFactory.deleteDaysAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.getAllStudentsInClass();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.updateAttendance = function(att) {
            var obj = {
                Id: att.Id,
                IsPresent: att.IsPresent.toString()
            };
            AttendanceFactory.editAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Attendance was edited successfully');
                        $scope.getAllStudentsInClass();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllUsers();
    })