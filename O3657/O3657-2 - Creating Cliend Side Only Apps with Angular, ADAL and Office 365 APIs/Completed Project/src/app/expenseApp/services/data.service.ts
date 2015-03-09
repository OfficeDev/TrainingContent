///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

module expenseApp.services {
    'use strict';

    interface IPropStyle {
        camelCase: string;
        pascalCase: string;
    }

    export class DataService {

        baseSPUrl: string;
        baseSPListsUrl: string;
        factory = {};
        getOptions = {
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        };
        PropStyle: IPropStyle = {
            camelCase: 'camel',
            pascalCase: 'pascal'
        };
        requestDigest: string = null;

        static $inject = ['$http', '$q', '$window', '$location', '$timeout', 'settings', 'adalAuthenticationService'];
        constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $window: ng.IWindowService,
                    private $location: ng.ILocationService, private $timeout: ng.ITimeoutService,
                    private settings, private adalService) {

            this.baseSPUrl = settings.baseSPUrl;
            this.baseSPListsUrl = this.baseSPUrl + 'web/lists/';

        }

        getEmployeesAndExpenses() {

            var deferred = this.$q.defer();
            var empsPromise = this.$http.get(this.baseSPListsUrl +
                'getByTitle(\'Employees\')/items?$select=ID,FirstName,LastName&$orderby=LastName,FirstName', this.getOptions);
            var expensesPromise = this.$http.get(this.baseSPListsUrl +
                'getByTitle(\'Expenses\')/items?$select=ID,Amount,Created,ExpenseCategory,Title,Receipt,Employee/Id' +
                '&$expand=Employee/Id', this.getOptions);

            //Currently the SharePoint REST API doesn't make grabbing the employees & expenses
            //all at once so we're grabbing them individually
            this.$q.all([empsPromise, expensesPromise])
              .then((results) => {
                  var employees = (results[0].data.d) ? this.caseProps(results[0].data.d.results, this.PropStyle.camelCase)
                                                      : []; //Get employees data
                  var expenses = (results[1].data.d) ? this.caseProps(results[1].data.d.results, this.PropStyle.camelCase)
                                                     : []; //Get expenses data

                  this.mapEmployeeToExpenses(employees, expenses);

                  deferred.resolve(employees);
            });

            return deferred.promise; //Return promise to caller
        }

        getEmployeesSummary(pageIndex, pageSize) {
            var url = this.baseSPListsUrl + 'getByTitle(\'Employees\')/items?$select=ID,FirstName,LastName,Address,' +
                                            'City,State,Zip,Email,Gender&$orderby=LastName,FirstName';
            return this.getPagedResource(url, pageIndex, pageSize);
        }

        getStates() {
            var url = this.baseSPListsUrl + 'getByTitle(\'States\')/items?$select=Title&$orderby=Title';
            return this.$http.get(url, this.getOptions).then((result: shared.IHttpDataResponse) => {
                return this.caseProps(result.data.d.results, this.PropStyle.camelCase);
            });
        }

        getEmployee(id) {
            var url = this.baseSPListsUrl + 'getByTitle(\'Employees\')/items(' + id + ')?$select=ID,FirstName,LastName,' +
                                            'Address,City,State,Zip,Email,Gender';
            return this.$http.get(url, this.getOptions).then((result: shared.IHttpDataResponse) => {
                    var cust: shared.IEmployee = this.caseProps(result.data.d, this.PropStyle.camelCase);
                    cust.zip = parseInt(cust.zip, 10);
                    return cust;
                },
                (error: shared.IHttpPromiseCallbackErrorArg) => {
                    this.$window.alert(error.message);
                }
            );
        }

        getExpense(id) {
          var url = this.baseSPListsUrl + 'getByTitle(\'Expenses\')/items(' + id + ')' +
                                            '?$select=ID,Amount,Created,ExpenseCategory,Title,Receipt';
          return this.$http.get(url, this.getOptions).then((result:shared.IHttpDataResponse) => {
              var expense: shared.IExpense = this.caseProps(result.data.d, this.PropStyle.camelCase);
              return expense;
            },
            (error: shared.IHttpPromiseCallbackErrorArg) => {
              this.$window.alert(error.message);
            });
        }

