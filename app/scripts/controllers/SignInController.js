'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('SignInController', function($scope, $state, SignInFactory) {

        $scope.loginData = {
            PhoneNumber: null,
            Password: ''
        };

        $scope.errorMessage = null;

        $scope.signIn = function() {
            if ($scope.loginData.PhoneNumber == undefined || $scope.loginData.PhoneNumber == "") {
                $scope.errorMessage = 'Enter Phone Number';
            } else if ($scope.loginData.Password == undefined || $scope.loginData.Password == "") {
                $scope.errorMessage = 'Enter Password';
            } else {
                $scope.errorMessage = null;
                SignInFactory.login($scope.loginData)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            $scope.errorMessage = success.data.Message;
                        } else {
                            $scope.$emit('userLoggedIn', success.data);
                            if (success.data.Data[0].Role == 'ADMIN' || success.data.Data[0].Role == 'FACULTY') {
                                $state.go('Dashboard');
                            } else if (success.data.Data[0].Role == 'SUPERADMIN') {
                                $state.go('AddCollege');
                            } else if (success.data.Data[0].Role == 'UPLOADER') {
                                $state.go('Questions');
                            } else {
                                $state.go('Enquiries', { isAdd: true, studentId: null });
                            }
                        }
                    }, function(error) {
                        console.log(error);
                    });
            }
        };
    });