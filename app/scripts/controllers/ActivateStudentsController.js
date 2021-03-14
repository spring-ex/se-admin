'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ApproveRejectStudentsController
 * @description
 * # ApproveRejectStudentsController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('ActivateStudentsController', function($scope, toastr, $state, StudentsFactory, SignInFactory) {

        $scope.students = [];

        $scope.getDeactivatedStudents = function() {
            $scope.students = [];
            StudentsFactory.getDeactivatedStudents(SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.students = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.activateStudent = function(student) {
            StudentsFactory.approve(student)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Successfully activated');
                        $scope.getDeactivatedStudents();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getDeactivatedStudents();
    })