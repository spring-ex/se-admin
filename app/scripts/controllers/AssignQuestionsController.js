'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ApproveRejectStudentsController
 * @description
 * # ApproveRejectStudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AssignQuestionsController', function($scope, $state, toastr, SuperUserFactory, LookupFactory, SignInFactory, $sce) {

        $scope.colleges = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.topics = [];
        $scope.questions = [];
        $scope.question = null;
        $scope.currentIndex = 0;

        $scope.selected = {
            college: null,
            courseId: null,
            branchId: null,
            semesterId: null,
            SubjectId: null,
            ChapterId: null,
            tagsToShow: null
        };

        $scope.standard = [{
            Id: 1,
            Name: "Basic"
        }, {
            Id: 2,
            Name: "Intermediary"
        }, {
            Id: 3,
            Name: "Advanced"
        }];

        $scope.difficultyLevel = [{
            Id: 1,
            Name: "Easy"
        }, {
            Id: 2,
            Name: "Moderate"
        }, {
            Id: 3,
            Name: "Hard"
        }];

        $scope.mathsCore = [{
            Id: 1,
            Name: "Arithmetic"
        }, {
            Id: 2,
            Name: "Algebra"
        }, {
            Id: 3,
            Name: "Geometry"
        }, {
            Id: 4,
            Name: "Trigonometry"
        }, {
            Id: 5,
            Name: "Statistics"
        }];

        $scope.scienceCore = [{
            Id: 1,
            Name: "Physics"
        }, {
            Id: 2,
            Name: "Chemistry"
        }, {
            Id: 3,
            Name: "Biology"
        }, {
            Id: 4,
            Name: "Electronics"
        }, {
            Id: 5,
            Name: "EVS"
        }];

        $scope.answerTypes = [{
            Id: 2,
            Name: "Numerical"
        }, {
            Id: 3,
            Name: "Theorem"
        }, {
            Id: 4,
            Name: "Proof"
        }, {
            Id: 5,
            Name: "Differences"
        }, {
            Id: 6,
            Name: "Diagram"
        }, {
            Id: 7,
            Name: "Graph"
        }, {
            Id: 8,
            Name: "Definition"
        }, {
            Id: 9,
            Name: "Facts"
        }];

        $scope.btms = [{
            Id: 1,
            Name: "Remembering"
        }, {
            Id: 2,
            Name: "Understanding"
        }, {
            Id: 3,
            Name: "Applying"
        }, {
            Id: 4,
            Name: "Analyzing"
        }, {
            Id: 5,
            Name: "Evaluating"
        }, {
            Id: 6,
            Name: "Creating"
        }];

        $scope.others = [{
            Id: 7,
            Name: "Problem Solving"
        }, {
            Id: 8,
            Name: "Logical Thinking"
        }, {
            Id: 10,
            Name: "Attention to detail"
        }, {
            Id: 14,
            Name: "Formulas"
        }]

        // $scope.getAllColleges = function() {
        //     $scope.colleges = [];
        //     $scope.courses = [];
        //     $scope.branches = [];
        //     $scope.semesters = [];
        //     $scope.subjects = [];
        //     $scope.chapters = [];
        //     $scope.topics = [];
        //     $scope.questions = [];
        //     $scope.selected.courseId = null;
        //     $scope.selected.branchId = null;
        //     $scope.selected.semesterId = null;
        //     $scope.selected.SubjectId = null;
        //     $scope.selected.ChapterId = null;
        //     SuperUserFactory.getAllColleges()
        //         .then(function(success) {
        //             if (success.data.Code != "S001") {
        //                 toastr.error(success.data.Message);
        //             } else {
        //                 $scope.colleges = success.data.Data;
        //             }
        //         }, function(error) {
        //             toastr.error(error);
        //         });
        // };

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
            $scope.selected.courseId = null;
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
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

        $scope.getBranchesForCourse = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            SuperUserFactory.getAllBranchesForCourse(courseId)
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

        $scope.getSemestersForBranch = function(branchId) {
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
            $scope.selected.semesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            SuperUserFactory.getAllSemestersForBranchAndCourse(branchId, $scope.selected.courseId)
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

        $scope.getSubjectsForSemester = function(semesterId) {
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            LookupFactory.getAllSubjects($scope.selected.courseId, $scope.selected.branchId, semesterId)
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

        $scope.getAllChaptersForSubject = function(subjectId) {
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
            $scope.selected.ChapterId = null;
            SuperUserFactory.getAllChaptersForSubject(subjectId)
                .then(function(success) {
                    $scope.chapters = [];
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
            SuperUserFactory.getAllQuestionsForChapter(chapterId, $scope.selected.SubjectId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.questions = success.data.Data;
                        for (var i = 0; i < $scope.questions.length; i++) {
                            $scope.questions[i].IncludeInSmartLearning = parseInt($scope.questions[i].IncludeInSmartLearning);
                        }
                        if ($scope.questions.length > 0) {
                            $scope.question = $scope.questions[0];
                            $scope.question.QuestionMediaURL = $sce.trustAsResourceUrl($scope.question.QuestionMediaURL);
                            $scope.currentIndex = 0;
                            $scope.selected.tagsToShow = angular.copy($scope.question.Tags);
                            //hardcoding package code as SMART
                            $scope.getAllOptionsForQuestion($scope.question.Id, 'SMART');
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllOptionsForQuestion = function(questionId, packageCode) {
            SuperUserFactory.getAllOptionsForQuestion(questionId, packageCode)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.question.Options = success.data.Data;
                        $scope.getAllTopicsForChapter($scope.selected.ChapterId);
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllTopicsForChapter = function(chapterId) {
            $scope.topics = [];
            SuperUserFactory.getAllTopicsForChapter(chapterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.topics = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.nextQuestion = function() {
            if ($scope.questions[$scope.currentIndex + 1] != undefined) {
                $scope.currentIndex++;
                $scope.question = $scope.questions[$scope.currentIndex];
                $scope.selected.tagsToShow = angular.copy($scope.question.Tags);
                if ($scope.question.QuestionForm == 'VIDEO' && typeof $scope.question.QuestionMediaURL == 'string') {
                    $scope.question.QuestionMediaURL = $sce.trustAsResourceUrl($scope.question.QuestionMediaURL);
                }
                //hardcoding package code as SMART
                $scope.clearTagSelection();
                $scope.getAllOptionsForQuestion($scope.question.Id, 'SMART');
            } else {
                toastr.success('You have successfully completed all the MCQs!');
            }
        };

        $scope.previousQuestion = function() {
            if ($scope.currentIndex - 1 >= 0) {
                $scope.currentIndex--;
                $scope.question = $scope.questions[$scope.currentIndex];
                $scope.selected.tagsToShow = angular.copy($scope.question.Tags);
                if ($scope.question.QuestionForm == 'VIDEO' && typeof $scope.question.QuestionMediaURL == 'string') {
                    $scope.question.QuestionMediaURL = $sce.trustAsResourceUrl($scope.question.QuestionMediaURL);
                }
                //hardcoding package code as SMART
                $scope.clearTagSelection();
                $scope.getAllOptionsForQuestion($scope.question.Id, 'SMART');
            }
        };

        $scope.questionSelected = function(index) {
            $scope.currentIndex = index;
            $scope.question = $scope.questions[$scope.currentIndex];
            $scope.selected.tagsToShow = angular.copy($scope.question.Tags);
            if ($scope.question.QuestionForm == 'VIDEO' && typeof $scope.question.QuestionMediaURL == 'string') {
                $scope.question.QuestionMediaURL = $sce.trustAsResourceUrl($scope.question.QuestionMediaURL);
            }
            //hardcoding package code as SMART
            $scope.clearTagSelection();
            $scope.getAllOptionsForQuestion($scope.question.Id, 'SMART');
        }

        $scope.assign = function() {
            if ($scope.question.TopicId == null) {
                toastr.warning('Choose a topic to assign');
            } else {
                var obj = {
                    QuestionId: $scope.question.Id,
                    TopicId: $scope.question.TopicId,
                    ChapterId: $scope.selected.ChapterId
                };
                SuperUserFactory.assignQuestionToTopic(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Assignment successful');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.timeChanged = function() {
            if ($scope.question.TimeToSolveInSeconds == undefined) {
                toastr.warning('Time cannot be empty');
            } else {
                var obj = {
                    QuestionId: $scope.question.Id,
                    TimeToSolveInSeconds: parseFloat($scope.question.TimeToSolveInSeconds)
                }
                SuperUserFactory.updateTimeToSolveForQuestion(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Time update successful');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.optionChanged = function(option) {
            if (option.OptionText.length == "" || option.OptionValue == undefined) {
                toastr.warning('Option Text or Value cannot be empty');
            } else {
                SuperUserFactory.updateOption(option)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Option update successful');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.updateQuestion = function() {
            var obj = {
                QuestionId: $scope.question.Id,
                QuestionText: $scope.question.QuestionText,
                Solution: $scope.question.Solution,
                IncludeInSmartLearning: $scope.question.IncludeInSmartLearning == true ? 1 : 0
            }
            console.log(obj);
            SuperUserFactory.updateQuestion(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Question update successful');
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.removeQuestionImage = function(que) {
            SuperUserFactory.removeQuestionImage(que)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Question image deleted successfully');
                        $scope.getAllQuestionsForChapter($scope.selected.ChapterId);
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.updateTags = function() {
            $scope.question.Tags = $scope.selected.tagsToShow;
            SuperUserFactory.updateTagsForQuestion($scope.question)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Tags update successful');
                        $scope.clearTagSelection();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.clearTagSelection = function() {
            for (var i = 0; i < $scope.standard.length; i++) {
                $scope.standard[i].isSelected = false;
            }
            for (var i = 0; i < $scope.difficultyLevel.length; i++) {
                $scope.difficultyLevel[i].isSelected = false;
            }
            for (var i = 0; i < $scope.mathsCore.length; i++) {
                $scope.mathsCore[i].isSelected = false;
            }
            for (var i = 0; i < $scope.answerTypes.length; i++) {
                $scope.answerTypes[i].isSelected = false;
            }
            for (var i = 0; i < $scope.scienceCore.length; i++) {
                $scope.scienceCore[i].isSelected = false;
            }
            for (var i = 0; i < $scope.btms.length; i++) {
                $scope.btms[i].isSelected = false;
            }
            for (var i = 0; i < $scope.others.length; i++) {
                $scope.others[i].isSelected = false;
            }
        };

        $scope.deleteQuestion = function() {
            var r = confirm("Are you sure you want to delete this question?");
            if (r == true) {
                SuperUserFactory.deleteQuestion($scope.question)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Question deleted successfully');
                            $scope.getAllQuestionsForChapter($scope.selected.ChapterId);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.addToTags = function(tag) {
            if (tag.isSelected) {
                if ($scope.selected.tagsToShow == null) {
                    $scope.selected.tagsToShow = "";
                } else {
                    $scope.selected.tagsToShow += ',';
                }
                $scope.selected.tagsToShow += tag.Name;
            } else {
                $scope.selected.tagsToShow = $scope.selected.tagsToShow.replace(tag.Name, '');
            }
        };

        $scope.getAllCourses();

    })