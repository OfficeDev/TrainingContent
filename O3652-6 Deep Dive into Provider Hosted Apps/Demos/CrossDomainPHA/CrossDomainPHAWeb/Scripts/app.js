
(function () {
    "use strict";

    jQuery(function () {

        //Get SPHostUrl
        var args = window.location.search.substring(1).split("&");
        var spHostUrl = "";
        for (var i = 0; i < args.length; i++) {
            var n = args[i].split("=");
            if (n[0] == "SPHostUrl")
                spHostUrl = decodeURIComponent(n[1]);
        }
        
        //Get AppWebUrl
        var appWebUrl = "";
        for (var i = 0; i < args.length; i++) {
            var n = args[i].split("=");
            if (n[0] == "SPAppWebUrl")
                appWebUrl = decodeURIComponent(n[1]);
        }

        //Load Libraries
        var scriptbase = spHostUrl + "/_layouts/15/";

        jQuery.getScript(scriptbase + "MicrosoftAjax.js").then(function (data) {
            return jQuery.getScript(scriptbase + "SP.Runtime.js");
        }).then(function (data) {
            return jQuery.getScript(scriptbase + "SP.js");
        }).then(function (data) {
            return jQuery.getScript(scriptbase + "SP.RequestExecutor.js");
        }).then(function (data) {


                //Call Host Web with REST
                var executor = new SP.RequestExecutor(appWebUrl);
                executor.executeAsync({
                    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" +
                        spHostUrl + "'",
                    method: "GET",
                    headers: { "accept": "application/json;odata=verbose" },
                    success: function (data) {
                        jQuery("#hostTitle").text(JSON.parse(data.body).d.Title);
                    },
                    error: function () {
                        jQuery("#hostTitle").text("Error!");
                    }
                });


                //Call App Web with CSOM
                var ctx = new SP.ClientContext(appWebUrl);
                var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
                ctx.set_webRequestExecutorFactory(factory);
                this.web = ctx.get_web();
                ctx.load(this.web);
                ctx.executeQueryAsync(

                            Function.createDelegate(this,

                                function () { jQuery("#appTitle").text(this.web.get_title()); }),

                            Function.createDelegate(this,

                                function (sender, args) { jQuery("#appTitle").text("Error!"); }));


        });

    });

}());