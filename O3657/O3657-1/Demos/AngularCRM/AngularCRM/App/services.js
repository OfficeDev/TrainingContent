'use strict';

var app = angular.module('AngularCRM');

app.factory("wingtipCrmService",
  function ($http) {
      // create service object
      var service = {};

      // TODO: add behavior to service object
      // retrieve and cache SharePoint form digest value
      var requestDigest;

      $http({
          method: 'POST',
          url: "../_api/contextinfo",
          headers: { "Accept": "application/json; odata=verbose" }
      }).success(function (data) {
          requestDigest = data.d.GetContextWebInformation.FormDigestValue
      });

      service.getCustomers = function () {
          var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items/" +
                             "?$select=ID,Title,FirstName,WorkPhone,HomePhone,Email";
          return $http({
              method: 'GET',
              url: restQueryUrl,
              headers: { "Accept": "application/json; odata=verbose" }
          })
      }

      service.getCustomer = function (id) {
          var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items(" + id + ")/" +
                             "?$select=ID,Title,FirstName,WorkPhone,HomePhone,Email";
          return $http({
              method: 'GET',
              url: restQueryUrl,
              headers: { "Accept": "application/json; odata=verbose" }
          })
      }

      service.deleteCustomer = function (id) {
          var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items(" + id + ")";
          return $http({
              method: 'DELETE',
              url: restQueryUrl,
              headers: {
                  "Accept": "application/json; odata=verbose",
                  "X-RequestDigest": requestDigest,
                  "If-Match": "*"
              }
          });
      }

      service.addCustomer = function (FirstName, LastName, WorkPhone, HomePhone, Email) {
          var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items";

          var customerData = {
              __metadata: { "type": "SP.Data.CustomersListItem" },
              Title: LastName,
              FirstName: FirstName,
              WorkPhone: WorkPhone,
              HomePhone: HomePhone,
              Email: Email
          };

          var requestBody = JSON.stringify(customerData);

          return $http({
              method: 'POST',
              url: restQueryUrl,
              contentType: "application/json;odata=verbose",
              data: requestBody,
              headers: {
                  "Accept": "application/json; odata=verbose",
                  "X-RequestDigest": requestDigest,
                  "content-type": "application/json;odata=verbose"
              }
          });
      }

      service.updateCustomer = function (id, FirstName, LastName, WorkPhone, HomePhone, Email, etag) {
          var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items(" + id + ")";

          var customerData = {
              __metadata: { "type": "SP.Data.CustomersListItem" },
              Title: LastName,
              FirstName: FirstName,
              WorkPhone: WorkPhone,
              HomePhone: HomePhone,
              Email: Email
          };

          var requestBody = JSON.stringify(customerData);

          return $http({
              method: 'POST',
              url: restQueryUrl,
              contentType: "application/json;odata=verbose",
              data: requestBody,
              headers: {
                  "Accept": "application/json; odata=verbose",
                  "X-RequestDigest": requestDigest,
                  "content-type": "application/json;odata=verbose",
                  "If-Match": etag,
                  "X-HTTP-METHOD": "PATCH"
              }
          });
      }
      // return service object to angular framework
      return service;
  });