        addReceiptToExpense(expense, receiptUrl) {

          var updatedExpense = {
            Receipt: receiptUrl,
            __metadata: expense.__metadata
          };

          var options = {
            url: updatedExpense.__metadata.uri,
            method: 'MERGE',
            data: JSON.stringify(updatedExpense),
            headers:{
              'Accept': 'application/json;odata=verbose',
              'Content-Type': 'application/json;odata=verbose',
              'If-Match': updatedExpense.__metadata.etag
            }
          };

          return this.$http(options).then((expenseData) => {
            if (expenseData.config && expenseData.config.data) {
              var expense = JSON.parse(expenseData.config.data);
              //etag returned is the same one sent up so have to manually increment it to
              //stay insync. This makes it so we don't have to grab a fresh employee object
              //from the server each time an update occurs...save an XHR call.
              var etag = parseInt(expense.__metadata.etag.replace('"', ''), 10) + 1;
              var metadata = expense.__metadata;
              metadata.etag = '"' + etag + '"';
              return metadata;
            }
            return null;
          });

        }

//        checkUniqueValue(id, property, value) {
//            if (!id) { id = 0; }
//            return this.$http.get(this.serviceBase + 'checkUnique/' + id + '?property=' + property +
//                                  '&value=' + escape(value), this.getOptions)
//                .then((results) => {
//                    return results.data.status;
//                }
//            );
//        }

        getEmployeeExpenses = function (id) {
            var url = this.baseSPListsUrl + 'getByTitle(\'Expenses\')/items?$filter=Employee eq ' + id +
                                            '&$select=ID,Amount,Created,ExpenseCategory,Title,Receipt';
            var deferred = this.$q.defer();
            var empPromise = this.getEmployee(id);
            var expensesPromise = this.$http.get(url, this.getOptions);

            this.$q.all([empPromise, expensesPromise])
              .then((results) => {
                  var employee = results[0]; //Get customer data
                  employee.expenses = this.caseProps(results[1].data.d.results, this.PropStyle.camelCase); //Get expenses data

                  this.calculateExpensesTotal(employee);

                  deferred.resolve(employee);
              },
              (error) => {
                  if (error.status === 302) {
                      deferred.resolve(null);
                      //Potential infinite loop here - haven't dealt with that possibility yet
                      //$window.location.href = getRedirectUrl();
                  }
              });

            return deferred.promise; //Return promise to caller

        }

        insertEmployee(employee) {

            employee = this.caseProps(employee, this.PropStyle.pascalCase);
            employee.Title = employee.FirstName + ' ' + employee.LastName;
            employee.Zip = employee.Zip.toString(); //Zip is a string in SharePoint
            employee.__metadata = { type: 'SP.Data.EmployeesListItem' };
            var baseUrl: string = this.baseSPListsUrl + 'getByTitle(\'Employees\')/items';

            var options = {
                url: baseUrl,
                method: 'POST',
                data: JSON.stringify(employee),
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose'
                    //'X-RequestDigest': requestDigest
                }
            };

