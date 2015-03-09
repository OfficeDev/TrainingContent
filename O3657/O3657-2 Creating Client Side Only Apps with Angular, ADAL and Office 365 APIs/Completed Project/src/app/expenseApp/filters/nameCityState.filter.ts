///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

module expenseApp {

  'use strict';

  export function nameCityStateFilter() {

    return (employees: shared.IEmployee[], filterValue:string) => {
      if (!filterValue) {
        return employees;
      }

      var matches: shared.IEmployee[] = [];
      filterValue = filterValue.toLowerCase();
      for (var i = 0; i < employees.length; i++) {
        var emp = employees[i];
        if (emp.firstName.toLowerCase().indexOf(filterValue) > -1 ||
          emp.lastName.toLowerCase().indexOf(filterValue) > -1 ||
          emp.city.toLowerCase().indexOf(filterValue) > -1 ||
          emp.state.toLowerCase().indexOf(filterValue) > -1) {

          matches.push(emp);
        }
      }
      return matches;
    };

  }
  angular.module('expenseApp').filter('nameCityStateFilter', nameCityStateFilter);
}
