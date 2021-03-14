'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:AddEnquiryController
 * @description
 * # AddEnquiryController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AddEnquiryController', function ($scope, toastr, SignInFactory, $state, EnquiriesFactory, LookupFactory) {

        $scope.newEnquiry = {
            Id: null,
            CollegeId: SignInFactory.loggedInUser.CollegeId,
            EnquirySession: "",
            Name: null,
            GenderId: null,
            CourseId: null,
            BranchId: null,
            DateOfBirth: null,
            FatherName: null,
            MotherName: null,
            PhoneNumber: null,
            Source: ""
        };

        $scope.genders = [];
        $scope.courses = [];
        $scope.branches = [];
        
        $scope.likelyItems = [
            {
                Name: "Yes"
            },
            {
                Name: "No"
            },
            {
                Name: "Maybe"
            }
        ]
        $scope.sources = [
            {
                Id: 1,
                Name: "Hoardings"
            }, {
                Id: 2,
                Name: "Newspaper"
            }, {
                Id: 3,
                Name: "Radio"
            }, {
                Id: 4,
                Name: "Cable TV"
            }, {
                Id: 5,
                Name: "Friends"
            }, {
                Id: 6,
                Name: "Events"
            }, {
                Id: 7,
                Name: "Play School"
            }, {
                Id: 8,
                Name: "Website"
            }, {
                Id: 9,
                Name: "Direct Mail"
            }, {
                Id: 10,
                Name: "SMS"
            }, {
                Id: 11,
                Name: "Others"
            }
        ]

        $scope.getAllGenders = function () {
            LookupFactory.getAllGenders()
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.genders = success.data.Data;
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses = function () {
            $scope.courses = [];
            $scope.branches = [];
            $scope.newEnquiry.CourseId = null;
            $scope.newEnquiry.BranchId = null;
            LookupFactory.getAllCourses(SignInFactory.loggedInUser.CollegeId)
                .then(function (success) {
                    $scope.courses = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function (courseId) {
            $scope.branches = [];
            $scope.newEnquiry.BranchId = null;
            LookupFactory.getAllBranches(courseId, SignInFactory.loggedInUser.CollegeId)
                .then(function (success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.addEnquiry = function () {
            if ($scope.newEnquiry.Name == null ||
                $scope.newEnquiry.PhoneNumber == null ||
                $scope.newEnquiry.FatherName == null ||
                $scope.newEnquiry.MotherName == null ||
                $scope.newEnquiry.GenderId == null ||
                $scope.newEnquiry.CourseId == null ||
                $scope.newEnquiry.BranchId == null ||
                $scope.newEnquiry.DateOfBirth == null ||
                $scope.newEnquiry.EnquirySession == null ||
                $scope.newEnquiry.Name == "" ||
                $scope.newEnquiry.PhoneNumber == undefined ||
                $scope.newEnquiry.FatherName == "" ||
                $scope.newEnquiry.MotherName == "" ||
                $scope.newEnquiry.EnquirySession == "" ||
                $scope.newEnquiry.DateOfBirth == ""
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newEnquiry.DateOfBirth = moment($scope.newEnquiry.DateOfBirth).format("YYYY-MM-DD");
                for (var i = 0; i < $scope.sources.length; i++) {
                    if ($scope.sources[i].isChecked) {
                        if ($scope.newEnquiry.Source == "") {
                            $scope.newEnquiry.Source += $scope.sources[i].Name;
                        } else {
                            $scope.newEnquiry.Source += ", " + $scope.sources[i].Name;
                        }
                    }
                }
                EnquiriesFactory.addEnquiry($scope.newEnquiry)
                    .then(function (success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Enquiry was added Successfully');
                            $state.go('Enquiries');
                        }
                    }, function (error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllGenders();
        $scope.getAllCourses();
    })