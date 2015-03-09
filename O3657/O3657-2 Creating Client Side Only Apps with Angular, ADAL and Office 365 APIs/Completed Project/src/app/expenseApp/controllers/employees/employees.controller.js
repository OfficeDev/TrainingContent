///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var employees;
    (function (employees) {
        var EmployeesController = (function () {
            function EmployeesController($location, $filter, $window, $timeout, dataService, modalService) {
                this.$location = $location;
                this.$filter = $filter;
                this.$window = $window;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.modalService = modalService;
                this.employees = [];
                this.filteredEmployees = [];
                this.pagedEmployees = [];
                this.filteredCount = 0;
                this.orderby = 'lastName';
                this.reverse = false;
                this.searchText = null;
                this.cardAnimationClass = 'card-animation';
                this.DisplayMode = {
                    Card: 0,
                    List: 1
                };
                //paging
                this.totalRecords = 0;
                this.pageSize = 10;
                this.currentPage = 1;
                this.getEmployeesSummary();
            }
            EmployeesController.prototype.pageChanged = function (page) {
                this.currentPage = page;
                this.pageRecords();
            };
            EmployeesController.prototype.deleteEmployee = function (id) {
                var _this = this;
                var emp = this.getEmployeeById(id);
                var empName = emp.firstName + ' ' + emp.lastName;
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Delete Employee',
                    headerText: 'Delete ' + empName + '?',
                    bodyText: 'Are you sure you want to delete this employee?'
                };
                this.modalService.showModal({}, modalOptions).then(function (result) {
                    if (result === 'ok') {
                        _this.dataService.deleteEmployee(emp).then(function () {
                            for (var i = 0; i < _this.employees.length; i++) {
                                if (_this.employees[i].id === id) {
                                    _this.employees.splice(i, 1);
                                    break;
                                }
                            }
                            _this.filterEmployees();
                        }, function (error) {
                            _this.$window.alert('Error deleting employee: ' + error.message);
                        });
                    }
                });
            };
            EmployeesController.prototype.changeDisplayMode = function (displayMode) {
                switch (displayMode) {
                    case this.DisplayMode.Card:
                        this.listDisplayModeEnabled = false;
                        break;
                    case this.DisplayMode.List:
                        this.listDisplayModeEnabled = true;
                        break;
                }
            };
            EmployeesController.prototype.navigate = function (url) {
                this.$location.path(url);
            };
            EmployeesController.prototype.setOrder = function (orderby) {
                if (orderby === this.orderby) {
                    this.reverse = !this.reverse;
                }
                this.orderby = orderby;
            };
            EmployeesController.prototype.searchTextChanged = function () {
                this.filterEmployees();
            };
            EmployeesController.prototype.getEmployeesSummary = function () {
                var _this = this;
                this.dataService.getEmployeesSummary(this.currentPage - 1, this.pageSize).then(function (data) {
                    _this.totalRecords = data.totalRecords;
                    _this.employees = data.results;
                    _this.filterEmployees(); //Trigger initial filter
                    _this.$timeout(function () {
                        _this.cardAnimationClass = ''; //Turn off animation
                    }, 1000);
                }, function (error) {
                    _this.$window.alert('Sorry, an error occurred: ' + error.data.message);
                });
            };
            EmployeesController.prototype.filterEmployees = function () {
                this.filteredEmployees = this.$filter('nameCityStateFilter')(this.employees, this.searchText);
                this.filteredCount = this.filteredEmployees.length;
                //Factor in paging
                this.currentPage = 1;
                this.totalRecords = this.filteredCount;
                this.pageRecords();
            };
            EmployeesController.prototype.pageRecords = function () {
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
                this.pagingInfo = {
                    currentPage: this.currentPage,
                    totalRecords: this.totalRecords,
                    pageStart: pageStart,
                    pageEnd: pageEnd,
                    pagedEmployeeLength: this.pagedEmployees.length,
                    numRecordsDisplaying: this.numRecordsDisplaying
                };
            };
            EmployeesController.prototype.getEmployeeById = function (id) {
                for (var i = 0; i < this.employees.length; i++) {
                    var emp = this.employees[i];
                    if (emp.id === id) {
                        return emp;
                    }
                }
                return null;
            };
            EmployeesController.$inject = ['$location', '$filter', '$window', '$timeout', 'expenseApp.services.dataService', 'expenseApp.services.modalService'];
            return EmployeesController;
        })();
        angular.module('expenseApp').controller('expenseApp.employees.EmployeesController', EmployeesController);
    })(employees = expenseApp.employees || (expenseApp.employees = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=employees.controller.js.map