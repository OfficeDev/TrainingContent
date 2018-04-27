    (function () {
      'use strict';

      angular.module('officeAddin')
          .service('customerService', ['$q', '$http', customerService]);

      /**
       * Custom Angular service that talks to a static JSON file simulating a REST API.
       */
      function customerService($q, $http) {
        // public signature of the service
        return {
          lookupCustomerPartials: lookupCustomerPartials,
          lookupCustomer: lookupCustomer
        };

        /** *********************************************************** */

        /**
         * Queries the remote service for possible customer matches.
         *
         * @param possibleCustomers {Array<string>}   Collection of customer last names to lookup.
         */
        function lookupCustomerPartials(possibleCustomers) {
          var deferred = $q.defer();

          // if nothing submitted return empty collection
          if (!possibleCustomers || possibleCustomers.length == 0) {
            deferred.resolve([]);
          }

          // fetch data
          var endpoint = '/content/customers.json';

          // execute query
          $http({
            method: 'GET',
            url: endpoint
          }).success(function (response) {
            var customers = [];

            // look at each customer to find a match
            response.d.results.forEach(function (customer) {
              if (possibleCustomers.indexOf(customer.LastName) != -1) {
                customers.push(customer);
              }
            });

            deferred.resolve(customers);
          }).error(function (error) {
            deferred.reject(error);
          });

          return deferred.promise;
        }

        /**
         * Finds a specific customer form the datasource.
         *
         * @param customerID  {number}    Unique ID of the customer.
         */
        function lookupCustomer(customerID) {
          var deferred = $q.defer();

          // fetch data
          var endpoint = '/content/customers.json';

          $http({
            method: 'GET',
            url: endpoint
          }).success(function (response) {
            var result = {};

            // find the matching customer
            response.d.results.forEach(function (customer) {
              if (customerID == customer.CustomerID) {
                result = customer;
              }
            });

            deferred.resolve(result);
          }).error(function (error) {
            deferred.reject(error);
          });

          return deferred.promise;
        }

      }
    })();