'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('QuestionsController', function($scope, $state, toastr, SuperUserFactory, LookupFactory, SignInFactory) {

        $scope.newQuestion = {
            QuestionText: null,
            Tags: null,
            QuestionType: "SINGLE",
            QuestionForm: null,
            QuestionMediaURL: null,
            QuestionPublicId: null,
            TimeToSolveInSeconds: 60,
            IncludeInSmartLearning: 0,
            Solution: null,
            Options: [],
            TopicId: null,
            ChapterId: null,
            BTId: null
        };

        $scope.optionTemplate = {
            QuestionId: null,
            OptionForm: "TEXT",
            OptionText: "",
            OptionValue: null
        };

        $scope.newOption = {
            Text1: "",
            Text2: "",
            Text3: "",
            Text4: "",
            Text5: "",
            Value1: 1,
            Value2: 0,
            Value3: 0,
            Value4: 0,
            Value5: 0
        };

        $scope.colleges = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.topics = [];
        $scope.bts = [];

        $scope.selected = {
            college: null,
            courseId: null,
            branchId: null,
            semesterId: null,
            SubjectId: null,
            ChapterId: null
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

        $scope.questionForms = [{
            Id: 1,
            Form: "TEXT"
        }, {
            Id: 2,
            Form: "IMAGE"
        }, {
            Id: 3,
            Form: "VIDEO"
        }];

        $scope.addQuestion = function() {
            $scope.newQuestion.ChapterId = $scope.selected.ChapterId;
            if ($scope.newQuestion.TimeToSolveInSeconds == null ||
                $scope.newQuestion.Options.length == 0 ||
                $scope.newQuestion.TopicId == null ||
                $scope.newQuestion.ChapterId == null) {
                toastr.warning('Please enter all fields');
            } else {
                SuperUserFactory.addQuestion($scope.newQuestion)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Question successfully added');
                            $scope.newQuestion.QuestionType = "SINGLE";
                            $scope.newQuestion.Tags = null;
                            $scope.newQuestion.QuestionText = "";
                            $scope.newQuestion.QuestionMediaURL = null;
                            $scope.newQuestion.QuestionPublicId = null;
                            $scope.newQuestion.TimeToSolveInSeconds = 60;
                            $scope.newQuestion.IncludeInSmartLearning = 0;
                            $scope.newQuestion.BTId = null;
                            $scope.newQuestion.Solution = null;
                            $scope.newQuestion.Options = [];
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
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.openQuestionUploader = function() {
            cloudinary.openUploadWidget({
                cloud_name: 'dzerq05zm',
                upload_preset: 'findinbox'
            }, function(error, result) {
                $scope.newQuestion.QuestionMediaURL = 'http://res.cloudinary.com/demo/image/fetch/f_auto,q_auto/' + result[0].secure_url;
                $scope.newQuestion.QuestionPublicId = result[0].public_id;
                $scope.$apply();
            });
        };

        $scope.addOptions = function() {
            if ($scope.newOption.Text1 != "" && $scope.newOption.Value1 != undefined) {
                var opt = angular.copy($scope.optionTemplate);
                opt.OptionText = $scope.newOption.Text1;
                opt.OptionValue = $scope.newOption.Value1;
                $scope.newQuestion.Options.push(opt);
                $scope.newOption.Text1 = "";
                $scope.newOption.Value1 = 1;
            }
            if ($scope.newOption.Text2 != "" && $scope.newOption.Value2 != undefined) {
                var opt = angular.copy($scope.optionTemplate);
                opt.OptionText = $scope.newOption.Text2;
                opt.OptionValue = $scope.newOption.Value2;
                $scope.newQuestion.Options.push(opt);
                $scope.newOption.Text2 = "";
                $scope.newOption.Value2 = 0;
            }
            if ($scope.newOption.Text3 != "" && $scope.newOption.Value3 != undefined) {
                var opt = angular.copy($scope.optionTemplate);
                opt.OptionText = $scope.newOption.Text3;
                opt.OptionValue = $scope.newOption.Value3;
                $scope.newQuestion.Options.push(opt);
                $scope.newOption.Text3 = "";
                $scope.newOption.Value3 = 0;
            }
            if ($scope.newOption.Text4 != "" && $scope.newOption.Value4 != undefined) {
                var opt = angular.copy($scope.optionTemplate);
                opt.OptionText = $scope.newOption.Text4;
                opt.OptionValue = $scope.newOption.Value4;
                $scope.newQuestion.Options.push(opt);
                $scope.newOption.Text4 = "";
                $scope.newOption.Value4 = 0;
            }
            if ($scope.newOption.Text5 != "" && $scope.newOption.Value5 != undefined) {
                var opt = angular.copy($scope.optionTemplate);
                opt.OptionText = $scope.newOption.Text5;
                opt.OptionValue = $scope.newOption.Value5;
                $scope.newQuestion.Options.push(opt);
                $scope.newOption.Text5 = "";
                $scope.newOption.Value5 = 0;
            }
        };

        // $scope.getAllColleges = function() {
        //     $scope.colleges = [];
        //     $scope.courses = [];
        //     $scope.branches = [];
        //     $scope.semesters = [];
        //     $scope.subjects = [];
        //     $scope.chapters = [];
        //     $scope.topics = [];
        //     $scope.selected.courseId = null;
        //     $scope.selected.branchId = null;
        //     $scope.selected.semesterId = null;
        //     $scope.selected.SubjectId = null;
        //     $scope.selected.ChapterId = null;
        //     $scope.newQuestion.TopicId = null;
        //     $scope.newQuestion.ChapterId = null;
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
            $scope.selected.courseId = null;
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            $scope.newQuestion.TopicId = null;
            $scope.newQuestion.ChapterId = null;
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
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            $scope.newQuestion.TopicId = null;
            $scope.newQuestion.ChapterId = null;
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
            $scope.selected.semesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            $scope.newQuestion.TopicId = null;
            $scope.newQuestion.ChapterId = null;
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
            $scope.selected.SubjectId = null;
            $scope.selected.ChapterId = null;
            $scope.newQuestion.TopicId = null;
            $scope.newQuestion.ChapterId = null;
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
            $scope.selected.ChapterId = null;
            $scope.newQuestion.TopicId = null;
            $scope.newQuestion.ChapterId = null;
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

        $scope.getAllTopicsForChapter = function(chapterId) {
            $scope.topics = [];
            $scope.newQuestion.TopicId = null;
            $scope.newQuestion.ChapterId = null;
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

        $scope.removeOption = function(index) {
            $scope.newQuestion.Options.splice(index, 1);
        };

        $scope.getAllBlooms = function() {
            SuperUserFactory.getAllBlooms()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.bts = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.addToTags = function(tag) {
            if (tag.isSelected) {
                if ($scope.newQuestion.Tags == null) {
                    $scope.newQuestion.Tags = "";
                } else {
                    $scope.newQuestion.Tags += ',';
                }
                $scope.newQuestion.Tags += tag.Name;
            } else {
                $scope.newQuestion.Tags = $scope.newQuestion.Tags.replace(tag.Name, '');
            }
        };

        $scope.getAllCourses();
        $scope.getAllBlooms();
    });