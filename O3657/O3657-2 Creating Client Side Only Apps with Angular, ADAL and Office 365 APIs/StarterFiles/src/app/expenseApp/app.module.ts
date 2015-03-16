///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/expenseApp.d.ts" />

'use strict';

(():void => {

  var app = angular.module('expenseApp', [
      'ngRoute',
      'ngAnimate',
      'wc.directives',
      'ui.bootstrap']);

  app.config(['$routeProvider',
    function($routeProvider:ng.route.IRouteProvider):void {
      expenseApp.Routes.configure($routeProvider);
    }]);

})();

