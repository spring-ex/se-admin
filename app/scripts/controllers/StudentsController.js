'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # StudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('StudentsController', function($scope, $state, $stateParams, DashboardFactory, SignInFactory, StudentsFactory, toastr, $filter, LookupFactory) {

        $scope.students = [];
        $scope.search = {
            text: ""
        };
        $scope.studentCount = 0;
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        if ($stateParams.isPersisted != "0") {
            $scope.selected = StudentsFactory.persistSelectedValues;
        } else {
            $scope.selected = {
                CourseId: null,
                SemesterId: null,
                BranchId: null,
                ClassId: null
            }
        }
        $scope.keywords = DashboardFactory.keywords;

        $scope.loggedInUser = SignInFactory.loggedInUser;

        $scope.getStudentCount = function() {
            StudentsFactory.getStudentCount(SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.studentCount = success.data.Data.length;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses = function() {
            $scope.courses = [];
            LookupFactory.getAllCourses(SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                        if ($stateParams.isPersisted != "0") {
                            $scope.getBranches($scope.selected.CourseId);
                        }
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
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.SemesterId = null;
            $scope.selected.ClassId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.selected.ClassId = null;
            $scope.getClasses(semesterId);
        };

        $scope.classSelected = function(classId) {
            $scope.getAllStudents();
        };

        $scope.getClasses = function(semesterId) {
            LookupFactory.getAllClasses($scope.selected.BranchId, semesterId, SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.classes = success.data.Data;
                        if ($stateParams.isPersisted != "0") {
                            $scope.classSelected($scope.selected.ClassId);
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllStudents = function() {
            StudentsFactory.getAllByCourseBranchSem(SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, $scope.selected.BranchId, $scope.selected.SemesterId, $scope.selected.ClassId)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.students = success.data.Data;
                        $scope.searchableStudents = $scope.students;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deleteStudent = function(student) {
            var obj = {
                AdmissionId: student.AdmissionId
            };
            StudentsFactory.deleteStudent(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Student was deleted successfully');
                        $scope.getAllStudents();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.deactivateStudent = function(student) {
            StudentsFactory.reject(student)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Student was deactivated successfully');
                        $scope.getAllStudents();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.searchStudent = function() {
            $scope.students = $filter('filter')($scope.searchableStudents, $scope.search.text);
        };

        $scope.edit = function(student) {
            $state.go("AddOrEditStudent", { param: 0, studentId: student.Id });
        };

        $scope.view = function(student) {
            StudentsFactory.persistSelectedValues = $scope.selected;
            $state.go("ViewStudent", { studentId: student.Id });
        };

        $scope.getBranches = function(courseId) {
            LookupFactory.getAllBranches(courseId, SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                        if ($stateParams.isPersisted != "0") {
                            $scope.getSemesters($scope.selected.BranchId);
                        }
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
                        if ($stateParams.isPersisted != "0") {
                            $scope.getClasses($scope.selected.SemesterId);
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses();
        $scope.getStudentCount();

    });