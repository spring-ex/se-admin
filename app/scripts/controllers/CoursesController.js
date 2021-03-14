'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('CoursesController', function($scope, $state, toastr, $uibModal, SuperUserFactory) {

        $scope.assignCourse = {
            College: null,
            CourseIds: []
        };

        $scope.colleges = [];
        $scope.courses = [];
        $scope.courseIds = [];

        $scope.addCourse = function() {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/AddCourse.html',
                controller: 'AddCourseController'
            });

            modalInstance.result.then(function(response) {
                $scope.getAllCollegesAndCourses();
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.getAllCollegesAndCourses = function() {
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
            $scope.getAllCourses();
        };

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

        $scope.assign = function() {
            for (var i = 0; i < $scope.courses.length; i++) {
                if ($scope.courses[i].isChecked) {
                    $scope.courseIds.push($scope.courses[i].Id);
                }
            }
            if ($scope.courseIds.length == 0) {
                toastr.warning('Please choose atleast one course');
            } else {
                var obj = {
                    CollegeId: $scope.assignCourse.College.Id,
                    CourseIds: $scope.courseIds,
                    StateId: $scope.assignCourse.College.StateId,
                    UniversityId: $scope.assignCourse.College.UniversityId
                };
                SuperUserFactory.assignCoursesToCollege(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Assignment Successful');
                            $scope.getAllCourses();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllCollegesAndCourses();
    }).controller('AddCourseController', function($scope, $uibModalInstance, SuperUserFactory, toastr) {

        $scope.newCourse = {
            Names: []
        };

        $scope.courseNames = "";

        $scope.ok = function() {
            $scope.newCourse.Names = $scope.courseNames.split("|");
            if ($scope.newCourse.Names.length == 0) {
                toastr.success('Please enter at least 1 course');
            } else {
                SuperUserFactory.addCourse($scope.newCourse)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Courses Created Successfully');
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