            return this.$http(options).then((result: shared.IHttpDataResponse) => {
                var cust: shared.IEmployee = this.caseProps(result.data.d, this.PropStyle.camelCase);
                cust.zip = parseInt(cust.zip, 10); //SharePoint Zip field is a string so convert to int
                return cust;
            },
            (error: shared.IHttpPromiseCallbackErrorArg) => {
                this.$window.alert(error.message);
                return error;
            });
        }

        newEmployee() : shared.IEmployee {
            return this.$q.when({});
        }

        updateEmployee(employee) {

            employee = this.caseProps(employee, this.PropStyle.pascalCase);
            employee.Title = employee.FirstName + ' ' + employee.LastName;
            employee.Zip = employee.Zip.toString(); //Zip is a string in SharePoint

            var options = {
                url: employee.__metadata.uri,
                method: 'MERGE',
                data: JSON.stringify(employee),
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose',
                    'If-Match': employee.__metadata.etag
                    //'X-RequestDigest': requestDigest
                }
            };

            return this.$http(options).then((employeeData) => {
                if (employeeData.config && employeeData.config.data) {
                    var employee: shared.IEmployee = JSON.parse(employeeData.config.data);
                    //etag returned is the same one sent up so have to manually increment it to
                    //stay insync. This makes it so we don't have to grab a fresh employee object
                    //from the server each time an update occurs...save an XHR call.
                    var etag = parseInt(employee.__metadata.etag.replace('"', ''), 10) + 1;
                    var metadata = employee.__metadata;
                    metadata.etag = '"' + etag + '"';
                    return metadata;
                }
                return null;
            });

        }

        deleteEmployee(employee) {

            var options = {
                url: employee.__metadata.uri,
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'If-Match': employee.__metadata.etag
                    //'X-RequestDigest': requestDigest
                }
            };

            return this.$http(options).then((status) => {
                return status.data;
            },
            (error: shared.IHttpPromiseCallbackErrorArg) => {
                this.$window.alert(error.message);
                return error;
            });
        }

        removeReceiptFromExpense(expense) {
          var updatedExpense = {
            Receipt: null,
            __metadata: expense.__metadata
          };

          var options = {
            url: updatedExpense.__metadata.uri,
            method: 'MERGE',
            data: JSON.stringify(updatedExpense),
            headers:{
              'Accept': 'application/json;odata=verbose',
              'Content-Type': 'application/json;odata=verbose',
              'If-Match': updatedExpense.__metadata.etag
            }
          };

          return this.$http(options).then((expenseData) => {
            if (expenseData.config && expenseData.config.data) {
              var expense = JSON.parse(expenseData.config.data);
              //etag returned is the same one sent up so have to manually increment it to
              //stay insync. This makes it so we don't have to grab a fresh employee object
              //from the server each time an update occurs...save an XHR call.
              var etag = parseInt(expense.__metadata.etag.replace('"', ''), 10) + 1;
              var metadata = expense.__metadata;
              metadata.etag = '"' + etag + '"';
              return metadata;
            }
            return null;
          });
        }

        getRequestDigest() {
            var baseUrl = this.baseSPUrl + 'contextinfo';
            var options = {
                url: baseUrl,
                method: 'POST',
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'ContextInfoRequest': true
                }
            };

            this.$http(options).success((data: shared.IHttpDataDResponse) => {
                if (data && data.d) {
                    this.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
                }
            });
        }

        getPagedResource(baseResource, pageIndex, pageSize) {
            var deferred = this.$q.defer();
            var url = baseResource;
            var totalRecords,
                employeeResults;

            // get total number of employees
            // ** originally used $q.all(), but ran into an issue with timing when making two CORS requests
            //    possible bug in $q when CORS preflight HTTP OPTIONS request was not completing before
            //    HTTP GET request
            this.$http.get(this.baseSPListsUrl + 'getByTitle(\'Employees\')/itemcount', this.getOptions)
              .then((totalCountResult: shared.IHttpDataDResponse) => {
                // extract total records from first call....
                totalRecords = (totalCountResult.data.d) ? totalCountResult.data.d.ItemCount : 0;

                // now get employees
                return this.$http.get(url, this.getOptions);
              })
              .then((employeeResult: shared.IHttpDataDResponse) => {
                // extract results from employee call
                employeeResults = (employeeResult.data.d)
                  ? this.caseProps(employeeResult.data.d.results, this.PropStyle.camelCase)
                  : [];


                deferred.resolve({
                  totalRecords: totalRecords,
                  results: employeeResults
                });
              });

            return deferred.promise; //Return promise to caller
        }

        buildPagingUri(pageIndex, pageSize) {
            var uri = '&$skip=' + (pageIndex * pageSize) + '&$top=' + pageSize;
            return uri;
        }

        mapEmployeeToExpenses(employees, expenses) {
            if (employees && expenses) {
                for (var i = 0; i < employees.length; i++) {
                    var employee = employees[i];
                    var employeeExpenses = [];
                    for (var j = 0; j < expenses.length; j++) {
                        var expense = expenses[j];
                        if (expense.employee.Id === employee.id) { //Case of "Id" is correct for this instance
                            employeeExpenses.push(expense);
                        }
                    }
                    employee.expenses = employeeExpenses;
                    this.calculateExpensesTotal(employee);
                }
            }
        }

        extendEmployees(employees) {
            var employeesLen = employees.length;
            //Iterate through employees
            for (var i = 0; i < employeesLen; i++) {
                var employee = employees[i];
                this.calculateExpensesTotal(employee);
            }
        }

        calculateExpensesTotal(employee) {
            var expensesLen = employee.expenses.length;
            employee.expensesTotal = 0;
            //Iterate through expenses
            for (var j = 0; j < expensesLen; j++) {
                employee.expensesTotal += employee.expenses[j].amount;
            }
        }

        caseProps(obj, propStyle) {

            if (Array.isArray(obj)) {
                var newArray = [];
                for (var i = 0; i < obj.length; i++) {
                    newArray.push(this.iterate(obj[i], propStyle));
                }
                return newArray;
            } else {
                return this.iterate(obj, propStyle);
            }

        }

        caseProp(str, propStyle) {
            if (!str) { return str; }

            //Camel Case Option
            if (!propStyle || propStyle === this.PropStyle.camelCase) {
                return str.charAt(0).toLowerCase() + str.slice(1);
            } else { //Pascal Case Option
                //SharePoint-specific fields to worry about
                if (str !== '__metadata') {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                return str;
            }
        }

        iterate(obj, propStyle) {
            var newObj = {};
            for (var prop in obj) {
                if (obj[prop]) {
                    newObj[this.caseProp(prop, propStyle)] = obj[prop];
                }
            }
            return newObj;
        }

        getItemTypeForListName(listName) {
            return 'SP.Data.' + listName.charAt(0).toUpperCase() + listName.slice(1) + 'ListItem';
        }
    }


    angular.module('expenseApp').service('expenseApp.services.dataService', DataService);

}
