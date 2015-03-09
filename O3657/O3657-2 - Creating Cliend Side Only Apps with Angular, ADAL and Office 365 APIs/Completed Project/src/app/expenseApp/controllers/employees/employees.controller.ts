///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />

module expenseApp.employees {

    interface IPagingInfo {
        currentPage: number;
        totalRecords: number;
        pageStart: number;
        pageEnd: number;
        pagedEmployeeLength: number;
        numRecordsDisplaying: number;
    }

    class EmployeesController {

        employees = [];
        filteredEmployees = [];
        pagedEmployees = [];
        filteredCount: number = 0;
        orderby: string = 'lastName';
        reverse: boolean = false;
        searchText: string = null;
        cardAnimationClass: string = 'card-animation';
        listDisplayModeEnabled: boolean;
        pagingInfo: any;
        DisplayMode = {
            Card: 0,
            List: 1
        };

        //paging
        totalRecords: number = 0;
        pageSize: number = 10;
        currentPage: number = 1;
        numRecordsDisplaying: number;

        static $inject = ['$location', '$filter', '$window', '$timeout',
                          'expenseApp.services.dataService', 'expenseApp.services.modalService'];
        constructor(private $location: ng.ILocationService, private $filter: ng.IFilterService,
                    private $window: ng.IWindowService, private $timeout: ng.ITimeoutService,
                    private dataService, private modalService) {
            this.getEmployeesSummary();
        }

        pageChanged(page) {
            this.currentPage = page;
            this.pageRecords();
        }

        deleteEmployee(id) {

            var emp = this.getEmployeeById(id);
            var empName = emp.firstName + ' ' + emp.lastName;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Employee',
                headerText: 'Delete ' + empName + '?',
                bodyText: 'Are you sure you want to delete this employee?'
            };

            this.modalService.showModal({}, modalOptions).then((result) => {
                if (result === 'ok') {
                    this.dataService.deleteEmployee(emp).then(() => {
                        for (var i = 0; i < this.employees.length; i++) {
                            if (this.employees[i].id === id) {
                                this.employees.splice(i, 1);
                                break;
                            }
                        }
                        this.filterEmployees();
                    }, (error) => {
                        this.$window.alert('Error deleting employee: ' + error.message);
                    });
                }
            });
        }

        changeDisplayMode(displayMode) {
            switch (displayMode) {
                case this.DisplayMode.Card:
                    this.listDisplayModeEnabled = false;
                    break;
                case this.DisplayMode.List:
                    this.listDisplayModeEnabled = true;
                    break;
            }
        }

        navigate(url) {
            this.$location.path(url);
        }

        setOrder(orderby) {
            if (orderby === this.orderby) {
                this.reverse = !this.reverse;
            }
            this.orderby = orderby;
        }

        searchTextChanged() {
            this.filterEmployees();
        }

        getEmployeesSummary() {
            this.dataService.getEmployeesSummary(this.currentPage - 1, this.pageSize)
            .then((data) => {
                this.totalRecords = data.totalRecords;
                this.employees = data.results;
                this.filterEmployees(); //Trigger initial filter

                this.$timeout(() => {
                    this.cardAnimationClass = ''; //Turn off animation
                }, 1000);

            }, (error: shared.IHttpPromiseCallbackErrorArg) => {
                this.$window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }

        filterEmployees() {
            this.filteredEmployees = this.$filter('nameCityStateFilter')(this.employees, this.searchText);
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
            this.pagingInfo = {
                currentPage: this.currentPage,
                totalRecords: this.totalRecords,
                pageStart: pageStart,
                pageEnd: pageEnd,
                pagedEmployeeLength: this.pagedEmployees.length,
                numRecordsDisplaying: this.numRecordsDisplaying
            };
        }

        getEmployeeById(id) {
            for (var i = 0; i < this.employees.length; i++) {
                var emp = this.employees[i];
                if (emp.id === id) {
                    return emp;
                }
            }
            return null;
        }

    }

    angular.module('expenseApp').controller('expenseApp.employees.EmployeesController', EmployeesController);

}
