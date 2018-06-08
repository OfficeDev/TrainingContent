(function () {
      'use strict';

      angular.module('officeAddin')
          .controller('customersDetailController',
          ['$q', '$window', '$location', '$routeParams', 'customerService',
            customersDetailController]);

      /**
       * Controller constructor
       * @param $q                Angular's $q promise service.
       * @param $window           Angular's $window service.
       * @param $location         Angular's $location service.
       * @param $routeParams      Angular's $routeParams service.
       * @param customerService   Custom Angular service for customer data.
       */
      function customersDetailController($q, $window, $location, $routeParams, customerService) {
        var vm = this;

        // selected customer
        vm.customer = {};
        vm.goBack = goBack;

        /** *********************************************************** */

        init();

        /**
         * Initialize the controller
         */
        function init() {
          // if ID is passed in, load customer
          var customerId = +$routeParams.customerID;
          if (customerId && customerId > 0) {
            loadCustomer(customerId);
          } else {
            $location.path('/');
          }
        }

        /**
         * Load the specified customer.
         *
         * @param customerID {number}   ID of the selected customer to display.
         */
        function loadCustomer(customerID) {
          var deferred = $q.defer();

          customerService.lookupCustomer(customerID)
              .then(function (customer) {
                vm.customer = customer;
                deferred.resolve();
              })
              .catch(function (error) {
                deferred.reject(error);
              });

          return deferred.promise;
        }

        /**
         * Navigates back to the list.
         */
        function goBack() {
          $window.history.back();
        }

      }

    })();