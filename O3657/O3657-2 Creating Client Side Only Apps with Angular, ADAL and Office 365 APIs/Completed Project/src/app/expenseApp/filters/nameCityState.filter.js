///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    'use strict';
    function nameCityStateFilter() {
        return function (employees, filterValue) {
            if (!filterValue) {
                return employees;
            }
            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < employees.length; i++) {
                var emp = employees[i];
                if (emp.firstName.toLowerCase().indexOf(filterValue) > -1 || emp.lastName.toLowerCase().indexOf(filterValue) > -1 || emp.city.toLowerCase().indexOf(filterValue) > -1 || emp.state.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(emp);
                }
            }
            return matches;
        };
    }
    expenseApp.nameCityStateFilter = nameCityStateFilter;
    angular.module('expenseApp').filter('nameCityStateFilter', nameCityStateFilter);
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=nameCityState.filter.js.map