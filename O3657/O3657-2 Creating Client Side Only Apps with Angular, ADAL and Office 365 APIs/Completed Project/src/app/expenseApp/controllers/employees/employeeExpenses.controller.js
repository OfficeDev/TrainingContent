///<reference path="../../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var employees;
    (function (employees) {
        var EmployeeExpensesController = (function () {
            function EmployeeExpensesController($scope, $routeParams, $window, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$window = $window;
                this.dataService = dataService;
                this.employee = {};
                this.expensesTotal = 0.00;
                this.employeeId = (this.$routeParams.employeeId) ? parseInt(this.$routeParams.employeeId, 10) : 0;
                if (this.employeeId > 0) {
                    this.dataService.getEmployeeExpenses(this.employeeId).then(function (employee) {
                        _this.employee = employee;
                        $scope.$broadcast('employee', _this.employee);
                    }, function (error) {
                        _this.$window.alert('Sorry, an error occurred: ' + error.message);
                    });
                }
            }
            EmployeeExpensesController.$inject = ['$scope', '$routeParams', '$window', 'expenseApp.services.dataService'];
            return EmployeeExpensesController;
        })();
        angular.module('expenseApp').controller('expenseApp.employees.EmployeeExpensesController', EmployeeExpensesController);
    })(employees = expenseApp.employees || (expenseApp.employees = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=employeeExpenses.controller.js.map