'use strict';

var app = angular.module('CordangularApp');

app.formatDate = function (dateValue) {

  var date = new Date(dateValue);

  var options = {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };

  return date.toLocaleTimeString("en-us", options);
}

app.controller('homeController',
    function ($scope, Office365ApiService) {
      $scope.message = Office365ApiService.getWelcomeMessage();
      $scope.disconnected = Office365ApiService.connected() === false;
      $scope.connect = function () {
        Office365ApiService.connect();
        $scope.message = Office365ApiService.getWelcomeMessage();
        $scope.disconnected = Office365ApiService.connected() === false;
        //$scope.$apply();
      };
    }
);

app.controller('contactsController',
    function ($scope, Office365ApiService) {
      var promise = Office365ApiService.getContacts();
      promise.then(function (contacts) {
        var numberOfContacts = contacts.currentPage.length;
        var contactsCollection = Array();
        for (var i = 0; i < numberOfContacts; i++) {
          var contact = {
            lastName: contacts.currentPage[i].surname,
            firstName: contacts.currentPage[i].givenName
          };
          contactsCollection.push(contact);
        }
        $scope.contacts = contactsCollection;
        $scope.$apply();
      });
    }
);

app.controller('calendarController',
    function ($scope, Office365ApiService) {
      var promise = Office365ApiService.getEvents();
      promise.then(function (events) {
        var numberOfEvents = events.currentPage.length;
        var eventsCollection = Array();
        for (var i = 0; i < numberOfEvents; i++) {
          var event = {
            subject: events.currentPage[i].subject,
            start: app.formatDate(events.currentPage[i].start)
          };
          eventsCollection.push(event);
        }
        $scope.events = eventsCollection;
        $scope.$apply();
      });
    }
);
