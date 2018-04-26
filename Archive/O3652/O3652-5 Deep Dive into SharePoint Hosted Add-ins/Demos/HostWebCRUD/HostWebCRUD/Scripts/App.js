var Csom = window.Csom || {};

(function () {
    "use strict";

    jQuery(function () {

        //Create and load lists
        Csom.Lists.create(
            appWebUrl,
            hostWebUrl,
            "Announcements",
            "A team announcements list",
            SP.ListTemplateType.announcements)
            .always(function () {
                return Csom.ViewModel.load(appWebUrl, hostWebUrl, "Announcements");
                }
            )
            .fail(function (jqXHR, status) {
                $("#loadingDiv").text(status.get_message());
            })
            .always(function () {
                ko.applyBindings(Csom.ViewModel, document.getElementById("announcementsTable"));
                $("#mainDiv").show();
                $("#loadingDiv").hide();
            });

        //Add New Item
        $("#newItemButton").click(function () {
            Csom.ListItems.create(appWebUrl, hostWebUrl, "Announcements", $("#inputText").val())
            .always(function () {
                return Csom.ViewModel.load(appWebUrl, hostWebUrl, "Announcements");
                }
            )
            .fail(function (jqXHR, status) {
                $("#message").text(status.get_message());
            })
        });

    });


}());

var getQueryStringParameter = function (p) {
    var params =
       document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == p)
            return decodeURIComponent(singleParam[1]);
    }
}

var appWebUrl = getQueryStringParameter("SPAppWebUrl");
var hostWebUrl = getQueryStringParameter("SPHostUrl");
