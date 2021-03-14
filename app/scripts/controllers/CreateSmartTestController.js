'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('CreateSmartTestController', function($scope, $state, toastr, $uibModal, SuperUserFactory, LookupFactory, $sce) {

        $scope.newSmartTest = {
            Name: "",
            EnableTimeConstraint: 1,
            Instructions: "1. This is a ONE TIME attempt quiz. Once completed, it cannot be reversed or attempted again.<br>2. A timer below the question will display the remaining time available to answer the question.<br>3. Click on ‘Next’ to get new question.<br>4. The answer will be saved automatically upon clicking ‘Next’.<br>5. Unanswered questions cannot be answered later.<br>6. If you click ‘Exit’ before completing the quiz, you can attempt it later.",
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            ChapterId: null,
            Questions: [],
            TestType: 1
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.questions = [];
        $scope.selectedQuestions = [];

        $scope.trustURL = $sce.trustAsResourceUrl;

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.questions = [];
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
            $scope.newSmartTest.BranchId = null;
            $scope.newSmartTest.SemesterId = null;
            $scope.newSmartTest.SubjectId = null;
            $scope.newSmartTest.ChapterId = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.questions = [];
            SuperUserFactory.getAllBranchesForCourse($scope.newSmartTest.CourseId)
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
            $scope.newSmartTest.SemesterId = null;
            $scope.newSmartTest.SubjectId = null;
            $scope.newSmartTest.ChapterId = null;
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.questions = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.newSmartTest.BranchId, $scope.newSmartTest.CourseId)
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
            $scope.newSmartTest.SubjectId = null;
            $scope.newSmartTest.ChapterId = null;
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.questions = [];
            LookupFactory.getAllSubjects($scope.newSmartTest.CourseId, $scope.newSmartTest.BranchId, $scope.newSmartTest.SemesterId)
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
            $scope.newSmartTest.ChapterId = null;
            $scope.chapters = [];
            $scope.questions = [];
            SuperUserFactory.getAllChaptersForSubject($scope.newSmartTest.SubjectId)
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

        $scope.getAllQuestionsForChapter = function(chapterId) {
            $scope.questions = [];
            SuperUserFactory.getAllQuestionsForChapter(chapterId, $scope.newSmartTest.SubjectId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.questions = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.createSmartTest = function() {
            if ($scope.newSmartTest.Name == "") {
                toastr.warning('Please enter quiz name!');
            } else {
                for (var i = 0; i < $scope.selectedQuestions.length; i++) {
                    if ($scope.selectedQuestions[i].IsSelected) {
                        $scope.newSmartTest.Questions.push($scope.selectedQuestions[i]);
                    }
                }
                // console.log($scope.newSmartTest);
                SuperUserFactory.createSmartTest($scope.newSmartTest)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Quiz created successfully');
                            for (var i = 0; i < $scope.questions.length; i++) {
                                $scope.questions[i].IsSelected = false;
                            }
                            $scope.selectedQuestions = [];
                            $scope.newSmartTest.Name = "";
                            $scope.newSmartTest.EnableTimeConstraint = 1;
                            $scope.newSmartTest.Instructions = "1. This is a ONE TIME attempt quiz. Once completed, it cannot be reversed or attempted again.<br>2. A timer below the question will display the remaining time available to answer the question.<br>3. Click on ‘Next’ to get new question.<br>4. The answer will be saved automatically upon clicking ‘Next’.<br>5. Unanswered questions cannot be answered later.<br>6. If you click ‘Exit’ before completing the quiz, you can attempt it later.";
                            $scope.newSmartTest.Questions = [];
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.questionSelected = function(question) {
            if (question.IsSelected) {
                var q = angular.copy(question);
                $scope.selectedQuestions.push(q);
            }
        };

        $scope.getAllCourses();
    });