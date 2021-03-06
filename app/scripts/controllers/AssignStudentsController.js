'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ApproveRejectStudentsController
 * @description
 * # ApproveRejectStudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AssignStudentsController', function($scope, toastr, $state, StudentsFactory, LookupFactory, DashboardFactory, SignInFactory, SuperUserFactory) {
        $scope.students = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.specialSubjects = [];
        $scope.classes = [];

        $scope.selected = {
            CourseId: null,
            SemesterId: null,
            BranchId: null,
            SpecialClassId: null,
            SpecialSubjectId: null,
            StudentList: []
        };

        $scope.keywords = DashboardFactory.keywords;

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
            $scope.specialSubjects = [];
            $scope.classes = [];
            $scope.selected.BranchId = null;
            $scope.selected.SemesterId = null;
            $scope.selected.SpecialSubjectId = null;
            $scope.selected.ClassId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.specialSubjects = [];
            $scope.classes = [];
            $scope.selected.SemesterId = null;
            $scope.selected.SpecialSubjectId = null;
            $scope.selected.ClassId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.specialSubjects = [];
            $scope.classes = [];
            $scope.selected.SpecialSubjectId = null;
            $scope.selected.ClassId = null;
            $scope.getSpecialSubjects(semesterId);
        };

        $scope.subjectSelected = function(subjectId) {
            $scope.classes = [];
            $scope.selected.SpecialClassId = null;
            $scope.getClasses(subjectId);
        };

        $scope.classSelected = function(classId) {
            $scope.getAllStudents();
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

        $scope.getSpecialSubjects = function(semesterId) {
            SuperUserFactory.getAllSpecialSubjects(SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, $scope.selected.SemesterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.specialSubjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getClasses = function(subjectId) {
            SuperUserFactory.getAllSpecialClassesForSpecialSubject(subjectId, SignInFactory.loggedInUser.CollegeId)
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

        $scope.getAllStudents = function() {
            SuperUserFactory.getAllStudentsInCourseAndSem(SignInFactory.loggedInUser.CollegeId, $scope.selected.CourseId, $scope.selected.SemesterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.assign = function() {
            var obj = {
                Students: [],
                SpecialSubjectId: $scope.selected.SpecialSubjectId,
                SpecialClassId: $scope.selected.SpecialClassId
            };
            for (var i = 0; i < $scope.selected.StudentList.length; i++) {
                obj.Students.push({
                    Id: $scope.selected.StudentList[i].Id,
                    ClassId: $scope.selected.StudentList[i].ClassId,
                    BranchId: $scope.selected.StudentList[i].BranchId
                });
            }
            if (obj.Students.length == 0) {
                toastr.warning('Select at least 1 student');
            } else {
                StudentsFactory.assignStudentsToElectives(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Assignment successful');
                            $scope.students = [];
                            $scope.selected.StudentList = [];
                            $scope.selected.SpecialSubjectId = null;
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.studentSelected = function(student, index) {
            $scope.selected.StudentList.push($scope.students[index]);
            $scope.students.splice(index, 1);
        };

        $scope.removeStudent = function(student, index) {
            $scope.selected.StudentList[index].IsSelected = 'false';
            $scope.selected.StudentList.splice(index, 1);
            $scope.students.push(student);
        };

        $scope.selectAll = function() {
            $scope.selected.StudentList = angular.copy($scope.students);
            $scope.students = [];
        };

        $scope.getAllCourses();

    })