(function () {
  "use strict";

  // The initialize function must be run each time a new page is loaded
  Office.initialize = function (reason) {
    $(document).ready(function () {
      app.initialize();

      // your app initialization code goes here       
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // register event handlers for control panem buttons
      $("#cmdStart").click(onStart);
      $("#cmdPause").click(onPause);
      $("#cmdStop").click(onStop);

    });
  };
})();

// add support for YouTube player
var player;

function onYouTubeIframeAPIReady() {
  var videoId = 'Y0hsjr7S-kM';
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoId,
    events: {
      'onReady': onPlayerReady
    }
  });

}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onStart() {
  player.playVideo();
}

function onPause() {
  player.pauseVideo();
}

function onStop() {
  player.stopVideo();
}
