'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # EnquiriesController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('EnquiriesController', function ($scope, $state, SignInFactory, EnquiriesFactory, toastr, $uibModal, $filter) {

        $scope.enquiries = [];
        $scope.search = {
            text: ""
        };
        $scope.selected = {
            enquiries: [],
            all: false
        };
        $scope.ltjs = [{
            Id: "Yes",
            Name: 'Yes'
        }, {
            Id: "No",
            Name: 'No'
        }, {
            Id: "Maybe",
            Name: 'Maybe'
        }];
        $scope.loggedInUser = SignInFactory.loggedInUser;
        $scope.getAllEnquiries = function () {
            EnquiriesFactory.getAllEnquiries(SignInFactory.loggedInUser.CollegeId)
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                        $scope.enquiries = success.data.Data;
                    } else {
                        $scope.enquiries = success.data.Data;
                        $scope.searchableEnquiries = $scope.enquiries;
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.likelyToJoinChanged = function (id, value) {
            var obj = {
                Id: id,
                Value: value
            };
            EnquiriesFactory.updateEnquiry(obj)
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Updation successful');
                        $scope.getAllEnquiries();
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.allEnquiriesSelected = function () {
            if ($scope.selected.all) {
                for (var i = 0; i < $scope.enquiries.length; i++) {
                    $scope.enquiries[i].selected = true;
                }
            } else {
                for (var i = 0; i < $scope.enquiries.length; i++) {
                    $scope.enquiries[i].selected = false;
                }
            }
        };

        $scope.addEnquiry = function () {
            $state.go("AddEnquiry");
        };

        $scope.searchEnquiry = function () {
            $scope.enquiries = $filter('filter')($scope.searchableEnquiries, $scope.search.text);
        };

        $scope.sendSMS = function () {
            $scope.phoneNumbers = [];
            for (var i = 0; i < $scope.enquiries.length; i++) {
                if ($scope.enquiries[i].selected) {
                    $scope.phoneNumbers.push($scope.enquiries[i].PhoneNumber);
                }
            }
            if ($scope.phoneNumbers.length == 0) {
                toastr.warning('Please select an enquiry to send sms');
            } else {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'templates/SendSMSTemplate.html',
                    controller: 'SendSMSController',
                    resolve: {
                        phoneNumbers: function () {
                            return $scope.phoneNumbers;
                        }
                    }
                });

                modalInstance.result.then(function (response) {
                    toastr.success(response);
                }, function () {
                    console.log('Cancelled');
                });
            }
        };

        $scope.admitStudent = function (enquiry) {
            EnquiriesFactory.selectedEnquiry = enquiry;
            $state.go("AddOrEditStudent", { param: 2, studentId: null });
        };

        $scope.delete = function(enquiry){
            EnquiriesFactory.deleteEnquiry(enquiry)
            .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Enquiry deleted successfully');
                        $scope.getAllEnquiries();
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.getAllEnquiries();

    })
    .controller('SendSMSController', function ($scope, $state, phoneNumbers, $uibModalInstance, EnquiriesFactory, toastr) {
        $scope.phoneNumbersToShow = phoneNumbers.join(", ");
        $scope.sendSms = {
            PhoneNumbers: phoneNumbers,
            Message: null
        };

        $scope.ok = function () {
            EnquiriesFactory.sendSms($scope.sendSms)
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $uibModalInstance.close('SMS Sent Successfully');
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$watch('sendSms.Message', function (newVal, oldVal) {
            if (newVal != undefined && newVal.length > 160) {
                $scope.sendSms.Message = oldVal;
            }
        });
    });