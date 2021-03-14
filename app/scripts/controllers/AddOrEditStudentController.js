'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:AddOrEditStudentController
 * @description
 * # AddOrEditStudentController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AddOrEditStudentController', function($scope, toastr, SignInFactory, DashboardFactory, $stateParams, $state, LookupFactory, StudentsFactory, EnquiriesFactory) {

        $scope.param = $stateParams.param;
        $scope.studentId = $stateParams.studentId;
        $scope.loggedInUser = SignInFactory.loggedInUser;
        $scope.keywords = DashboardFactory.keywords;

        $scope.newAdmission = {
            Id: null,
            CollegeId: SignInFactory.loggedInUser.CollegeId,
            Name: null,
            GenderId: null,
            CourseId: null,
            SemesterId: null,
            BranchId: null,
            ClassId: null,
            DateOfBirth: null,
            AadhaarNumber: null,
            FatherName: null,
            FatherOccupation: null,
            MotherName: null,
            MotherOccupation: null,
            FatherPhoneNumber: null,
            MotherPhoneNumber: null,
            PhoneNumber: null,
            Email: null,
            Address: null,
            TotalFees: null,
            Remarks: null,
            EnquiryId: null,
            Payment: []
        };

        $scope.newPayment = {
            Id: null,
            AdmissionId: null,
            PaymentMode: null,
            FeesPaid: null,
            PaymentModeNumber: null,
            PaymentDate: null
        };

        $scope.remainingFees = 0;

        $scope.genders = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];

        $scope.getAllGenders = function() {
            LookupFactory.getAllGenders()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.genders = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllCourses = function() {
            LookupFactory.getAllCourses(SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = [];
                        $scope.courses = success.data.Data;
                        if ($scope.param == 0) {
                            StudentsFactory.getStudentById($scope.studentId)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.error(success.data.Message);
                                    } else {
                                        $scope.newAdmission = success.data.Data[0];
                                        $scope.newAdmission.PhoneNumber = parseInt($scope.newAdmission.PhoneNumber);
                                        $scope.newAdmission.AadhaarNumber = parseInt($scope.newAdmission.AadhaarNumber);
                                        $scope.newAdmission.FatherPhoneNumber = parseInt($scope.newAdmission.FatherPhoneNumber);
                                        $scope.newAdmission.MotherPhoneNumber = parseInt($scope.newAdmission.MotherPhoneNumber);
                                        $scope.newAdmission.TotalFees = parseInt($scope.newAdmission.TotalFees);
                                        $scope.newAdmission.FeesPaid = parseInt($scope.newAdmission.FeesPaid);
                                        $scope.newAdmission.DateOfBirth = new Date($scope.newAdmission.DateOfBirth);
                                        $scope.getBranches($scope.newAdmission.CourseId);
                                        $scope.getSemesters($scope.newAdmission.BranchId);
                                        $scope.getClasses($scope.newAdmission.SemesterId);
                                    }
                                }, function(error) {
                                    toastr.error(error);
                                })
                        } else if ($scope.param == 2) {
                            $scope.enquiry = EnquiriesFactory.selectedEnquiry;
                            EnquiriesFactory.getEnquiryDetails($scope.enquiry.Id)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.error(success.data.Message);
                                    } else {
                                        $scope.newAdmission = success.data.Data;
                                        $scope.newAdmission.Id = null;
                                        $scope.newAdmission.Payment = [];
                                        $scope.newAdmission.PhoneNumber = parseInt($scope.newAdmission.PhoneNumber);
                                        $scope.newAdmission.AadhaarNumber = parseInt($scope.newAdmission.AadhaarNumber);
                                        $scope.newAdmission.FatherPhoneNumber = parseInt($scope.newAdmission.FatherPhoneNumber);
                                        $scope.newAdmission.MotherPhoneNumber = parseInt($scope.newAdmission.MotherPhoneNumber);
                                        $scope.newAdmission.TotalFees = parseInt($scope.newAdmission.TotalFees);
                                        $scope.newAdmission.FeesPaid = parseInt($scope.newAdmission.FeesPaid);
                                        $scope.newAdmission.DateOfBirth = new Date($scope.newAdmission.DateOfBirth);
                                        $scope.newAdmission.EnquiryId = $scope.enquiry.Id;
                                        $scope.getBranches($scope.newAdmission.CourseId);
                                        $scope.getSemesters($scope.newAdmission.BranchId);
                                    }
                                }, function(error) {
                                    toastr.error(error);
                                })
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.newAdmission.BranchId = null;
            $scope.newAdmission.SemesterId = null;
            $scope.newAdmission.ClassId = null;

            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.newAdmission.SemesterId = null;
            $scope.newAdmission.ClassId = null;

            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.newAdmission.ClassId = null;

            $scope.getClasses(semesterId);
        };

        $scope.addStudent = function() {
            if ($scope.newAdmission.Name == null ||
                $scope.newAdmission.FatherName == null ||
                $scope.newAdmission.GenderId == null ||
                $scope.newAdmission.SemesterId == null ||
                $scope.newAdmission.BranchId == null ||
                $scope.newAdmission.ClassId == null ||
                $scope.newAdmission.CourseId == null ||
                $scope.newAdmission.DateOfBirth == null
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newAdmission.DateOfBirth = moment($scope.newAdmission.DateOfBirth).format("YYYY-MM-DD");
                console.log($scope.newAdmission);
                StudentsFactory.admitStudent($scope.newAdmission)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Admission was done Successfully');
                            $scope.newAdmission = {
                                Id: null,
                                CollegeId: SignInFactory.loggedInUser.CollegeId,
                                Name: null,
                                GenderId: null,
                                CourseId: null,
                                SemesterId: null,
                                BranchId: null,
                                ClassId: null,
                                DateOfBirth: null,
                                AadhaarNumber: null,
                                FatherName: null,
                                FatherOccupation: null,
                                MotherName: null,
                                MotherOccupation: null,
                                FatherPhoneNumber: null,
                                MotherPhoneNumber: null,
                                PhoneNumber: null,
                                Email: null,
                                Address: null,
                                TotalFees: null,
                                Remarks: null,
                                EnquiryId: null,
                                Payment: []
                            };
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.updateStudent = function() {
            if ($scope.newAdmission.Name == null ||
                $scope.newAdmission.FatherName == null ||
                $scope.newAdmission.GenderId == null ||
                $scope.newAdmission.SemesterId == null ||
                $scope.newAdmission.BranchId == null ||
                $scope.newAdmission.ClassId == null ||
                $scope.newAdmission.CourseId == null ||
                $scope.newAdmission.DateOfBirth == null
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newAdmission.DateOfBirth = moment($scope.newAdmission.DateOfBirth).format("YYYY-MM-DD");
                for (var i = 0; i < $scope.newAdmission.Payment.length; i++) {
                    $scope.newAdmission.Payment[i].PaymentDate = moment($scope.newAdmission.Payment[i].PaymentDate).format("YYYY-MM-DD");
                }
                StudentsFactory.updateStudent($scope.newAdmission)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Student was updated Successfully');
                            $state.go('Students', { isPersisted: 0 });
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getBranches = function(courseId) {
            LookupFactory.getAllBranches(courseId, SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getSemesters = function(branchId) {
            LookupFactory.getAllSemesters(branchId, SignInFactory.loggedInUser.CollegeId, $scope.newAdmission.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getClasses = function(semesterId) {
            LookupFactory.getAllClasses($scope.newAdmission.BranchId, semesterId, SignInFactory.loggedInUser.CollegeId, $scope.newAdmission.CourseId, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addPayment = function() {
            if ($scope.newPayment.PaymentMode == null || $scope.newPayment.PaymentMode == "" ||
                $scope.newPayment.FeesPaid == null || $scope.newPayment.FeesPaid == undefined ||
                $scope.newPayment.PaymentDate == null || $scope.newPayment.PaymentDate == "") {
                toastr.warning('Please enter all the payment details');
            } else {
                $scope.newPayment.PaymentDate = moment($scope.newPayment.PaymentDate).format("YYYY-MM-DD");
                $scope.newAdmission.Payment.push($scope.newPayment);
                $scope.newPayment = {
                    Id: null,
                    AdmissionId: null,
                    PaymentMode: null,
                    FeesPaid: null,
                    PaymentModeNumber: null,
                    PaymentDate: null
                };
            }
        };

        $scope.deletePayment = function(index) {
            $scope.newAdmission.Payment.splice(index, 1);
        };

        $scope.getAllCourses();
        $scope.getAllGenders();
    })