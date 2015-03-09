///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />

module expenseApp.expenses {
    'use strict';

    class ExpensesController {

        employees = [];
        filteredEmployees = [];
        pagedEmployees = [];
        filteredCount: number = 0;
        searchText: string = null;

        //paging
        totalRecords: number = 0;
        pageSize: number = 5;
        currentPage: number = 1;
        numRecordsDisplaying: number;

        static $inject = ['$filter', '$window', 'expenseApp.services.dataService'];
        constructor(private $filter: ng.IFilterService, private $window: ng.IWindowService,
            private dataService: expenseApp.services.DataService) {
            this.getEmployeesAndExpenses();
        }

        pageChanged(page) {
            this.currentPage = page;
            this.pageRecords();
        }

        searchTextChanged() {
            this.filterEmployeesExpenses(this.searchText);
        }

        filterEmployeesExpenses(filterText) {
            this.filteredEmployees = this.$filter('nameExpenseFilter')(this.employees, filterText);
            this.filteredCount = this.filteredEmployees.length;

            //Factor in paging
            this.currentPage = 1;
            this.totalRecords = this.filteredCount;
            this.pageRecords();
        }

        pageRecords() {
            var useFiltered = this.searchText && this.searchText.length > 0,
                pageStart = (this.currentPage - 1) * this.pageSize,
                pageEnd = pageStart + this.pageSize;

            if (useFiltered) {
                if (pageEnd > this.filteredCount) { pageEnd = this.filteredCount; }
            } else {
                if (pageEnd > this.employees.length) { pageEnd = this.employees.length; }
                this.totalRecords = this.employees.length;
            }

            this.pagedEmployees = (useFiltered) ? this.filteredEmployees.slice(pageStart, pageEnd)
                                                : this.employees.slice(pageStart, pageEnd);
            this.numRecordsDisplaying = this.pagedEmployees.length;
        }

        getEmployeesAndExpenses() {
            this.dataService.getEmployeesAndExpenses()
                .then((employees: shared.IEmployee[]) => {
                        this.totalRecords = employees.length;
                        this.employees = employees;
                        this.filterEmployeesExpenses('');
                   }, (error) => {
                        this.$window.alert(error.message);
                });
        }
    }

    angular.module('expenseApp').controller('expenseApp.expenses.ExpensesController', ExpensesController);

}



