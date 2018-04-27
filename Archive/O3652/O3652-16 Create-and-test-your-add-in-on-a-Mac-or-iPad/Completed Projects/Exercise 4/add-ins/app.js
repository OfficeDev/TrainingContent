'use strict';
(function () {
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            $('#write-data-to-selection').click(writeDataToSelection);
        });
    };
    function writeDataToSelection() {
        Office.context.document.setSelectedDataAsync("Office add-ins are awesome!",
         function (result) {
             if (result.status === Office.AsyncResultStatus.Succeeded) {
                 console.log("Writing to the document succeeded!");
             } else {
                 console.log("Writing to the document failed: " + result.error.message);
             }
         }
       );
    }
})();