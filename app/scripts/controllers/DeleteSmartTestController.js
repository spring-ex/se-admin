'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('DeleteSmartTestController', function($scope, $state, toastr, SuperUserFactory, LookupFactory) {

        $scope.deleteQuiz = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            ChapterId: null
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.quizzes = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.quizzes = [];
            SuperUserFactory.getAllCourses()
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
            $scope.deleteQuiz.BranchId = null;
            $scope.deleteQuiz.SemesterId = null;
            $scope.deleteQuiz.SubjectId = null;
            $scope.deleteQuiz.ChapterId = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.quizzes = [];
            SuperUserFactory.getAllBranchesForCourse($scope.deleteQuiz.CourseId)
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
            $scope.deleteQuiz.SemesterId = null;
            $scope.deleteQuiz.SubjectId = null;
            $scope.deleteQuiz.ChapterId = null;
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.quizzes = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.deleteQuiz.BranchId, $scope.deleteQuiz.CourseId)
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
            $scope.deleteQuiz.SubjectId = null;
            $scope.deleteQuiz.ChapterId = null;
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.quizzes = [];
            LookupFactory.getAllSubjects($scope.deleteQuiz.CourseId, $scope.deleteQuiz.BranchId, $scope.deleteQuiz.SemesterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.subjectSelected = function() {
            $scope.deleteQuiz.ChapterId = null;
            $scope.chapters = [];
            $scope.quizzes = [];
            SuperUserFactory.getAllChaptersForSubject($scope.deleteQuiz.SubjectId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllQuizzes = function() {
            $scope.quizzes = [];
            SuperUserFactory.getAllSmartTestForChapter($scope.deleteQuiz.ChapterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.quizzes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deleteQuiz = function(quiz) {
            var r = confirm("Are you sure you want to delete this quiz?");
            if (r == true) {
                SuperUserFactory.deleteQuiz(quiz)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Quiz deleted successfully');
                            $scope.getAllQuizzes();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }

        };

        $scope.getAllCourses();
    });