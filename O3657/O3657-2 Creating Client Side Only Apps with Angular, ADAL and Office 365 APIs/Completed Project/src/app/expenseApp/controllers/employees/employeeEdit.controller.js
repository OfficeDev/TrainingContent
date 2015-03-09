///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var employees;
    (function (employees) {
        'use strict';
        var EmployeeEditController = (function () {
            function EmployeeEditController($scope, $location, $routeParams, $timeout, dataService, modalService) {
                var _this = this;
                this.$scope = $scope;
                this.$location = $location;
                this.$routeParams = $routeParams;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.modalService = modalService;
                this.employee = {};
                this.states = [];
                this.updateStatus = false;
                this.errorMessage = '';
                this.employeeId = (this.$routeParams.employeeId) ? parseInt(this.$routeParams.employeeId, 10) : 0;
                this.employee.id = this.employeeId;
                this.title = (this.employeeId > 0) ? 'Edit' : 'Add';
                this.buttonText = (this.employeeId > 0) ? 'Update' : 'Add';
                this.getStates().then(function () {
                    if (_this.employeeId > 0) {
                        _this.dataService.getEmployee(_this.employeeId).then(function (employee) {
                            _this.employee = employee;
                        }, _this.processError);
                    }
                });
                //Make sure they're warned if they made a change but didn't save it
                //Call to $on returns a "deregistration" function that can be called to
                //remove the listener (see routeChange() for an example of using it)
                this.onRouteChangeOff = this.$scope.$on('$locationChangeStart', this.routeChange.bind(this));
            }
            EmployeeEditController.prototype.isStateSelected = function (employeeStateId, stateId) {
                return employeeStateId === stateId;
            };
            EmployeeEditController.prototype.saveEmployee = function () {
                var _this = this;
                if (this.$scope.editForm.$valid) {
                    if (!this.employee.id) {
                        this.dataService.insertEmployee(this.employee).then(function (insertedEmployee) {
                            _this.employee = insertedEmployee;
                            _this.processSuccess();
                        }, this.processError);
                    }
                    else {
                        this.dataService.updateEmployee(this.employee).then(function (metadata) {
                            _this.employee.__metadata = metadata;
                            _this.processSuccess();
                        }, this.processError.bind(this));
                    }
                }
            };
            EmployeeEditController.prototype.deleteEmployee = function () {
                var _this = this;
                var empName = this.employee.firstName + ' ' + this.employee.lastName;
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Delete Employee',
                    headerText: 'Delete ' + empName + '?',
                    bodyText: 'Are you sure you want to delete this employee?'
                };
                this.modalService.showModal({}, modalOptions).then(function (result) {
                    if (result === 'ok') {
                        _this.dataService.deleteEmployee(_this.employee).then(function () {
                            _this.onRouteChangeOff(); //Stop listening for location changes
                            _this.$location.path('/employees');
                        }, _this.processError);
                    }
                });
            };
            EmployeeEditController.prototype.routeChange = function (event, newUrl) {
                var _this = this;
                //Navigate to newUrl if the form isn't dirty
                if (!this.editForm || !this.editForm.$dirty) {
                    return;
                }
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ignore Changes',
                    headerText: 'Unsaved Changes',
                    bodyText: 'You have unsaved changes. Leave the page?'
                };
                this.modalService.showModal({}, modalOptions).then(function (result) {
                    if (result === 'ok') {
                        _this.onRouteChangeOff(); //Stop listening for location changes
                        _this.$location.path(_this.$location.url(newUrl).hash()); //Go to page they're interested in
                    }
                });
                //prevent navigation by default since we'll handle it
                //once the user selects a dialog option
                event.preventDefault();
                return;
            };
            EmployeeEditController.prototype.getStates = function () {
                var _this = this;
                return this.dataService.getStates().then(function (states) {
                    _this.states = states;
                }, this.processError);
            };
            EmployeeEditController.prototype.processSuccess = function () {
                //this.$scope.editForm.$dirty = false;
                this.updateStatus = true;
                this.title = 'Edit';
                this.buttonText = 'Update';
                this.startTimer();
            };
            EmployeeEditController.prototype.processError = function (error) {
                this.errorMessage = error.message;
                this.startTimer();
            };
            EmployeeEditController.prototype.startTimer = function () {
                var _this = this;
                this.timer = this.$timeout(function () {
                    _this.$timeout.cancel(_this.timer);
                    _this.errorMessage = '';
                    _this.updateStatus = false;
                }, 3000);
            };
            EmployeeEditController.$inject = ['$scope', '$location', '$routeParams', '$timeout', 'expenseApp.services.dataService', 'expenseApp.services.modalService'];
            return EmployeeEditController;
        })();
        angular.module('expenseApp').controller('expenseApp.employees.EmployeeEditController', EmployeeEditController);
    })(employees = expenseApp.employees || (expenseApp.employees = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=employeeEdit.controller.js.map