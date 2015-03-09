///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var expenses;
    (function (expenses) {
        'use strict';
        var ExpenseReceiptController = (function () {
            function ExpenseReceiptController($q, $window, $location, $routeParams, dataService, fileService) {
                this.$q = $q;
                this.$window = $window;
                this.$location = $location;
                this.$routeParams = $routeParams;
                this.dataService = dataService;
                this.fileService = fileService;
                this.employeeId = 0;
                this.expense = {};
                this.receipts = [];
                this.selectedReceipt = {};
                this.oneDriveFolder = '';
                this.employeeId = (this.$routeParams.employeeId) ? parseInt(this.$routeParams.employeeId, 10) : 0;
                this.expense.id = (this.$routeParams.expenseId) ? parseInt(this.$routeParams.expenseId, 10) : 0;
                this.getExpenses(this.expense);
                this.getReceipts();
                this.getReceiptsUrl();
            }
            ExpenseReceiptController.prototype.getExpenses = function (expense) {
                var _this = this;
                return this.dataService.getExpense(expense.id).then(function (expense) {
                    _this.expense = expense;
                });
            };
            ExpenseReceiptController.prototype.getReceipts = function () {
                var _this = this;
                return this.fileService.getUserFiles().then(function (results) {
                    _this.receipts = results;
                });
            };
            ExpenseReceiptController.prototype.getReceiptsUrl = function () {
                var _this = this;
                return this.fileService.getReceiptsFolderPath().then(function (receiptsFolderUrl) {
                    _this.oneDriveFolder = receiptsFolderUrl;
                });
            };
            ExpenseReceiptController.prototype.saveReceipt = function () {
                var _this = this;
                return this.dataService.addReceiptToExpense(this.expense, this.selectedReceipt.webUrl).then(function (result) {
                    _this.$location.path('/employeeExpenses/' + _this.employeeId);
                });
            };
            ExpenseReceiptController.$inject = ['$q', '$window', '$location', '$routeParams', 'expenseApp.services.dataService', 'expenseApp.services.filesService'];
            return ExpenseReceiptController;
        })();
        angular.module('expenseApp').controller('expenseApp.expenses.ExpenseReceiptController', ExpenseReceiptController);
    })(expenses = expenseApp.expenses || (expenseApp.expenses = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=expensesReceipt.controller.js.map