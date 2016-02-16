(function(){
  'use strict';

  var officeAddin = angular.module('officeAddin');

  // load routes
  officeAddin.config(['$routeProvider', routeConfigurator]);

  function routeConfigurator($routeProvider){
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
