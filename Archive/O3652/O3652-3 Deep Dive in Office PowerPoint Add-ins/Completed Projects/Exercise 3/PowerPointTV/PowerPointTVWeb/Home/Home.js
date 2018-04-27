/// <reference path="/Scripts/FabricUI/MessageBanner.js" />

(function () {
    "use strict";

    var messageBanner;

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();

            // your app initialization code goes here		
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            // register event handlers for control panem buttons
            $("#cmdStart").click(onStart);
            $("#cmdPause").click(onPause);
            $("#cmdStop").click(onStop);

            // call to Videos web service
            loadVideos();
        });
    };
    
    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notificationHeader").text(header);
        $("#notificationBody").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
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

function loadVideos() {
	$.ajax({
		url: "/api/Videos/",
	}).done(function (videos) {
		$("#videoList").empty();
		for (var i = 0; i < videos.length; i++) {
			$("#videoList").append($("<option>", { value: videos[i].videoId }).text(videos[i].title));
		}
		$("#videoList").click(onLoadVideo);
	});
}

function onLoadVideo() {
	var videoId = $("#videoList").val();
	if (videoId) {
		player.loadVideoById(videoId);
	}
}