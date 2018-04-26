/// <reference path="../services/office365/scripts/utility.js" />
/// <reference path="../services/office365/scripts/o365discovery.js" />
/// <reference path="../services/office365/scripts/o365adal.js" />
/// <reference path="../services/office365/scripts/exchange.js" />


'use strict';

var app = angular.module('CordangularApp');


app.factory("Office365ApiService",
  function () {
    // create service object
    var service = {};
    
    var exchangeClient;

    service.connect = function () {
        var authContext = new O365Auth.Context();
        authContext.getIdToken("https://outlook.office365.com/").then(function (token) {
            var accessTokenFn = token.getAccessTokenFn('https://outlook.office365.com');
            exchangeClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/ews/odata', accessTokenFn);
            exchangeClient.me.fetch();
        });
    };

    service.connected = function () {
        return (exchangeClient !== undefined);
    };

    service.getWelcomeMessage = function () {
        if (exchangeClient === undefined) {
            return "Hello from the Cordangular App. Press the Connect button to connect to Office 365.";
        }
        else {
            return "You are now connected to Office 365.";
        }
    };

    service.getContacts = function () {
        return exchangeClient.me.contacts.getContacts().fetch();
    };

    service.getEvents = function () {
        return exchangeClient.me.events.getEvents().fetch();
    };

    // return service object to angular framework
    return service;
  });
