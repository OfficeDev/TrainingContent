(function () {
    "use strict";

    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
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
        // insert current quote in Active Word document
        var quote = $("#contentArea").html();
        Office.context.document.setSelectedDataAsync(quote, {}, function () { });
    }

})();