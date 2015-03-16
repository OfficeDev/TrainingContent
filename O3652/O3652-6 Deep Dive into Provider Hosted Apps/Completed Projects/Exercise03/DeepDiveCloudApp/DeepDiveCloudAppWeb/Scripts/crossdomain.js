
(function () {
    "use strict";

    jQuery(function () {

        //Get Host and App web URLS
        var appWebUrl = "";
        var spHostUrl = "";
        var args = window.location.search.substring(1).split("&");

        for (var i = 0; i < args.length; i++) {
            var n = args[i].split("=");
            if (n[0] == "SPHostUrl")
                spHostUrl = decodeURIComponent(n[1]);
        }

        for (var i = 0; i < args.length; i++) {
            var n = args[i].split("=");
            if (n[0] == "SPAppWebUrl")
                appWebUrl = decodeURIComponent(n[1]);
        }

        //Load Libraries
        var scriptbase = spHostUrl + "/_layouts/15/";

        jQuery.getScript(scriptbase + "SP.RequestExecutor.js", function (data) {

            //Call Host Web with REST
            var executor = new SP.RequestExecutor(appWebUrl);
            executor.executeAsync({
                url: appWebUrl + "/_api/web/lists/getbytitle('Terms')/items",
                method: "GET",
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {

                    var results = JSON.parse(data.body).d.results;
                    for (var i = 0; i < results.length; i++) {
                        $("#termList").append("<li>" + results[i].Title + "</li>");
                    }
                },
                error: function () {
                    alert("Error!");
                }
            });

        });

    });

}());