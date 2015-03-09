///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/expenseApp.d.ts" />

'use strict';

(() : void => {

    var app = angular.module('expenseApp',
        ['ngRoute', 'ngAnimate', 'wc.directives', 'ui.bootstrap', 'AdalAngular']);

    app.config(['$routeProvider', '$httpProvider', 'settings', 'adalAuthenticationServiceProvider',
        function ($routeProvider: ng.route.IRouteProvider, $httpProvider: ng.IHttpProvider,
                  settings : expenseApp.shared.IAdalSettings, adalProvider) : void {

            expenseApp.Routes.configure($routeProvider);
            expenseApp.Adal.configure($httpProvider, settings, adalProvider);

    }]);

})();

