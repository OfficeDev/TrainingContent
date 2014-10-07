/// <reference path="../services/office365/scripts/utility.js" />
/// <reference path="../services/office365/scripts/o365discovery.js" />
/// <reference path="../services/office365/scripts/o365adal.js" />
/// <reference path="../services/office365/scripts/exchange.js" />


(function () {
  "use strict";

  document.addEventListener('deviceready', onDeviceReady.bind(this), false);

  function onDeviceReady() {
    // Handle the Cordova pause and resume events
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);
  };

  function onPause() {};
  function onResume() { };

})();