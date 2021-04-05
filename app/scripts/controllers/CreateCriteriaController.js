'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('CreateCriteriaController', function($scope, toastr, SuperUserFactory, LookupFactory, CriteriaFactory) {

        $scope.selected = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            Chapter: null,
            QuestionForm: null
        };

        $scope.newCriteria = {
            Id: null,
            Name: "",
            Tags: null,
            BTId: null,
            Topics: [],
            ImageURL: null,
            ImagePublicId: null
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

        $scope.answerLengths = [{
            Id: 1,
            Name: "Short"
        }, {
            Id: 2,
            Name: "Medium"
        }, {
            Id: 3,
            Name: "Long"
        }];

        $scope.answerTypes = [{
            Id: 1,
            Name: "Descriptive"
        }, {
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
            Name: "Derivation"
        }, {
            Id: 9,
            Name: "Definition"
        }, {
            Id: 10,
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
        }];

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
        $scope.bts = [];

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.topics = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
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
            $scope.selected.BranchId = null;
            $scope.selected.SemesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.Chapter = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllBranchesForCourse($scope.selected.CourseId)
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
            $scope.selected.SemesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.Chapter = null;
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.selected.BranchId, $scope.selected.CourseId)
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
            $scope.selected.SubjectId = null;
            $scope.selected.Chapter = null;
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            LookupFactory.getAllSubjects($scope.selected.CourseId, $scope.selected.BranchId, $scope.selected.SemesterId)
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
            $scope.selected.Chapter = null;
            $scope.chapters = [];
            $scope.topics = [];
            SuperUserFactory.getAllChaptersForSubject($scope.selected.SubjectId)
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

        $scope.chapterSelected = function() {
            $scope.topics = [];
            SuperUserFactory.getAllTopicsForChapter($scope.selected.Chapter.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.topics = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.addQuestion = function() {
            for (var i = 0; i < $scope.topics.length; i++) {
                if ($scope.topics[i].isChecked) {
                    $scope.newCriteria.Topics.push({
                        ChapterId: $scope.selected.Chapter.Id,
                        TopicId: $scope.topics[i].Id
                    });
                }
            }
            if ($scope.newCriteria.Topics.length == 0) {
                toastr.warning('Select atleast one topic');
            } else {
                CriteriaFactory.createCriteria($scope.newCriteria)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Criteria created successfully');
                            $scope.newCriteria = {
                                Id: null,
                                Name: "",
                                Tags: null,
                                BTId: null,
                                Topics: [],
                                ImageURL: null,
                                ImagePublicId: null
                            };
                            for (var i = 0; i < $scope.standard.length; i++) {
                                $scope.standard[i].isSelected = false;
                            }
                            for (var i = 0; i < $scope.difficultyLevel.length; i++) {
                                $scope.difficultyLevel[i].isSelected = false;
                            }
                            for (var i = 0; i < $scope.answerLengths.length; i++) {
                                $scope.answerLengths[i].isSelected = false;
                            }
                            for (var i = 0; i < $scope.answerTypes.length; i++) {
                                $scope.answerTypes[i].isSelected = false;
                            }
                            for (var i = 0; i < $scope.mathsCore.length; i++) {
                                $scope.mathsCore[i].isSelected = false;
                            }
                            for (var i = 0; i < $scope.scienceCore.length; i++) {
                                $scope.scienceCore[i].isSelected = false;
                            }
                            for (var i = 0; i < $scope.skills.length; i++) {
                                $scope.skills[i].isSelected = false;
                            }
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
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

        $scope.openQuestionUploader = function() {
            cloudinary.openUploadWidget({
                cloud_name: 'dzerq05zm',
                upload_preset: 'findinbox'
            }, function(error, result) {
                $scope.newCriteria.ImageURL = 'http://res.cloudinary.com/demo/image/fetch/f_auto,q_auto/' + result[0].secure_url;
                $scope.newCriteria.ImagePublicId = result[0].public_id;
                $scope.$apply();
            });
        };

        $scope.addToTags = function(tag) {
            if (tag.isSelected) {
                if ($scope.newCriteria.Tags == null) {
                    $scope.newCriteria.Tags = "";
                } else {
                    $scope.newCriteria.Tags += ',';
                }
                $scope.newCriteria.Tags += tag.Name;
            } else {
                $scope.newCriteria.Tags = $scope.newCriteria.Tags.replace(tag.Name, '');
            }
        };

        $scope.getAllBlooms();
        $scope.getAllCourses();
    });