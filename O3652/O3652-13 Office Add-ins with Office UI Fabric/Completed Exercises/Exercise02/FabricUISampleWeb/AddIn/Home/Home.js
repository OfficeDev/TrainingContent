/// <reference path="../App.js" />

(function () {
    "use strict";

    Office.initialize = function (reason) {
        $(document).ready(function () {
            $('#set-data').click(writeText);
        });

        $(".ms-SearchBox").SearchBox();
        $(".ms-Pivot").Pivot();
        $(".ms-Dropdown").Dropdown();
        $(".ms-ListItem").ListItem();
    };

    function writeText() {
        Office.context.document.setSelectedDataAsync("Citation goes here",
            function (asyncResult) {
                var error = asyncResult.error;
                if (asyncResult.status === "failed") {
                    $('#display-data').text("Failure" + error.message);
                }
                else {
                    $('#display-data').text("Done");
                }
            });
    }

})();