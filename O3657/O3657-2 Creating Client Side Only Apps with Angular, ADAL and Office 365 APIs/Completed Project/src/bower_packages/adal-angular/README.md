Active Directory Authentication Library (ADAL) for JavaScript 
====================================
[![Build Status](https://travis-ci.org/AzureAD/azure-activedirectory-library-for-js.svg?branch=master)](https://travis-ci.org/AzureAD/azure-activedirectory-library-for-js)

Active Directory Authentication Library for JavaScript (ADAL JS) helps you to use Azure AD for handling authentication in your single page applications.
This library is optimized for working together with AngularJS.

## The Library

This is a GA released version. The current version is **1.0.0**.
 
You have multiple ways of getting ADAL JS:

Via CDN:

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.0/js/adal.min.js"></script>
    <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.0/js/adal-angular.min.js"></script>

CDN will be updated to latest version 1.0.0.

Via Bower: 

    $ bower install adal-angular

The adal.js source is [here](https://github.com/AzureAD/azure-activedirectory-library-for-js/tree/master/lib/adal.js).
The adal-angular.js source is [here](https://github.com/AzureAD/azure-activedirectory-library-for-js/tree/master/lib/adal-angular.js).
## Samples, tests and documentation 

For a sample demonstrating basic usage of ADAL JS please refer to [this repo](https://github.com/AzureADSamples/SinglePageApp-DotNet). 

**To run tests**

    npm install
    bower install
    npm test
    // angular tests
    karma start

Karma as test runner:
You need to install the karma command line.

    npm install -g karma
    npm install -g karma-cli
    

**documentation generation**
Install grunt; call

    grunt doc



**Quick usage guide**

Below you can find a quick reference for the most common operations you need to perform to use adal js.

1- Include references to angular.js libraries, adal.js, adal-angular.js in your main app page.
2- include a reference to adal module
```js
var app = angular.module('demoApp', ['ngRoute', 'AdalAngular']);
```
3- Initialize adal with the AAD app coordinates at app config time
```js
// endpoint to resource mapping(optional)
    var endpoints = {
        "https://yourhost/api": "b6a68585-5287-45b2-ba82-383ba1f60932",
    };
adalAuthenticationServiceProvider.init(
        {
            // Config to specify endpoints and similar for your app
            tenant: "52d4b072-9470-49fb-8721-bc3a1c9912a1", // Optional by default, it sends common
            clientId: "e9a5a8b6-8af7-4719-9821-0deef255f68e", // Required
            //localLoginUrl: "/login",  // optional
            //redirectUri : "your site", optional
            endpoints: endpoints  // If you need to send CORS api requests.
        },
        $httpProvider   // pass http provider to inject request interceptor to attach tokens
        );
```
4- Define which routes you want to secure via adal - by adding `requireADLogin: true` to their definition
```js
$routeProvider.
    when("/todoList", {
        controller: "todoListController",
        templateUrl: "/App/Views/todoList.html",
        requireADLogin: true
    });

```
5- Any service invocation code you might have will remain unchanged. Adal's interceptor will automatically add tokens for every outgoing call. 

***Optional***
6- If you so choose, in addition (or substitution) to route level protection you can add explicit login/logout UX elements. Furthermore, you can access properties of the currently signed in user directly form JavaScript (via userInfo and userInfo.profile):
```html
<!DOCTYPE html>
<html>
<head>
    <title>Angular Adal Sample</title>
</head>
<body ng-app="adalDemo" ng-controller="homeController" ng-init="hmCtl.init()">
    <a href="#">Home</a>
    <a href="#/todoList">ToDo List</a>


    <!--These links are added to manage login/logout-->
    <div data-ng-model="userInfo">
        <span data-ng-hide="!userInfo.isAuthenticated">Welcome {{userInfo.userName}} </span>
        <button data-ng-hide="!userInfo.isAuthenticated" data-ng-click="logout()">Logout</button>
        <button data-ng-hide="userInfo.isAuthenticated" data-ng-click="login()">Login</button>

        <div>
            {{userInfo.loginError}}
        </div>
        <div>
            {{testMessage}}
        </div>
    </div>
    <div ng-view>
        Your view will appear here.
    </div>

    <script src="/Scripts/angular.min.js"></script>
    <script src="/Scripts/angular-route.min.js"></script>
    <script src="/Scripts/adal.js"></script>
    <script src="/Scripts/adal-angular.js"></script>
    <script src="App/Scripts/app.js"></script>
    <script src="App/Scripts/homeController.js"></script>
    <script src="App/Scripts/todoDetailController.js"></script>
    <script src="App/Scripts/todoListController.js"></script>
    <script src="App/Scripts/todoService.js"></script>
</body>
</html>
```
7- You have full control on how to trigger sign in, sign out and how to deal with errors:

```js
'use strict';
app.controller('homeController', ['$scope', '$location', 'adalAuthenticationService', function ($scope, $location, adalAuthenticationService) {
    // this is referencing adal module to do login

    //userInfo is defined at the $rootscope with adalAngular module
    $scope.testMessage = "";
    $scope.init = function () {
        $scope.testMessage = "";
    };

    $scope.logout = function () {
        adalAuthenticationService.logOut();
    };

    $scope.login = function () {
        adalAuthenticationService.login();
    };

    // optional
    $scope.$on("adal:loginSuccess", function () {
        $scope.testMessage = "loginSuccess";
    });

    // optional
    $scope.$on("adal:loginFailure", function () {
        $scope.testMessage = "loginFailure";
        $location.path("/login");
    });

    // optional
    $scope.$on("adal:notAuthorized", function (event, rejection, forResource) {
        $scope.testMessage = "It is not Authorized for resource:" + forResource;
    });
  
}]);


```

### Multi-Tenant

By default, you have multi-tenant support. Adal will set tenant to 'common', if it is not specified in the config.

### Cache Location
Default storage location is sessionStorage. You can specify localStorage in the config as well.

```js
adalAuthenticationServiceProvider.init(
        {
            // Config to specify endpoints and similar for your app
            clientId: 'cb68f72f...',
            cacheLocation: 'localStorage' // optional cache location default is sessionStorage
        },
        $httpProvider   // pass http provider to inject request interceptor to attach tokens
        );
```

### Security
Tokens are accessible from javascript since Adal.JS is using HTML5 storage. Default storage option is sessionStorage, which keeps the tokens per session. You should ask user to login again for important operations on your app.