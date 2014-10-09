﻿'use strict';

var app = angular.module('AngularCRM');

app.controller('homeController',
    function ($scope, wingtipCrmService) {
         wingtipCrmService.getCustomers().success(function (data) {
            $scope.customers = data.d.results;
        });
    }
);

app.controller('newController',
    function ($scope, $location, wingtipCrmService) {

        $scope.customer = {};
        $scope.customer.FirstName = "";
        $scope.customer.Title = "";
        $scope.customer.WorkPhone = "";
        $scope.customer.HomePhone = "";
        $scope.customer.Email = "";

        $scope.addCustomer = function () {
            var firstName = $scope.customer.FirstName;
            var lastName = $scope.customer.Title;
            var workPhone = $scope.customer.WorkPhone;
            var homePhone = $scope.customer.HomePhone;
            var email = $scope.customer.Email;
            wingtipCrmService.addCustomer(firstName, lastName, workPhone, homePhone, email)
              .success(function (data) {
                  $location.path("/");
              });
        }
    }
);

app.controller('viewController',
    function ($scope, $routeParams, wingtipCrmService) {
        var id = $routeParams.id;
        wingtipCrmService.getCustomer(id).success(function (data) {
            $scope.customer = data.d;
        });
    }
);

app.controller('editController',
    function ($scope, $routeParams, $location, wingtipCrmService) {
        var id = $routeParams.id;
        wingtipCrmService.getCustomer(id).success(function (data) {
            $scope.customer = data.d;

            $scope.updateCustomer = function () {
                var firstName = $scope.customer.FirstName;
                var lastName = $scope.customer.Title;
                var workPhone = $scope.customer.WorkPhone;
                var homePhone = $scope.customer.HomePhone;
                var email = $scope.customer.Email;
                var etag = $scope.customer.__metadata.etag;
                wingtipCrmService.updateCustomer(id, firstName, lastName, workPhone, homePhone, email, etag)
                .success(function (data) {
                    $location.path("/");
                });
            }
        });
    }
);

app.controller('aboutController',
    function ($scope) {
        $scope.title = "About the Angular CRM App"
        $scope.description = "The Angular CRM App is a demo app which I wrote using Bootstrap and AngularJS"
    }
);