'use strict';

var crmApp = angular.module("AngularCRM", []);

crmApp.config(function () {
    var hostWeb = $.getQueryStringValue("SPHostUrl");
    $("#lnkHostWeb").attr("href", hostWeb);
});