(function () {
  'use strict';

  var excelApp = angular.module('appxls');

  // load route
  excelApp.config(['$routeProvider', routeConfigurator]);

  function routeConfigurator($routeProvider) {
      $routeProvider.when('/', {
        templateUrl:  'products/products.html',
        controller:   'productsController',
        controllerAs: 'vm'
      });
    $routeProvider.otherwise({redirectTo: '/'});
  }
})();