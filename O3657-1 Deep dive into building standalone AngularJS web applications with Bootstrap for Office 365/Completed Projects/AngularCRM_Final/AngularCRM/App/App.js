'use strict';

var crmApp = angular.module("AngularCRM", ['ngRoute']);

crmApp.config(function ($routeProvider) {

    var hostWeb = $.getQueryStringValue("SPHostUrl");
    $("#lnkHostWeb").attr("href", hostWeb);

    // config route map
    $routeProvider.when("/", {
        templateUrl: 'views/home.html',
        controller: "homeController"
    }).when("/view/:id", {
        templateUrl: 'views/view.html',
        controller: "viewController"
    }).when("/edit/:id", {
        templateUrl: 'views/edit.html',
        controller: "editController"
    }).when("/new", {
        templateUrl: 'views/new.html',
        controller: "newController"
    }).when("/about", {
        templateUrl: 'views/about.html',
        controller: "aboutController"
    }).otherwise({
        redirectTo: "/"
    });

});