(function () {
  'use strict';

  var outlookApp = angular.module('appowa');

  // load routes
  outlookApp.config(['$routeProvider', routeConfigurator]);

  function routeConfigurator($routeProvider) {
    $routeProvider
        .when('/', {
          templateUrl: 'customers/customers.html',
          controller: 'customersController',
          controllerAs: 'vm'
        })
        .when('/:customerID', {
          templateUrl: 'customers/customers-detail.html',
          controller: 'customersDetailController',
          controllerAs: 'vm'
        });

    $routeProvider.otherwise({redirectTo: '/'});
  }
})();