(function () {
  'use strict';

  // create the angular app
  var excelApp = angular.module('appxls', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ngMaterial'
  ]);

  excelApp.config(['$logProvider', '$mdThemingProvider', function ($logProvider, $mdThemingProvider) {
    // set debug logging to on
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }

    // configure theme color
    $mdThemingProvider.theme('default')
                      .primaryPalette('green');
  }]);

  // when office has initalized, manually bootstrap the app
  Office.initialize = function () {
    console.log(">>> Office.initialize()");
    angular.bootstrap(jQuery('#container'), ['appxls']);
  };

})();