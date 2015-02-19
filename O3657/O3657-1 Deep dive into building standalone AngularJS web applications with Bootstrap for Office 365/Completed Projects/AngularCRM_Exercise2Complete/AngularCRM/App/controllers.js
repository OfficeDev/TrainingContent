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
        $scope.title = "About the Angular CRM App"
        $scope.description = "The Angular CRM App is a demo app which I wrote using Bootstrap and AngularJS"
    }
);