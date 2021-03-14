'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ViewStudentController
 * @description
 * # ViewStudentController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('ViewStudentController', function ($scope, toastr, SignInFactory, $state, $stateParams, StudentsFactory) {

        $scope.user = {};
        $scope.studentId = $stateParams.studentId;
        $scope.student = {};

        $scope.getStudentDetails = function () {
            StudentsFactory.getStudentById($scope.studentId)
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.student = success.data.Data[0];
                    }
                }, function (error) {
                    toastr.error(error);
                })
        };

        $scope.goBack = function () {
            $state.go('Students', {isPersisted: 1});
        };

        $scope.getStudentDetails();
    })