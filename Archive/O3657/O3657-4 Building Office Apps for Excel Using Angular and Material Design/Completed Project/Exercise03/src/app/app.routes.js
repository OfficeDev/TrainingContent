(function(){
  'use strict';

  var officeAddin = angular.module('officeAddin');

  // load routes
  officeAddin.config(['$routeProvider', routeConfigurator]);

    function routeConfigurator($routeProvider) {
          $routeProvider.when('/', {
            templateUrl:  'app/products/products.html',
            controller:   'productsController',
            controllerAs: 'vm'
          });
        $routeProvider.otherwise({redirectTo: '/'});
      }
})();
