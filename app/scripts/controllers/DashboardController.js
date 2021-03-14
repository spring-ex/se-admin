'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:DashboardController
 * @description
 * # DashboardController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('DashboardController', function($scope, $state, $timeout, SignInFactory, DashboardFactory, toastr, LookupFactory) {

        $scope.marksStatistics = [];
        $scope.attendanceStatistics = [];
        $scope.graph = {
            color: ""
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.keywords = null;

        $scope.selected = {
            DateRange: {
                startDate: moment().subtract(3, 'month'),
                endDate: moment()
            },
            CourseId: null,
            SemesterId: null,
            BranchId: null,
            ClassId: null
        };

        $scope.attendance = {
            ChartConfig: {
                chart: {
                    renderTo: 'attendanceChart'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    title: {
                        text: 'Date Range'
                    },
                    categories: $scope.attendanceStatistics.Dates
                },
                yAxis: {
                    title: {
                        text: 'Percentage'
                    }
                },
                series: [{
                    name: "Attendance",
                    data: $scope.attendanceStatistics.Percentages
                }]
            }
        };

        $scope.options = {
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            locale: {
                applyLabel: "Apply",
                fromLabel: "From",
                format: "DD/MMM/YYYY",
                toLabel: "To",
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            startDate: moment().subtract(3, 'month'),
            endDate: moment(),
            opens: 'left'
        };

        $scope.renderLineChart = function() {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'attendanceChart'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    title: {
                        text: 'Date Range'
                    },
                    categories: $scope.attendanceStatistics.Dates
                },
                yAxis: {
                    title: {
                        text: 'Percentage'
                    }
                },
                series: [{
                    data: $scope.attendanceStatistics.Percentages
                }]
            });
        };

        $scope.getAttendanceStatistics = function(obj) {
            $scope.attendanceStatistics = [];
            DashboardFactory.getCollegeAttendanceStatistics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (success.data.Data.Dates.length == 0) {
                            toastr.warning('No attendance has been taken yet');
                        } else {
                            $scope.attendanceStatistics = success.data.Data;
                        }
                    }
                    $scope.renderLineChart();
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getMarksStatistics = function(obj) {
            $scope.marksStatistics = [];
            DashboardFactory.getCollegeMarksStatistics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning(success.data.Message);
                    } else {
                        $scope.marksStatistics = success.data.Data;
                        if ($scope.marksStatistics.Percentage >= 75) {
                            $scope.graph.color = "#2ba14b";
                        } else if ($scope.marksStatistics.Percentage >= 50 && $scope.marksStatistics.Percentage < 75) {
                            $scope.graph.color = "#f1b500";
                        } else {
                            $scope.graph.color = "#e33e2b";
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllStatistics = function() {
            var obj = {
                CollegeId: SignInFactory.loggedInUser.CollegeId,
                CourseId: $scope.selected.CourseId,
                BranchId: $scope.selected.BranchId,
                SemesterId: $scope.selected.SemesterId,
                ClassId: $scope.selected.ClassId
            }
            $scope.getAttendanceStatistics(obj);
            $scope.getMarksStatistics(obj);
        };

        $scope.getAllCourses = function() {
            $scope.courses = [];
            LookupFactory.getAllCourses(SignInFactory.loggedInUser.CollegeId)
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

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.BranchId = null;
            $scope.selected.SemesterId = null;
            $scope.selected.ClassId = null;
            $scope.getBranches(courseId);
            $scope.getAllStatistics();
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.SemesterId = null;
            $scope.selected.ClassId = null;
            $scope.getSemesters(branchId);
            $scope.getAllStatistics();
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.selected.ClassId = null;
            $scope.getClasses(semesterId);
            $scope.getAllStatistics();
        };

        $scope.classSelected = function(classId) {
            $scope.getAllStatistics();
        };

        $scope.getBranches = function(courseId) {
            LookupFactory.getAllBranches(courseId, SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getSemesters = function(branchId) {
            LookupFactory.getAllSemesters(branchId, SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getClasses = function(semesterId) {
            LookupFactory.getAllClasses($scope.selected.BranchId, semesterId, SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
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

        $scope.getAllKeywords = function() {
            DashboardFactory.getAllKeywords(SignInFactory.loggedInUser.Type)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.keywords = success.data.Data[0];
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllKeywords();
        $scope.getAllStatistics();
        $scope.getAllCourses();
    });