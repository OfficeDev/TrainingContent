///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />

module expenseApp.employees {
    'use strict';

    interface IEditFormScope extends ng.IScope {
        editForm: ng.IFormController;
    }

    class EmployeeEditController {

        employeeId: number;
        timer;
        onRouteChangeOff;

        editForm;
        employee: shared.IEmployee = {};
        states: shared.IState[] = [];
        title: string;
        buttonText: string;
        updateStatus: boolean = false;
        errorMessage: string = '';

        static $inject = ['$scope', '$location', '$routeParams', '$timeout',
                          'expenseApp.services.dataService', 'expenseApp.services.modalService'];
        constructor(private $scope: IEditFormScope, private $location: ng.ILocationService,
                    private $routeParams: IEmployeeRouteParams, private $timeout: ng.ITimeoutService,
                    private dataService: expenseApp.services.DataService,
                    private modalService: expenseApp.services.ModalService) {

            this.employeeId = (this.$routeParams.employeeId) ? parseInt(this.$routeParams.employeeId, 10) : 0;
            this.employee.id = this.employeeId;
            this.title = (this.employeeId > 0) ? 'Edit' : 'Add';
            this.buttonText = (this.employeeId > 0) ? 'Update' : 'Add';

            this.getStates().then(() => {
                if (this.employeeId > 0) {
                    this.dataService.getEmployee(this.employeeId).then((employee: shared.IEmployee[]) => {
                        this.employee = employee;
                    }, this.processError);
                }
            });

            //Make sure they're warned if they made a change but didn't save it
            //Call to $on returns a "deregistration" function that can be called to
            //remove the listener (see routeChange() for an example of using it)
            this.onRouteChangeOff = this.$scope.$on('$locationChangeStart', this.routeChange.bind(this));
        }

        isStateSelected(employeeStateId, stateId) {
            return employeeStateId === stateId;
        }

        saveEmployee() {
            if (this.$scope.editForm.$valid) {
                if (!this.employee.id) {
                    this.dataService.insertEmployee(this.employee).then((insertedEmployee: shared.IEmployee) => {
                        this.employee = insertedEmployee;
                        this.processSuccess();
                    },
                    this.processError);
                } else {
                    this.dataService.updateEmployee(this.employee).then((metadata) => {
                        this.employee.__metadata = metadata;
                        this.processSuccess();
                    },
                    this.processError.bind(this));
                }
            }
        }

        deleteEmployee() {
            var empName = this.employee.firstName + ' ' + this.employee.lastName;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Employee',
                headerText: 'Delete ' + empName + '?',
                bodyText: 'Are you sure you want to delete this employee?'
            };

            this.modalService.showModal({}, modalOptions).then((result) => {
                if (result === 'ok') {
                    this.dataService.deleteEmployee(this.employee).then(() => {
                        this.onRouteChangeOff(); //Stop listening for location changes
                        this.$location.path('/employees');
                    }, this.processError);
                }
            });
        }

        routeChange(event, newUrl) {
            //Navigate to newUrl if the form isn't dirty
            if (!this.editForm || !this.editForm.$dirty) { return; }

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ignore Changes',
                headerText: 'Unsaved Changes',
                bodyText: 'You have unsaved changes. Leave the page?'
            };

            this.modalService.showModal({}, modalOptions).then((result) => {
                if (result === 'ok') {
                    this.onRouteChangeOff(); //Stop listening for location changes
                    this.$location.path(this.$location.url(newUrl).hash()); //Go to page they're interested in
                }
            });

            //prevent navigation by default since we'll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        getStates() {
            return this.dataService.getStates().then((states: shared.IState[]) => {
                this.states = states;
            }, this.processError);
        }

        processSuccess() {
            //this.$scope.editForm.$dirty = false;
            this.updateStatus = true;
            this.title = 'Edit';
            this.buttonText = 'Update';
            this.startTimer();
        }

        processError(error) {
            this.errorMessage = error.message;
            this.startTimer();
        }

        startTimer() {
            this.timer = this.$timeout(() => {
                this.$timeout.cancel(this.timer);
                this.errorMessage = '';
                this.updateStatus = false;
            }, 3000);
        }
    }

    angular.module('expenseApp').controller('expenseApp.employees.EmployeeEditController', EmployeeEditController);

}
