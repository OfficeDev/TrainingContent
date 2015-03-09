///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/expenseApp.d.ts" />

module expenseApp {
    'use strict';

    export class Routes {
        static configure($routeProvider: ng.route.IRouteProvider) {
            var viewBase: string = 'app/expenseApp/views/';

            $routeProvider
                .when('/login', {
                    controller: 'expenseApp.LoginController',
                    templateUrl: viewBase + 'login.html',
                    controllerAs: 'vm'
                })
                .when('/employees', {
                    controller: 'expenseApp.employees.EmployeesController',
                    templateUrl: viewBase + 'employees/employees.html',
                    controllerAs: 'vm',
                    requireADLogin: true
                })
                .when('/employeeExpenses/:employeeId', {
                    controller: 'expenseApp.employees.EmployeeExpensesController',
                    templateUrl: viewBase + 'employees/employeeExpenses.html',
                    controllerAs: 'vm',
                    requireADLogin: true
                })
                .when('/employeeEdit/:employeeId', {
                    controller: 'expenseApp.employees.EmployeeEditController',
                    templateUrl: viewBase + 'employees/employeeEdit.html',
                    controllerAs: 'vm',
                    requireADLogin: true
                })
                .when('/expenses', {
                    controller: 'expenseApp.expenses.ExpensesController',
                    templateUrl: viewBase + 'expenses/expenses.html',
                    controllerAs: 'vm',
                    requireADLogin: true
                })
                .when('/expensesAttachReceipt/:employeeId/:expenseId', {
                    templateUrl: viewBase + 'expenses/expensesAttachReceipt.html',
                    controller: 'expenseApp.expenses.ExpenseReceiptController',
                    controllerAs: 'vm',
                    requireADLogin: true
                })
                .when('/about', {
                    controller: 'expenseApp.AboutController',
                    templateUrl: viewBase + 'about.html'
                })
                .otherwise({ redirectTo: '/login' });
        }
    }

}
