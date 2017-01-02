'use strict';

$(document).ready(onPageLoad);

function onPageLoad() {
    $("#message").text("Hello from the document ready event handler");
    $("#cmdPushMe").click(onButtonClicked);
}

function onButtonClicked() {
    $("#displayDiv")
        .text("Hello, Add-ins!")
        .css({ "margin": "16px", "color": "green", "font-size": "32px" });
}