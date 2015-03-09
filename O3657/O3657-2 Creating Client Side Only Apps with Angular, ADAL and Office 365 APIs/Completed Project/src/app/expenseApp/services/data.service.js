///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var services;
    (function (services) {
        'use strict';
        var DataService = (function () {
            function DataService($http, $q, $window, $location, $timeout, settings, adalService) {
                this.$http = $http;
                this.$q = $q;
                this.$window = $window;
                this.$location = $location;
                this.$timeout = $timeout;
                this.settings = settings;
                this.adalService = adalService;
                this.factory = {};
                this.getOptions = {
                    headers: {
                        'Accept': 'application/json;odata=verbose'
                    }
                };
                this.PropStyle = {
                    camelCase: 'camel',
                    pascalCase: 'pascal'
                };
                this.requestDigest = null;
                //        checkUniqueValue(id, property, value) {
                //            if (!id) { id = 0; }
                //            return this.$http.get(this.serviceBase + 'checkUnique/' + id + '?property=' + property +
                //                                  '&value=' + escape(value), this.getOptions)
                //                .then((results) => {
                //                    return results.data.status;
                //                }
                //            );
                //        }
                this.getEmployeeExpenses = function (id) {
                    var _this = this;
                    var url = this.baseSPListsUrl + 'getByTitle(\'Expenses\')/items?$filter=Employee eq ' + id + '&$select=ID,Amount,Created,ExpenseCategory,Title,Receipt';
                    var deferred = this.$q.defer();
                    var empPromise = this.getEmployee(id);
                    var expensesPromise = this.$http.get(url, this.getOptions);
                    this.$q.all([empPromise, expensesPromise]).then(function (results) {
                        var employee = results[0]; //Get customer data
                        employee.expenses = _this.caseProps(results[1].data.d.results, _this.PropStyle.camelCase); //Get expenses data
                        _this.calculateExpensesTotal(employee);
                        deferred.resolve(employee);
                    }, function (error) {
                        if (error.status === 302) {
                            deferred.resolve(null);
                        }
                    });
                    return deferred.promise; //Return promise to caller
                };
                this.baseSPUrl = settings.baseSPUrl;
                this.baseSPListsUrl = this.baseSPUrl + 'web/lists/';
            }
            DataService.prototype.getEmployeesAndExpenses = function () {
                var _this = this;
                var deferred = this.$q.defer();
                var empsPromise = this.$http.get(this.baseSPListsUrl + 'getByTitle(\'Employees\')/items?$select=ID,FirstName,LastName&$orderby=LastName,FirstName', this.getOptions);
                var expensesPromise = this.$http.get(this.baseSPListsUrl + 'getByTitle(\'Expenses\')/items?$select=ID,Amount,Created,ExpenseCategory,Title,Receipt,Employee/Id' + '&$expand=Employee/Id', this.getOptions);
                //Currently the SharePoint REST API doesn't make grabbing the employees & expenses
                //all at once so we're grabbing them individually
                this.$q.all([empsPromise, expensesPromise]).then(function (results) {
                    var employees = (results[0].data.d) ? _this.caseProps(results[0].data.d.results, _this.PropStyle.camelCase) : []; //Get employees data
                    var expenses = (results[1].data.d) ? _this.caseProps(results[1].data.d.results, _this.PropStyle.camelCase) : []; //Get expenses data
                    _this.mapEmployeeToExpenses(employees, expenses);
                    deferred.resolve(employees);
                });
                return deferred.promise; //Return promise to caller
            };
            DataService.prototype.getEmployeesSummary = function (pageIndex, pageSize) {
                var url = this.baseSPListsUrl + 'getByTitle(\'Employees\')/items?$select=ID,FirstName,LastName,Address,' + 'City,State,Zip,Email,Gender&$orderby=LastName,FirstName';
                return this.getPagedResource(url, pageIndex, pageSize);
            };
            DataService.prototype.getStates = function () {
                var _this = this;
                var url = this.baseSPListsUrl + 'getByTitle(\'States\')/items?$select=Title&$orderby=Title';
                return this.$http.get(url, this.getOptions).then(function (result) {
                    return _this.caseProps(result.data.d.results, _this.PropStyle.camelCase);
                });
            };
            DataService.prototype.getEmployee = function (id) {
                var _this = this;
                var url = this.baseSPListsUrl + 'getByTitle(\'Employees\')/items(' + id + ')?$select=ID,FirstName,LastName,' + 'Address,City,State,Zip,Email,Gender';
                return this.$http.get(url, this.getOptions).then(function (result) {
                    var cust = _this.caseProps(result.data.d, _this.PropStyle.camelCase);
                    cust.zip = parseInt(cust.zip, 10);
                    return cust;
                }, function (error) {
                    _this.$window.alert(error.message);
                });
            };
            DataService.prototype.getExpense = function (id) {
                var _this = this;
                var url = this.baseSPListsUrl + 'getByTitle(\'Expenses\')/items(' + id + ')' + '?$select=ID,Amount,Created,ExpenseCategory,Title,Receipt';
                return this.$http.get(url, this.getOptions).then(function (result) {
                    var expense = _this.caseProps(result.data.d, _this.PropStyle.camelCase);
                    return expense;
                }, function (error) {
                    _this.$window.alert(error.message);
                });
            };
            DataService.prototype.addReceiptToExpense = function (expense, receiptUrl) {
                var updatedExpense = {
                    Receipt: receiptUrl,
                    __metadata: expense.__metadata
                };
                var options = {
                    url: updatedExpense.__metadata.uri,
                    method: 'MERGE',
                    data: JSON.stringify(updatedExpense),
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose',
                        'If-Match': updatedExpense.__metadata.etag
                    }
                };
                return this.$http(options).then(function (expenseData) {
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
            };
            DataService.prototype.insertEmployee = function (employee) {
                var _this = this;
                employee = this.caseProps(employee, this.PropStyle.pascalCase);
                employee.Title = employee.FirstName + ' ' + employee.LastName;
                employee.Zip = employee.Zip.toString(); //Zip is a string in SharePoint
                employee.__metadata = { type: 'SP.Data.EmployeesListItem' };
                var baseUrl = this.baseSPListsUrl + 'getByTitle(\'Employees\')/items';
                var options = {
                    url: baseUrl,
                    method: 'POST',
                    data: JSON.stringify(employee),
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose'
                    }
                };
                return this.$http(options).then(function (result) {
                    var cust = _this.caseProps(result.data.d, _this.PropStyle.camelCase);
                    cust.zip = parseInt(cust.zip, 10); //SharePoint Zip field is a string so convert to int
                    return cust;
                }, function (error) {
                    _this.$window.alert(error.message);
                    return error;
                });
            };
            DataService.prototype.newEmployee = function () {
                return this.$q.when({});
            };
            DataService.prototype.updateEmployee = function (employee) {
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
                    }
                };
                return this.$http(options).then(function (employeeData) {
                    if (employeeData.config && employeeData.config.data) {
                        var employee = JSON.parse(employeeData.config.data);
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
            };
            DataService.prototype.deleteEmployee = function (employee) {
                var _this = this;
                var options = {
                    url: employee.__metadata.uri,
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'If-Match': employee.__metadata.etag
                    }
                };
                return this.$http(options).then(function (status) {
                    return status.data;
                }, function (error) {
                    _this.$window.alert(error.message);
                    return error;
                });
            };
            DataService.prototype.removeReceiptFromExpense = function (expense) {
                var updatedExpense = {
                    Receipt: null,
                    __metadata: expense.__metadata
                };
                var options = {
                    url: updatedExpense.__metadata.uri,
                    method: 'MERGE',
                    data: JSON.stringify(updatedExpense),
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose',
                        'If-Match': updatedExpense.__metadata.etag
                    }
                };
                return this.$http(options).then(function (expenseData) {
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
            };
            DataService.prototype.getRequestDigest = function () {
                var _this = this;
                var baseUrl = this.baseSPUrl + 'contextinfo';
                var options = {
                    url: baseUrl,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'ContextInfoRequest': true
                    }
                };
                this.$http(options).success(function (data) {
                    if (data && data.d) {
                        _this.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
                    }
                });
            };
            DataService.prototype.getPagedResource = function (baseResource, pageIndex, pageSize) {
                var _this = this;
                var deferred = this.$q.defer();
                var url = baseResource;
                var totalRecords, employeeResults;
                // get total number of employees
                // ** originally used $q.all(), but ran into an issue with timing when making two CORS requests
                //    possible bug in $q when CORS preflight HTTP OPTIONS request was not completing before
                //    HTTP GET request
                this.$http.get(this.baseSPListsUrl + 'getByTitle(\'Employees\')/itemcount', this.getOptions).then(function (totalCountResult) {
                    // extract total records from first call....
                    totalRecords = (totalCountResult.data.d) ? totalCountResult.data.d.ItemCount : 0;
                    // now get employees
                    return _this.$http.get(url, _this.getOptions);
                }).then(function (employeeResult) {
                    // extract results from employee call
                    employeeResults = (employeeResult.data.d) ? _this.caseProps(employeeResult.data.d.results, _this.PropStyle.camelCase) : [];
                    deferred.resolve({
                        totalRecords: totalRecords,
                        results: employeeResults
                    });
                });
                return deferred.promise; //Return promise to caller
            };
            DataService.prototype.buildPagingUri = function (pageIndex, pageSize) {
                var uri = '&$skip=' + (pageIndex * pageSize) + '&$top=' + pageSize;
                return uri;
            };
            DataService.prototype.mapEmployeeToExpenses = function (employees, expenses) {
                if (employees && expenses) {
                    for (var i = 0; i < employees.length; i++) {
                        var employee = employees[i];
                        var employeeExpenses = [];
                        for (var j = 0; j < expenses.length; j++) {
                            var expense = expenses[j];
                            if (expense.employee.Id === employee.id) {
                                employeeExpenses.push(expense);
                            }
                        }
                        employee.expenses = employeeExpenses;
                        this.calculateExpensesTotal(employee);
                    }
                }
            };
            DataService.prototype.extendEmployees = function (employees) {
                var employeesLen = employees.length;
                for (var i = 0; i < employeesLen; i++) {
                    var employee = employees[i];
                    this.calculateExpensesTotal(employee);
                }
            };
            DataService.prototype.calculateExpensesTotal = function (employee) {
                var expensesLen = employee.expenses.length;
                employee.expensesTotal = 0;
                for (var j = 0; j < expensesLen; j++) {
                    employee.expensesTotal += employee.expenses[j].amount;
                }
            };
            DataService.prototype.caseProps = function (obj, propStyle) {
                if (Array.isArray(obj)) {
                    var newArray = [];
                    for (var i = 0; i < obj.length; i++) {
                        newArray.push(this.iterate(obj[i], propStyle));
                    }
                    return newArray;
                }
                else {
                    return this.iterate(obj, propStyle);
                }
            };
            DataService.prototype.caseProp = function (str, propStyle) {
                if (!str) {
                    return str;
                }
                //Camel Case Option
                if (!propStyle || propStyle === this.PropStyle.camelCase) {
                    return str.charAt(0).toLowerCase() + str.slice(1);
                }
                else {
                    //SharePoint-specific fields to worry about
                    if (str !== '__metadata') {
                        return str.charAt(0).toUpperCase() + str.slice(1);
                    }
                    return str;
                }
            };
            DataService.prototype.iterate = function (obj, propStyle) {
                var newObj = {};
                for (var prop in obj) {
                    if (obj[prop]) {
                        newObj[this.caseProp(prop, propStyle)] = obj[prop];
                    }
                }
                return newObj;
            };
            DataService.prototype.getItemTypeForListName = function (listName) {
                return 'SP.Data.' + listName.charAt(0).toUpperCase() + listName.slice(1) + 'ListItem';
            };
            DataService.$inject = ['$http', '$q', '$window', '$location', '$timeout', 'settings', 'adalAuthenticationService'];
            return DataService;
        })();
        services.DataService = DataService;
        angular.module('expenseApp').service('expenseApp.services.dataService', DataService);
    })(services = expenseApp.services || (expenseApp.services = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=data.service.js.map