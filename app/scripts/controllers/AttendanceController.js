'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:AddOrEditStudentController
 * @description
 * # AddOrEditStudentController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AttendanceController', function($scope, toastr, $state, DashboardFactory, LookupFactory, SignInFactory, AttendanceFactory) {

        $scope.selected = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            ClassId: null,
            Subject: null,
            DateRange: null
        };

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
            startDate: moment().subtract(1, 'year'),
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

        $scope.getAllCourses = function() {
            LookupFactory.getAllCourses(SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = [];
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(courseId) {
            LookupFactory.getAllBranches(courseId, SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = [];
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.branchSelected = function(branchId) {
            LookupFactory.getAllSemesters(branchId, SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.semesters = [];
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.semesterSelected = function(semesterId) {
            LookupFactory.getAllClasses($scope.selected.BranchId, semesterId, SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.classes = [];
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
            LookupFactory.getAllSubjects($scope.selected.CourseId, $scope.selected.BranchId, semesterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.subjects = [];
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.checkAttendance = function() {
            $scope.attendance = [];
            $scope.studentNames = [];
            AttendanceFactory.getAttendance($scope.selected.Subject.Id, $scope.selected.ClassId, SignInFactory.loggedInUser.CollegeId, $scope.selected.Subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.attendance = success.data.Data;
                        // $scope.formatAttendance();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.formatAttendance = function() {
            $scope.studentNames = [];
            $scope.dates = [];
            for (var i = 0; i < $scope.attendance.length; i++) {
                var studentObj = {
                    Id: $scope.attendance[i].StudentId,
                    Name: $scope.attendance[i].Name
                };
                if (!$scope.containsObject(studentObj, $scope.studentNames)) {
                    $scope.studentNames.push(studentObj);
                }
            }

            for (var i = 0; i < $scope.attendance.length; i++) {
                if ($scope.studentNames[0].Id == $scope.attendance[i].StudentId) {
                    $scope.dates.push($scope.attendance[i].AttendanceDate);
                }
            }
        };

        $scope.containsObject = function(obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
                    return true;
                }
            }
            return false;
        };

        $scope.exportToXLS = function() {
            var data_type = 'data:application/vnd.ms-excel';
            var table_div = document.getElementById('attendance-list');
            var table_html = table_div.outerHTML.replace(/ /g, '%20');

            var a = document.createElement('a');
            a.href = data_type + ', ' + table_html;
            a.download = 'Attendance[' + moment($scope.selected.DateRange.startDate).format('DD/MM/YY') + ' to ' + moment($scope.selected.DateRange.endDate).format('DD/MM/YY') + '].xls';
            a.click();
        };

        $scope.getAllCourses();
    })