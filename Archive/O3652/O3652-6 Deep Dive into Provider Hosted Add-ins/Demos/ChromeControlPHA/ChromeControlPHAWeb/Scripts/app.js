"use strict";

var ChromeControl = function () {

    var init = function () {

        var hostWebUrl = queryString("SPHostUrl");
        $.getScript(hostWebUrl + "/_layouts/15/SP.UI.Controls.js", render);

    },

    render = function () {
        var options = {
            "appIconUrl": "../Images/AppIcon.png",
            "appTitle": "App Title",
            "appHelpPageUrl": "../Pages/Help.aspx?" + document.URL.split("?")[1],
            "settingsLinks": [
                {
                    "linkUrl": "../Pages/Page1?" + document.URL.split("?")[1],
                    "displayName": "Page1"
                },
                {
                    "linkUrl": "../Pages/Page2?" + document.URL.split("?")[1],
                    "displayName": "Page2"
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

