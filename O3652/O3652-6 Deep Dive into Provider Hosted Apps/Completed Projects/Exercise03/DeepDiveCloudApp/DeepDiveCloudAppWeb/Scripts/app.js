"use strict";

var ChromeControl = function () {

    var init = function () {

        var hostWebUrl = queryString("SPHostUrl");
        $.getScript(hostWebUrl + "/_layouts/15/SP.UI.Controls.js", render);

    },

    render = function () {
        var options = {
            "appIconUrl": "../Images/AppIcon.png",
            "appTitle": "Deep Dive Cloud App",
            "settingsLinks": [
                {
                    "linkUrl": "../Pages/CrossDomain.aspx?" + document.URL.split("?")[1],
                    "displayName": "Cross Domain Library"
                }
            ]
        };

        var nav = new SP.UI.Controls.Navigation(
                                "chrome_ctrl_placeholder",
                                options
                          );
        nav.setVisible(true);

    },

    queryString = function (p) {
        var params =
            document.URL.split("?")[1].split("&");
        var strParams = "";
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == p)
                return decodeURIComponent(singleParam[1]);
        }
    }

    return {
        init: init,
    }
}();



(function () {
    "use strict";

    jQuery(function () {
        ChromeControl.init();
    });

}());

