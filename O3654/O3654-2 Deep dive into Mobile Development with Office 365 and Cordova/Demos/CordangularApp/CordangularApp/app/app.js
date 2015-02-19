(function () {
  "use strict";

  var cordangularApp = angular.module("CordangularApp", ['ngRoute']);

  cordangularApp.config(function ($routeProvider) {

    $routeProvider.when("/", {
      templateUrl: 'app/views/home.html',
      controller: "homeController"
    }).when("/contacts", {
      templateUrl: 'app/views/contacts.html',
      controller: "contactsController"
    }).when("/calendar", {
      templateUrl: 'app/views/calendar.html',
      controller: "calendarController"
    }).otherwise({
      redirectTo: "/"
    });

  });

})();
