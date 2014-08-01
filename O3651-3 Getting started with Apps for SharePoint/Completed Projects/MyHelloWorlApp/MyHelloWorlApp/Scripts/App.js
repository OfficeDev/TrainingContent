	'use strict';

	$(document).ready(onPageLoad);

	function onPageLoad() {
		$("#message").text("Hello from the document ready event handler");
		$("#cmdPushMe").click(onButtonClick);
	}

	function onButtonClick() {
		$("#displayDiv")
			.text("Hello Apps")
			.css({ "margin": "16px", "color": "green", "font-size": "32px" });
	}
