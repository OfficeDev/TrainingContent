/// <reference path="/Scripts/FabricUI/MessageBanner.js" />


(function () {
    "use strict";

    var messageBanner;

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Initialize the FabricUI notification mechanism and hide it
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();
            // adding event handlers for app command buttons
            $("#cmdGetContent").click(cmdGetContent);
            $("#cmdInsertContent").click(cmdInsertContent);
        });
    };

    function getQuote() {

        var quotes = [
            "I would rather have an Agave bottle in front of me than a frontal lobatomy.",
            "Better to remain silent and be thought a fool than to speak and erase all doubt.",
            "A two-year-old is kind of like having a blender, but you don't have a top for it.",
            "Between two evils, I always pick the one I never tried before."
        ];

        var index = Math.floor(Math.random() * quotes.length);
        return quotes[index];
    }

    function cmdGetContent() {
        // display quote inside Agave
        $("#contentArea").html(getQuote());
    }

    function cmdInsertContent() {
    }

    //$$(Helper function for treating errors, $loc_script_taskpane_home_js_comment34$)$$
    function errorHandler(error) {
        // $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
        showNotification("Error:", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();
