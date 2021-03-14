'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # FeesCollectedController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('FeesCollectedController', function ($scope, $state, StudentsFactory, SignInFactory, toastr, $filter, LookupFactory) {

        $scope.totalFees = 0;
        $scope.feesCollected = 0;

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.selected = {
            CourseId: null,
            SemesterId: null,
            BranchId: null,
            ClassId: null
        }

        $scope.getAllFeesCollected = function () {
            StudentsFactory.getAllFeesCollected(SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, $scope.selected.BranchId, $scope.selected.SemesterId, $scope.selected.ClassId)
                .then(function (success) {
                    $scope.feesCollected = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.feesCollected = success.data.Data.FeesCollected;
                        $scope.searchableStudents = $scope.feesCollected;
                        $scope.calculateTotalFees();
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.searchStudent = function () {
            $scope.feesCollected = $filter('filter')($scope.searchableStudents, $scope.search.text);
            $scope.calculateTotalFees();
        };

        $scope.calculateTotalFees = function () {
            $scope.totalFees = 0;
            for (var i = 0; i < $scope.feesCollected.length; i++) {
                $scope.totalFees += $scope.feesCollected[i].FeesPaid;
            }
        };

        $scope.exportToXLS = function () {
            var data_type = 'data:application/vnd.ms-excel';
            var table_div = document.getElementById('fees-list');
            var table_html = table_div.outerHTML.replace(/ /g, '%20');

            var a = document.createElement('a');
            a.href = data_type + ', ' + table_html;
            a.download = 'FeesCollection.xls';
            a.click();
        };

        $scope.getAllCourses = function () {
            $scope.courses = [];
            $scope.feesCollected = [];
            $scope.searchableStudents = $scope.feesCollected;
            $scope.calculateTotalFees();
            LookupFactory.getAllCourses(SignInFactory.loggedInUser.CollegeId)
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function (courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.BranchId = null;
            $scope.selected.SemesterId = null;
            $scope.selected.ClassId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function (branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.SemesterId = null;
            $scope.selected.ClassId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function (semesterId) {
            $scope.classes = [];
            $scope.selected.ClassId = null;
            $scope.getClasses(semesterId);
        };

        $scope.classSelected = function (classId) {
            $scope.getAllFeesCollected();
        };

        $scope.getClasses = function (semesterId) {
            $scope.feesCollected = [];
            $scope.searchableStudents = $scope.feesCollected;
            $scope.calculateTotalFees();
            LookupFactory.getAllClasses($scope.selected.BranchId, semesterId, SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function (success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.getBranches = function (courseId) {
            $scope.feesCollected = [];
            $scope.searchableStudents = $scope.feesCollected;
            $scope.calculateTotalFees();
            LookupFactory.getAllBranches(courseId, SignInFactory.loggedInUser.CollegeId)
                .then(function (success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.getSemesters = function (branchId) {
            $scope.feesCollected = [];
            $scope.searchableStudents = $scope.feesCollected;
            $scope.calculateTotalFees();
            LookupFactory.getAllSemesters(branchId, SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function (success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses();
        $scope.getAllFeesCollected();
    });