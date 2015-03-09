///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/expenseApp.d.ts" />
'use strict';
(function () {
    var app = angular.module('expenseApp', ['ngRoute', 'ngAnimate', 'wc.directives', 'ui.bootstrap', 'AdalAngular']);
    app.config(['$routeProvider', '$httpProvider', 'settings', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, settings, adalProvider) {
        expenseApp.Routes.configure($routeProvider);
        expenseApp.Adal.configure($httpProvider, settings, adalProvider);
    }]);
})();
//# sourceMappingURL=app.module.js.map