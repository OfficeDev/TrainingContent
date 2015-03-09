///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />

module expenseApp.expenses {
  'use strict';

  class ExpenseReceiptController {
    employeeId:number = 0;
    expense:shared.IExpense = {};
    receipts:shared.IReceipt[] = [];
    selectedReceipt:shared.IReceipt = {};
    oneDriveFolder:string = '';

    static $inject = ['$q', '$window', '$location', '$routeParams',
      'expenseApp.services.dataService', 'expenseApp.services.filesService'];

    constructor(private $q:ng.IQService, private $window:ng.IWindowService, private $location:ng.ILocationService,
                private $routeParams:IExpenseRouteParams,
                private dataService:expenseApp.services.DataService,
                private fileService:expenseApp.services.FilesService) {

      this.employeeId = (this.$routeParams.employeeId) ? parseInt(this.$routeParams.employeeId, 10) : 0;
      this.expense.id = (this.$routeParams.expenseId) ? parseInt(this.$routeParams.expenseId, 10) : 0;

      this.getExpenses(this.expense);
      this.getReceipts();
      this.getReceiptsUrl();

    }

    getExpenses(expense) {
      return this.dataService.getExpense(expense.id).then((expense:shared.IExpense) => {
        this.expense = expense;
      });
    }

    getReceipts() {
      return this.fileService.getUserFiles().then((results:Array<any>) => {
        this.receipts = results;
      });
    }

    getReceiptsUrl() {
      return this.fileService.getReceiptsFolderPath().then((receiptsFolderUrl:string) => {
        this.oneDriveFolder = receiptsFolderUrl;
      });
    }

    saveReceipt() {
      return this.dataService.addReceiptToExpense(this.expense, this.selectedReceipt.webUrl)
        .then((result) => {
          this.$location.path('/employeeExpenses/' + this.employeeId);
        });
    }
  }

  angular.module('expenseApp').controller('expenseApp.expenses.ExpenseReceiptController', ExpenseReceiptController);

}