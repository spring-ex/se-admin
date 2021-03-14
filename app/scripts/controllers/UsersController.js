'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:UserController
 * @description
 * # UserController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('UsersController', function($scope, $state, SignInFactory, UsersFactory, toastr, $filter, AttendanceFactory, $window) {

        $scope.users = [];
        $scope.search = {
            text: ""
        };
        $scope.loggedInUser = SignInFactory.loggedInUser;
        $scope.getAllUsers = function() {
            UsersFactory.getAllUsers(SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                        $scope.users = success.data.Data;
                    } else {
                        $scope.users = success.data.Data;
                        $scope.searchableUsers = $scope.users;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addUser = function() {
            $state.go("AddOrEditUser", { isAdd: true, userId: null });
        };

        $scope.deleteUser = function(user) {
            var deleteUser = $window.confirm('Are you sure you want to delete ' + user.Name + '?');
            if (deleteUser) {
                var obj = {
                    Id: user.Id
                };
                UsersFactory.deleteUser(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('User was deleted successfully');
                            $scope.getAllUsers();
                        }
                    }, function(error) {
                        toastr.error(error);
                    })
            }
        };

        $scope.searchUser = function() {
            $scope.users = $filter('filter')($scope.searchableUsers, $scope.search.text);
        };

        $scope.edit = function(user) {
            $state.go("AddOrEditUser", { isAdd: false, userId: user.Id });
        };

        $scope.view = function(user) {
            $state.go("ViewUser", { userId: user.Id });
        };

        $scope.resetPassword = function(user) {
            var resetP = $window.confirm('Are you sure you want to reset Password for ' + user.Name + '?');
            if (resetP) {
                UsersFactory.resetUserPassword(user)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('User password has be reset to their Phone Number');
                            $scope.getAllUsers();
                        }
                    }, function(error) {
                        toastr.error(error);
                    })
            }
        };

        $scope.assignStudentsToElectives = function() {
            $state.go('AssignStudentsToElectives');
        };

        $scope.getAllUsers();
    });