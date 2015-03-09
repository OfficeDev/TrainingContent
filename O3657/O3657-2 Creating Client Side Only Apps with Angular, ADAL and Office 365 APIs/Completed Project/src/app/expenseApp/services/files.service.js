///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var services;
    (function (services) {
        'use strict';
        var FilesService = (function () {
            function FilesService($http, $q, $window, $location, $timeout, settings, adalService) {
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
                        'Accept': 'application/json'
                    }
                };
                this.baseSPUrl = settings.baseSPUrl;
            }
            FilesService.prototype.getUserFiles = function () {
                var deferred = this.$q.defer();
                var endpoint = this.settings.baseOneDriveUrl + '/files/getbypath(\'receipts\')/children';
                this.$http.get(endpoint, this.getOptions).then(function (result) {
                    var receipts = result.data.value;
                    deferred.resolve(receipts);
                });
                return deferred.promise;
            };
            FilesService.prototype.getReceiptsFolderPath = function () {
                var deferred = this.$q.defer();
                var endpoint = this.settings.baseOneDriveUrl + '/files/getbypath(\'receipts\')?$select=webUrl';
                this.$http.get(endpoint, this.getOptions).then(function (response) {
                    deferred.resolve(response.data.webUrl);
                });
                return deferred.promise;
            };
            FilesService.$inject = ['$http', '$q', '$window', '$location', '$timeout', 'settings', 'adalAuthenticationService'];
            return FilesService;
        })();
        services.FilesService = FilesService;
        angular.module('expenseApp').service('expenseApp.services.filesService', FilesService);
    })(services = expenseApp.services || (expenseApp.services = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=files.service.js.map