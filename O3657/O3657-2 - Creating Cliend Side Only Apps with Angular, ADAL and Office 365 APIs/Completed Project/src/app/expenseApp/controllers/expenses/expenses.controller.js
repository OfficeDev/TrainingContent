///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var expenses;
    (function (expenses) {
        'use strict';
        var ExpensesController = (function () {
            function ExpensesController($filter, $window, dataService) {
                this.$filter = $filter;
                this.$window = $window;
                this.dataService = dataService;
                this.employees = [];
                this.filteredEmployees = [];
                this.pagedEmployees = [];
                this.filteredCount = 0;
                this.searchText = null;
                //paging
                this.totalRecords = 0;
                this.pageSize = 5;
                this.currentPage = 1;
                this.getEmployeesAndExpenses();
            }
            ExpensesController.prototype.pageChanged = function (page) {
                this.currentPage = page;
                this.pageRecords();
            };
            ExpensesController.prototype.searchTextChanged = function () {
                this.filterEmployeesExpenses(this.searchText);
            };
            ExpensesController.prototype.filterEmployeesExpenses = function (filterText) {
                this.filteredEmployees = this.$filter('nameExpenseFilter')(this.employees, filterText);
                this.filteredCount = this.filteredEmployees.length;
                //Factor in paging
                this.currentPage = 1;
                this.totalRecords = this.filteredCount;
                this.pageRecords();
            };
            ExpensesController.prototype.pageRecords = function () {
                var useFiltered = this.searchText && this.searchText.length > 0, pageStart = (this.currentPage - 1) * this.pageSize, pageEnd = pageStart + this.pageSize;
                if (useFiltered) {
                    if (pageEnd > this.filteredCount) {
                        pageEnd = this.filteredCount;
                    }
                }
                else {
                    if (pageEnd > this.employees.length) {
                        pageEnd = this.employees.length;
                    }
                    this.totalRecords = this.employees.length;
                }
                this.pagedEmployees = (useFiltered) ? this.filteredEmployees.slice(pageStart, pageEnd) : this.employees.slice(pageStart, pageEnd);
                this.numRecordsDisplaying = this.pagedEmployees.length;
            };
            ExpensesController.prototype.getEmployeesAndExpenses = function () {
                var _this = this;
                this.dataService.getEmployeesAndExpenses().then(function (employees) {
                    _this.totalRecords = employees.length;
                    _this.employees = employees;
                    _this.filterEmployeesExpenses('');
                }, function (error) {
                    _this.$window.alert(error.message);
                });
            };
            ExpensesController.$inject = ['$filter', '$window', 'expenseApp.services.dataService'];
            return ExpensesController;
        })();
        angular.module('expenseApp').controller('expenseApp.expenses.ExpensesController', ExpensesController);
    })(expenses = expenseApp.expenses || (expenseApp.expenses = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=expenses.controller.js.map