'use strict';

var app = angular.module('AngularCRM');

app.controller('homeController',
    function ($scope) {
    }
);

app.controller('newController',
    function ($scope) {
    }
);

app.controller('viewController',
    function ($scope) {
    }
);

app.controller('editController',
    function ($scope) {
    }
);

app.controller('aboutController',
    function ($scope) {
        $scope.title = "About the Angular CRM Add-in"
        $scope.description = "The Angular CRM Add-in is a demo Add-in which I wrote using Office UI Fabric and AngularJS"
    }
);