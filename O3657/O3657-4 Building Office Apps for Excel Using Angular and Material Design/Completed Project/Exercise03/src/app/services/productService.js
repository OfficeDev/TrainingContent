    (function () {
      'use strict';

      angular.module('officeAddin')
          .service('productService', ['$q', '$http', productService]);

      /**
       * Custom Angular service that talks to a static JSON file simulating a REST API.
       */
      function productService($q, $http) {
        // public signature of the service
        return {
          getSuppliers: getSuppliers,
          getCategories: getCategories,
          getProducts: getProducts
        };

       /** *********************************************************** */
       /**
        * Retrieves suppliers from resource.
        */
        function getSuppliers() {
            var deferred = $q.defer();

            // fetch data
            var endpoint = '/content/suppliers.json';

            // execute query
            $http({
                method: 'GET',
                url: endpoint
            }).success(function (response) {
                var results = response.d.results;

                // sort alpha
                results.sort(function (a, b) {
                if (a.CompanyName > b.CompanyName) {
                    return 1;
                } else if (a.CompanyName < b.CompanyName) {
                    return -1;
                } else {
                    return 0;
                }
                });

                deferred.resolve(results);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        /**
         * Retrieves categories from resource.
         */
        function getCategories() {
            var deferred = $q.defer();

            // fetch data
            var endpoint = '/content/categories.json';

            // execute query
            $http({
                method: 'GET',
                url: endpoint
            }).success(function (response) {
                var results = response.d.results;

                // sort alpha
                results.sort(function (a, b) {
                if (a.CategoryName > b.CategoryName) {
                    return 1;
                } else if (a.CategoryName < b.CategoryName) {
                    return -1;
                } else {
                    return 0;
                }
                });

                deferred.resolve(results);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
        
        /**
         * Retrieves products, filtered accordingly, from the resource.
         */
        function getProducts(supplierFilter, categoryFilter) {
            var deferred = $q.defer();

            // fetch data
            var endpoint = '/content/products.json';

            // execute query
            $http({
                method: 'GET',
                url: endpoint
            }).success(function (response) {
                var results = [];

                // if filters provided, filter
                if (!supplierFilter && !categoryFilter) {
                results = response.d.results;
                } else {
                // filter the results
                results = filterProducts(response.d.results, supplierFilter, categoryFilter);
                }

                // sort alpha
                results.sort(function (a, b) {
                if (a.ProductName > b.ProductName) {
                    return 1;
                } else if (a.ProductName < b.ProductName) {
                    return -1;
                } else {
                    return 0;
                }
                });

                deferred.resolve(results);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
        
        /**
         * Filter the products collection based on specified criteria.
         * @param allProducts                 Collection of all products.
         * @param supplierFilter              Supplier filter to apply.
         * @param categoryFilter              Category filter to apply.
         * @returns results {Array<object>}   Matching products.
         */
        function filterProducts(allProducts, supplierFilter, categoryFilter) {
            var results = [];

            allProducts.forEach(function (product) {
                var supplierMatch = true,
                    categoryMatch = true;

                // supplier filter
                if (supplierFilter && supplierFilter.SupplierID) {
                    if (supplierFilter.SupplierID != product.SupplierID) {
                        supplierMatch = false;
                    }
                }
                // category filters
                if (categoryFilter && categoryFilter.CategoryID) {
                    if (categoryFilter.CategoryID != product.CategoryID) {
                        categoryMatch = false;
                    }
                }

                // if match, add to collection
                if (supplierMatch && categoryMatch) {
                    results.push(product);
                }
            });

            return results;
        }        
      }
    })();