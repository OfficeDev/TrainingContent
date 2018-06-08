   (function () {
      'use strict';

      angular.module('officeAddin')
          .controller('customersController',
          ['$q', '$location', 'officeService', 'customerService',
            customersController]);

      /**
       * Controller constructor
       * @param $q                Angular's $q promise service.
       * @param $location         Angular's $location service.
       * @param officeService     Custom Angular service for talking to the Office client.
       * @param customerService   Custom Angular service for customer data.
       */
      function customersController($q, $location, officeService, customerService) {
        var vm = this;

        // collection of words to lookup
        vm.lookupCandidates = [];
        // customer hits
        vm.matchCandidates = [];
        // handler to take to another view
        vm.goToCustomer = goToCustomer;

        /** *********************************************************** */

        init();

        /**
         * Initialize the controller
         */
        function init() {
          loadMatchesFromEmail()
              .then(function () {
                return getCadidateCustomersFromService();
              });
        }

        /**
         * Changes the view to the the customer detail page.
         *
         * @param customer {object}   Customer selected from the list.
         */
        function goToCustomer(customer) {
          $location.path('/' + customer.CustomerID);
        }
        
        /**
         * Load the possible candidate matches in the email within the add-in.
         */
        function loadMatchesFromEmail() {
            var deferred = $q.defer();

            officeService.getWordCandidatesFromEmail()
                .then(function (candidates) {
                    vm.lookupCandidates = candidates;
                    deferred.resolve();
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        }

        /**
        * Query the lookup service to get a list of all matching candidates.
        */
        function getCadidateCustomersFromService() {
            var deferred = $q.defer();
            
            customerService.lookupCustomerPartials(vm.lookupCandidates)
                .then(function (candidates) {
                    vm.matchCandidates = candidates;
                    deferred.resolve();
                })
                .catch(function (error) {
                    console.log('>>> failed getCadidateCustomersFromService', error);
                    deferred.reject(error);
                });
            
            return deferred.promise;
        }

      }
    })();