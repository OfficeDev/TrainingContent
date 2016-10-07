
(function () {
    "use strict";

    jQuery(function () {

        //Get AppWebUrl
        var appWebUrl = "";
        var args = window.location.search.substring(1).split("&");
        for (var i = 0; i < args.length; i++) {
            var n = args[i].split("=");
            if (n[0] == "SPAppWebUrl")
                appWebUrl = decodeURIComponent(n[1]);
        }

        //Set link
        $("#listLink").attr("href", appWebUrl + "/Lists/Announcements");

    });

}());