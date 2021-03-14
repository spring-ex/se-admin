'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:ViewUserController
 * @description
 * # ViewUserController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('ViewUserController', function($scope, toastr, SignInFactory, $state, $stateParams, UsersFactory, DashboardFactory) {

        $scope.user = {};
        $scope.userId = $stateParams.userId;
        $scope.loggedInUser = SignInFactory.loggedInUser;

        $scope.keywords = DashboardFactory.keywords;

        $scope.getUserDetails = function() {
            UsersFactory.getUserById($scope.userId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.user = success.data.Data;
                        for (var i = 0; i < $scope.user.SpecialSubjects.length; i++) {
                            $scope.user.Subjects.push($scope.user.SpecialSubjects[i]);
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.goBack = function() {
            $state.go('Users');
        };

        $scope.getUserDetails();
    })