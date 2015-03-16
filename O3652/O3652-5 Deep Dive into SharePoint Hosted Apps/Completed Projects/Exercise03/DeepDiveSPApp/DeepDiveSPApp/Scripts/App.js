
(function () {
    "use strict";

    jQuery(function () {


        jQuery.ajax({
            url: "../_api/web/currentuser",
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data, status, jqXHR) {
                jQuery("#message").text("Welcome, " + data.d.Title);
            },
            error: function (jqXHR, status, message) {
                jQuery("#message").text(message);
            }
        });

    });

}());
