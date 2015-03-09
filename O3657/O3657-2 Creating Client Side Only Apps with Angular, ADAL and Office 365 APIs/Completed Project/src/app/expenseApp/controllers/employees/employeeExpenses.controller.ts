///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />

module expenseApp.employees {

    class EmployeeExpensesController {
        employeeId: number;
        employee = {};
        expensesTotal: number = 0.00;

        static $inject = ['$scope', '$routeParams', '$window', 'expenseApp.services.dataService'];
        constructor(private $scope: ng.IScope, private $routeParams: IEmployeeRouteParams,
                    private $window: ng.IWindowService, private dataService) {

            this.employeeId = (this.$routeParams.employeeId) ? parseInt(this.$routeParams.employeeId, 10) : 0;

            if (this.employeeId > 0) {
                this.dataService.getEmployeeExpenses(this.employeeId)
                .then((employee) => {
                    this.employee = employee;
                    $scope.$broadcast('employee', this.employee);
                }, (error) => {
                    this.$window.alert('Sorry, an error occurred: ' + error.message);
                });
            }

        }
    }

    angular.module('expenseApp').controller('expenseApp.employees.EmployeeExpensesController', EmployeeExpensesController);

}
