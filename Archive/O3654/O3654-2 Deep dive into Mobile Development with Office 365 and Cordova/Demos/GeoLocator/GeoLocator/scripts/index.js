

(function () {
  "use strict";

  document.addEventListener('deviceready', onDeviceReady.bind(this), false);

  function onDeviceReady() {
    // Handle the Cordova pause and resume events
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);

    // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    $(function () {
       navigator.geolocation.getCurrentPosition(onPositionSuccess);
       $("#showMap").click(showMap);
    })
  };

  function onPause() { };
  function onResume() { };

  var currentPosition;

  function onPositionSuccess(position) {
    currentPosition = position
    $('#lat').text(position.coords.latitude);
    $('#long').text(position.coords.longitude);
  }


  function showMap() {
    var googlePosition = new google.maps.LatLng(currentPosition.coords.latitude,
                                                currentPosition.coords.longitude);

    var mapOptions = {
      sensor: true,
      center: googlePosition,
      panControl: false,
      zoomControl: true,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: true
    }

    var map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
    var marker = new google.maps.Marker({ position: googlePosition, map: map });

  }

})();