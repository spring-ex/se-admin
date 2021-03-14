'use strict';

angular.module('smartAdminApp')
    .controller('AddDocumentsToCollegeController', function($scope, AddDocumentsToCollegeFactory, SuperUserFactory, toastr) {

        $scope.documents = [];
        $scope.selectedDocuments = [];
        $scope.college = [];
        $scope.selected = {
            CollegeId: null
        };

        $scope.getAllDocuments = function() {
            AddDocumentsToCollegeFactory.getAllDocuments()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.documents = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllColleges = function() {
            $scope.colleges = [];
            SuperUserFactory.getAllColleges()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.colleges = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllDocumentsForCollege = function() {
            $scope.clearSelection();
            AddDocumentsToCollegeFactory.getDocumentsForCollege($scope.selected.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.selectedDocuments = success.data.Data;
                        for (var i = 0; i < $scope.documents.length; i++) {
                            for (var j = 0; j < $scope.selectedDocuments.length; j++) {
                                if ($scope.documents[i].Id == $scope.selectedDocuments[j].Id) {
                                    $scope.documents[i].isChecked = true;
                                }
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addOrRemoveDocument = function(document) {
            var obj = {
                CollegeId: $scope.selected.CollegeId,
                DocumentId: document.Id,
                Type: document.isChecked ? 1 : 0
            };
            AddDocumentsToCollegeFactory.addDocumentToCollege(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.getDocumentsForCollege();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.clearSelection = function() {
            for (var i = 0; i < $scope.documents.length; i++) {
                $scope.documents[i].isChecked = false;
            }
        };

        $scope.getAllColleges();
        $scope.getAllDocuments();

    });