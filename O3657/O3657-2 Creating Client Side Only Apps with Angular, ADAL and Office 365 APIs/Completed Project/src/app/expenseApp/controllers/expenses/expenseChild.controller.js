///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var expenses;
    (function (expenses) {
        'use strict';
        var ExpenseChildController = (function () {
            function ExpenseChildController($scope, $window, $location, dataService, modalService) {
                var _this = this;
                this.$scope = $scope;
                this.$window = $window;
                this.$location = $location;
                this.dataService = dataService;
                this.modalService = modalService;
                this.orderby = 'product';
                this.reverse = false;
                this.expensesTotal = 0.00;
                //See if parent $scope has an employee that's inherited (ExpensesController)
                if (this.$scope.employee) {
                    this.employee = this.$scope.employee;
                    this.updateTotal(this.$scope.employee);
                }
                else {
                    this.$scope.$on('employee', function (event, employee) {
                        _this.employee = employee;
                        _this.updateTotal(employee);
                    });
                }
            }
            ExpenseChildController.prototype.setOrder = function (orderby) {
                if (orderby === this.orderby) {
                    this.reverse = !this.reverse;
                }
                this.orderby = orderby;
            };
            ExpenseChildController.prototype.updateTotal = function (employee) {
                if (employee && employee.expenses) {
                    var total = 0.00;
                    for (var i = 0; i < employee.expenses.length; i++) {
                        var order = employee.expenses[i];
                        total += order.orderTotal;
                    }
                    this.expensesTotal = total;
                }
            };
            ExpenseChildController.prototype.goAddReceipt = function (expense) {
                this.$location.path('/expensesAttachReceipt/' + this.employee.id + '/' + expense.id);
            };
            ExpenseChildController.prototype.goToReceipt = function (receiptUrl) {
                this.$window.open(receiptUrl);
            };
            ExpenseChildController.prototype.goRemoveReceipt = function (employee, expense) {
                var _this = this;
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Remove Receipt',
                    headerText: 'Remove Receipt from Expense?',
                    bodyText: 'Are you sure you want to remove this receipt from the expense?'
                };
                this.modalService.showModal({}, modalOptions).then(function (result) {
                    if (result === 'ok') {
                        _this.dataService.removeReceiptFromExpense(expense).then(function () {
                            // re-get the expenses
                            _this.dataService.getEmployeeExpenses(_this.employee.id).then(function (employee) {
                                _this.employee = employee;
                            });
                        });
                    }
                });
            };
            ExpenseChildController.$inject = ['$scope', '$window', '$location', 'expenseApp.services.dataService', 'expenseApp.services.modalService'];
            return ExpenseChildController;
        })();
        angular.module('expenseApp').controller('ExpenseChildController', ExpenseChildController);
    })(expenses = expenseApp.expenses || (expenseApp.expenses = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=expenseChild.controller.js.map