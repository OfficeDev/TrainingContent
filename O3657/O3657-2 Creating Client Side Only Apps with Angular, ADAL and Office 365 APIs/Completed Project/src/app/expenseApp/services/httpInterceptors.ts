///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

'use strict';
module employeeApp.services {

    export class HttpInterceptor401 {

        static Factory($q: ng.IQService, $rootScope: ng.IRootScopeService) {
            return new HttpInterceptor401($q, $rootScope);
        }

        response: (res: ng.IHttpPromiseCallbackArg<any>) => any;
        responseError: (res: ng.IHttpPromiseCallbackArg<any>) => any;

        static $inject = ['$q', '$rootScope'];
        constructor(private $q: ng.IQService, private $rootScope: ng.IRootScopeService) {
            this.response = (res) => { return res || this.$q.when(res); };
            this.responseError = (res) => {
                if (res.status === 401) {
                    //Raise event so listener can act on it
                    this.$rootScope.$broadcast('redirectToLogin', null);
                    return this.$q.reject(res);
                }
                return this.$q.reject(res);
            };
        }

        responseHandler(res) {
            return res || this.$q.when(res);
        }

        responseErrorHandler(res) {
            if (res.status === 401) {
                //Raise event so listener can act on it
                this.$rootScope.$broadcast('redirectToLogin', null);
                return this.$q.reject(res);
            }
            return this.$q.reject(res);
        }
    }
}

((): void => {

//    angular.module('expenseApp').config(['$httpProvider', ($httpProvider: ng.IHttpProvider) => {
//            $httpProvider.interceptors.push(employeeApp.services.HttpInterceptor401.Factory);
//    }]);

})();
