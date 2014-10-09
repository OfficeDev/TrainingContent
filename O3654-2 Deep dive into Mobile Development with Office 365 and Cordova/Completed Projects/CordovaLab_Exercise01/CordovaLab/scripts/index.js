
(function () {
  "use strict";

  document.addEventListener('deviceready', onDeviceReady.bind(this), false);

  function onDeviceReady() {
    // app start up code goes here
    $("#cmdGetContacts").click(onGetContacts);
  };

  function onGetContacts() {
    $("#status").text("Hello World!");
  }

})();