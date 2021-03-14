'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('BranchesController', function($scope, $state, toastr, $uibModal, SuperUserFactory) {

        $scope.assignBranch = {
            College: null,
            CourseId: null,
            BranchIds: []
        };

        $scope.colleges = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.branchIds = [];

        $scope.addBranch = function() {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/AddBranch.html',
                controller: 'AddBranchController'
            });

            modalInstance.result.then(function(response) {
                $scope.getAllColleges();
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.getAllColleges = function() {
            $scope.colleges = [];
            $scope.courses = [];
            $scope.branches = [];
            $scope.assignBranch.College = null;
            $scope.assignBranch.CourseId = null;
            $scope.assignBranch.BranchIds = [];
            SuperUserFactory.getAllColleges()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.colleges = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.collegeSelected = function() {
            $scope.assignBranch.CourseId = null;
            $scope.assignBranch.BranchIds = [];
            $scope.courses = [];
            $scope.branches = [];
            SuperUserFactory.getAllCoursesForCollege($scope.assignBranch.College.Id)
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
            $scope.assignBranch.BranchIds = [];
            $scope.branches = [];
            SuperUserFactory.getAllBranchesForCourse($scope.assignBranch.CourseId)
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

        $scope.assign = function() {
            for (var i = 0; i < $scope.branches.length; i++) {
                if ($scope.branches[i].isChecked) {
                    $scope.branchIds.push($scope.branches[i].Id);
                }
            }
            if ($scope.branchIds.length > 0) {
                var obj = {
                    BranchIds: $scope.branchIds,
                    CollegeId: $scope.assignBranch.College.Id,
                    CourseId: $scope.assignBranch.CourseId,
                    StateId: $scope.assignBranch.College.StateId,
                    UniversityId: $scope.assignBranch.College.UniversityId
                };
                SuperUserFactory.assignBranchesToCollege(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Assignment Successful');
                            $scope.branches = [];
                            $scope.assignBranch.CourseId = null;
                            $scope.assignBranch.BranchIds = [];
                            $scope.branchIds = [];
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            } else {
                toastr.warning('Select atleast one branch');
            }
        };

        $scope.getAllColleges();

    }).controller('AddBranchController', function($scope, $uibModalInstance, SuperUserFactory, toastr) {

        $scope.newBranch = {
            Names: [],
            CourseId: null,
        };

        $scope.branchNames

        $scope.courses = [];

        $scope.getAllCourses = function() {
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

        $scope.ok = function() {
            $scope.newBranch.Names = $scope.branchNames.split("|");
            if ($scope.newBranch.Names.length == 0) {
                toastr.success('Enter atleast 1 branch');
            } else {
                SuperUserFactory.addBranch($scope.newBranch)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Branches Created Successfully');
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

        $scope.getAllCourses();
    });