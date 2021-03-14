'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AddCollegeController', function($scope, $state, SignInFactory, SuperUserFactory, toastr) {

        $scope.newCollege = {
            Id: null,
            Name: "",
            UniversityId: null,
            StateId: null,
            Type: null,
            PackageCode: "",
            UserDetails: {
                Id: null,
                Name: "",
                DateOfBirth: moment().format("YYYY-MM-DD"),
                Email: "",
                PhoneNumber: null,
                Address: "",
                City: "Bangalore",
                State: "Karnataka",
                Designation: "",
                ProfileImageURL: "",
                Role: "ADMIN",
                Username: "",
                Password: "",
                CollegeId: null
            }
        };

        $scope.types = [{
            Name: "School",
            Type: "SCHOOL"
        }, {
            Name: "College",
            Type: "COLLEGE"
        }, {
            Name: "Little Millennium",
            Type: "LM"
        }, {
            Name: "Skills And You",
            Type: "SAY"
        }];

        $scope.states = [];
        $scope.universities = [];
        $scope.packages = [];

        $scope.getAllStatesAndPackages = function() {
            $scope.packages = [];
            $scope.states = [];
            $scope.newCollege.PackageCode = "";
            $scope.newCollege.StateId = null;
            SuperUserFactory.getAllStates()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.states = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
            SuperUserFactory.getAllPackages()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.packages = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllUniversities = function() {
            $scope.newCollege.UniversityId = null;
            $scope.universities = [];
            SuperUserFactory.getAllUniversities($scope.newCollege.StateId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.universities = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addCollege = function() {
            SuperUserFactory.addCollege($scope.newCollege)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('College was added');
                        $scope.newCollege = {
                            Name: "",
                            Type: null,
                            UniversityId: null,
                            StateId: null,
                            PackageCode: ""
                        };
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllStatesAndPackages();
    });