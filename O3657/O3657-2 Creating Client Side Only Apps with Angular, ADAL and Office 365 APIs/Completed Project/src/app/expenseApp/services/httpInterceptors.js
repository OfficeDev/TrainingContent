///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />
'use strict';
var employeeApp;
(function (employeeApp) {
    var services;
    (function (services) {
        var HttpInterceptor401 = (function () {
            function HttpInterceptor401($q, $rootScope) {
                var _this = this;
                this.$q = $q;
                this.$rootScope = $rootScope;
                this.response = function (res) {
                    return res || _this.$q.when(res);
                };
                this.responseError = function (res) {
                    if (res.status === 401) {
                        //Raise event so listener can act on it
                        _this.$rootScope.$broadcast('redirectToLogin', null);
                        return _this.$q.reject(res);
                    }
                    return _this.$q.reject(res);
                };
            }
            HttpInterceptor401.Factory = function ($q, $rootScope) {
                return new HttpInterceptor401($q, $rootScope);
            };
            HttpInterceptor401.prototype.responseHandler = function (res) {
                return res || this.$q.when(res);
            };
            HttpInterceptor401.prototype.responseErrorHandler = function (res) {
                if (res.status === 401) {
                    //Raise event so listener can act on it
                    this.$rootScope.$broadcast('redirectToLogin', null);
                    return this.$q.reject(res);
                }
                return this.$q.reject(res);
            };
            HttpInterceptor401.$inject = ['$q', '$rootScope'];
            return HttpInterceptor401;
        })();
        services.HttpInterceptor401 = HttpInterceptor401;
    })(services = employeeApp.services || (employeeApp.services = {}));
})(employeeApp || (employeeApp = {}));
(function () {
    //    angular.module('expenseApp').config(['$httpProvider', ($httpProvider: ng.IHttpProvider) => {
    //            $httpProvider.interceptors.push(employeeApp.services.HttpInterceptor401.Factory);
    //    }]);
})();
//# sourceMappingURL=httpInterceptors.js.map