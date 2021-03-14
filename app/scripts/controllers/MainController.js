'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:MainController
 * @description
 * # MainController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('MainController', function ($scope, $state, $location, SignInFactory) {

        $scope.loggedInUser = {};
        $scope.checkHeaderAndSideNav = function () {
            return !_.contains(["/SignIn"], $location.path());
        };

        $scope.logout = function () {
            SignInFactory.logout();
            $state.go('SignIn');
        };

        $scope.$on('userLoggedIn', function (event, loggedInUser) {
            $scope.loggedInUsers = loggedInUser.Data;
            $scope.loggedInUser = SignInFactory.loggedInUser;
        });

        $scope.changeCollege = function(user){
            $scope.loggedInUser = user;
            SignInFactory.loggedInUser = user;
            $state.reload();
        };

    });