'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('ViewCriteriaController', function($scope, toastr, SuperUserFactory, LookupFactory, $sce, CriteriaFactory) {

        $scope.selected = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            Chapter: null,
            Topic: null
        };
        $scope.changed = {
            Topic: null
        };
        $scope.bts = [];
        $scope.questions = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.topics = [];
        $scope.question = null;

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

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
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
            $scope.selected.BranchId = null;
            $scope.selected.SemesterId = null;
            $scope.selected.SubjectId = null;
            $scope.selected.Chapter = null;
            $scope.selected.Topic = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
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
            $scope.selected.Topic = null;
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
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
            $scope.selected.Topic = null;
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
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
            $scope.selected.Topic = null;
            $scope.chapters = [];
            $scope.topics = [];
            $scope.questions = [];
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
            $scope.selected.Topic = null;
            $scope.topics = [];
            $scope.questions = [];
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

        $scope.topicSelected = function() {
            $scope.questions = [];
            SuperUserFactory.getAllCriteria($scope.selected.Chapter.Id, $scope.selected.Topic.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.changed.Topic = $scope.selected.Topic;
                        $scope.questions = success.data.Data;
                        if ($scope.questions.length > 0) {
                            $scope.question = $scope.questions[0];
                            $scope.selected.tagsToShow = angular.copy($scope.question.Tags);
                            $scope.question.ImageURL = $sce.trustAsResourceUrl($scope.question.ImageURL);
                            $scope.currentIndex = 0;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deleteQuestion = function() {
            var r = confirm("Are you sure you want to delete this question?");
            if (r == true) {
                CriteriaFactory.deleteCriteria($scope.question)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Question deleted successfully');
                            $scope.topicSelected();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.questionSelected = function(index) {
            $scope.currentIndex = index;
            $scope.question = $scope.questions[$scope.currentIndex];
            $scope.selected.tagsToShow = angular.copy($scope.question.Tags);
            $scope.question.ImageURL = $sce.trustAsResourceUrl($scope.question.ImageURL);
            $scope.clearTagSelection();
        }

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

        $scope.editCriteria = function() {
            $scope.question.Tags = $scope.selected.tagsToShow;
            if ($scope.selected.Topic.Id == $scope.changed.Topic.Id) {
                $scope.question.TopicId = null;
            } else {
                $scope.question.TopicId = $scope.changed.Topic.Id;
            }
            CriteriaFactory.editCriteria($scope.question)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Question edited successfully');
                        $scope.topicSelected();
                        $scope.clearTagSelection();
                    }
                }, function(error) {
                    toastr.error(error);
                })
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

        $scope.clearTagSelection = function() {
            for (var i = 0; i < $scope.standard.length; i++) {
                $scope.standard[i].isSelected = false;
            }
            for (var i = 0; i < $scope.difficultyLevel.length; i++) {
                $scope.difficultyLevel[i].isSelected = false;
            }
            for (var i = 0; i < $scope.answerTypes.length; i++) {
                $scope.answerTypes[i].isSelected = false;
            }
            for (var i = 0; i < $scope.answerLengths.length; i++) {
                $scope.answerLengths[i].isSelected = false;
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
        };

        $scope.removeCriteriaImage = function() {
            CriteriaFactory.removeCriteriaImage($scope.question)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Question edited successfully');
                        $scope.topicSelected();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllBlooms();
        $scope.getAllCourses();
    });