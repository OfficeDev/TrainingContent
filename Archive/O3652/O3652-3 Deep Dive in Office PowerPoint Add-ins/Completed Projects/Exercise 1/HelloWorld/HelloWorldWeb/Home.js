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

            $('#get-photo-of-the-day').click(insertImageFromBing);
        });
    };

    function insertImageFromBing() {

        //Get image from from webservice. 
        //The service should fetch the photo return it as a base 64 embedded string
        $.ajax({
            url: "/api/Photo/", success: function (result) {
                insertImageFromBase64String(result);
            }, error: function (xhr, status, error) {

                showNotification("Fail", "oops something went wrong");
            }
        });
    }

    //This function uses the Office JavaScript API to add content to the Slide
    function insertImageFromBase64String(image) {
        //Call Office.js to insert it into the document. You can also pass in imageTop and imageLeft parameters.
        Office.context.document.setSelectedDataAsync(image, {
            coercionType: Office.CoercionType.Image
        },
            function (asyncResult) {
                if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                    showNotification("error", asyncResult.error.message);
                }
            });
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notificationHeader").text(header);
        $("#notificationBody").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();