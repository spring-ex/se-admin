'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp
 * @description
 * # SignInController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('ExpensesController', function ($scope, $state, toastr, $uibModal, SignInFactory, ExpensesFactory) {

        $scope.expenses = [];
        $scope.selected = {
            CollegeId: SignInFactory.loggedInUser.CollegeId,
            DateRange: {
                startDate: moment().subtract(3, 'months'),
                endDate: moment()
            }
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(),
            minDate: new Date(2017, 1, 1),
            startingDay: 1
        };

        $scope.sumOfExpenses = 0;

        $scope.options = {
            locale: {
                applyLabel: "Apply",
                fromLabel: "From",
                format: "DD-MMM-YYYY",
                toLabel: "To",
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            startDate: moment().subtract(3, 'month'),
            endDate: moment(),
            opens: 'right',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        };

        $scope.addExpense = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/AddExpense.html',
                controller: 'AddExpenseController'
            });

            modalInstance.result.then(function (response) {
                $scope.getAllExpenses();
            }, function () {
                console.log('Cancelled');
            });
        };

        $scope.getAllExpenses = function () {
            $scope.expenses = [];
            ExpensesFactory.getAllExpenses($scope.selected)
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.expenses = success.data.Data;
                        $scope.sumOfExpenses = 0;
                        for (var i = 0; i < $scope.expenses.length; i++) {
                            $scope.sumOfExpenses += $scope.expenses[i].Amount;
                        }
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.deleteExpense = function (expense) {
            ExpensesFactory.deleteExpense(expense)
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Expenses deleted successfully');
                        $scope.getAllExpenses($scope.selected.BranchId);
                    }
                }, function (error) {
                    toastr.error(error);
                });
        };

        $scope.$watch('selected.DateRange', function (newValue, oldValue) {
            if (newValue != undefined && newValue != null) {
                $scope.getAllExpenses();
            }
        });

        $scope.exportToXLS = function () {
            var data_type = 'data:application/vnd.ms-excel';
            var table_div = document.getElementById('expenses-list');
            var table_html = table_div.outerHTML.replace(/ /g, '%20');

            var a = document.createElement('a');
            a.href = data_type + ', ' + table_html;
            a.download = 'Expenses[' + moment($scope.selected.DateRange.startDate).format('DD/MM/YY') + ' to ' + moment($scope.selected.DateRange.endDate).format('DD/MM/YY') + '].xls';
            a.click();
        };

    }).controller('AddExpenseController', function ($scope, $uibModalInstance, ExpensesFactory, toastr, SignInFactory) {

        $scope.newExpense = {
            CollegeId: SignInFactory.loggedInUser.CollegeId,
            Amount: null,
            Particulars: null,
            ExpenseDate: null
        };

        $scope.ok = function () {
            if ($scope.newExpense.Amount == null || $scope.newExpense.Amount == undefined || $scope.newExpense.Particulars == "" || $scope.newExpense.ExpenseDate == null) {
                toastr.warning('Please enter all the required information');
            } else {
                $scope.newExpense.ExpenseDate = moment($scope.newExpense.ExpenseDate).add(1, 'days').toISOString();
                ExpensesFactory.addExpense($scope.newExpense)
                    .then(function (success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Expenses added successfully');
                            $uibModalInstance.close();
                        }
                    }, function (error) {
                        toastr.error(error);
                    });
            }

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });