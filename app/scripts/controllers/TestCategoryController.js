'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('TestCategoryController', function($scope, $state, toastr, $uibModal, SuperUserFactory, LookupFactory) {

        $scope.assignCategories = {
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            SubjectId: null,
            CategoryIds: []
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.subjects = [];
        $scope.categories = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.categories = [];
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
            $scope.assignCategories.BranchId = null;
            $scope.assignCategories.SemesterId = null;
            $scope.assignCategories.SubjectId = null;
            $scope.branches = [];
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.categories = [];
            SuperUserFactory.getAllBranchesForCourse($scope.assignCategories.CourseId)
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
            $scope.assignCategories.SemesterId = null;
            $scope.assignCategories.SubjectId = null;
            $scope.semesters = [];
            $scope.subjects = [];
            $scope.categories = [];
            SuperUserFactory.getAllSemestersForBranchAndCourse($scope.assignCategories.BranchId, $scope.assignCategories.CourseId)
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
            $scope.assignCategories.SubjectId = null;
            $scope.subjects = [];
            $scope.categories = [];
            LookupFactory.getAllSubjects($scope.assignCategories.CourseId, $scope.assignCategories.BranchId, $scope.assignCategories.SemesterId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
            $scope.getAllCategories();
        };

        $scope.getAllCategories = function() {
            SuperUserFactory.getAllCategories()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.categories = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.assign = function() {
            for (var i = 0; i < $scope.categories.length; i++) {
                if ($scope.categories[i].isChecked) {
                    $scope.assignCategories.CategoryIds.push($scope.categories[i].Id);
                }
            }
            if ($scope.assignCategories.CategoryIds.length == 0) {
                toastr.warning('Please choose atleast one category');
            } else {
                SuperUserFactory.assignCategory($scope.assignCategories)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Assignment successfull');
                            $scope.assignCategories = {
                                CourseId: null,
                                BranchId: null,
                                SemesterId: null,
                                SubjectId: null,
                                CategoryIds: []
                            };

                            $scope.courses = [];
                            $scope.branches = [];
                            $scope.semesters = [];
                            $scope.subjects = [];
                            $scope.categories = [];
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.addCategories = function() {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/AddTestCategory.html',
                controller: 'AddTestCategoryController'
            });

            modalInstance.result.then(function(response) {
                $scope.getAllCourses();
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.getAllCourses();

    }).controller('AddTestCategoryController', function($scope, $uibModalInstance, SuperUserFactory, toastr) {

        $scope.newCategory = {
            Names: []
        };

        $scope.categoryNames = "";

        $scope.ok = function() {
            if ($scope.categoryNames.length == 0) {
                toastr.warning('Enter atleast one category');
            } else {
                $scope.newCategory.Names = $scope.categoryNames.split("|");
                SuperUserFactory.addCategories($scope.newCategory)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Categories Created Successfully');
                            $uibModalInstance.close();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });