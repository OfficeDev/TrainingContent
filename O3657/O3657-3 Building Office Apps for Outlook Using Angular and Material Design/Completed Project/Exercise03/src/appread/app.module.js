(function(){
  'use strict';

  // create
  var officeAddin = angular.module('officeAddin', [
    'ngRoute',
    'ngSanitize',
    'ngAnimate',
    'ngMaterial'
  ]);

  // configure
  officeAddin.config(['$logProvider', '$mdThemingProvider', function ($logProvider, $mdThemingProvider) {
      // set debug logging to on
      if ($logProvider.debugEnabled) {
          $logProvider.debugEnabled(true);
      }

      // configure theme color
      $mdThemingProvider.theme('default')
          .primaryPalette('blue');
  }]);

  // when Office has initalized, manually bootstrap the app
  Office.initialize = function(){
    console.log('>>> Office.initialize()');
    angular.bootstrap(document.getElementById('container'), ['officeAddin']);
  };

})();
