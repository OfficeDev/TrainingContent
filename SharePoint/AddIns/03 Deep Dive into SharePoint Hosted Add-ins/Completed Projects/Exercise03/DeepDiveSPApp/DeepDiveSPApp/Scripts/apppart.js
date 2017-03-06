
(function () {
    "use strict";

    $(function () {

        setTimeout(function () {

            var ctx = SP.ClientContext.get_current();
            var request = new SP.WebRequestInfo();

            request.set_url(
                "http://www.musicbrainz.org/ws/2/release-group?query=artist:" + artist
                );
            request.set_method("GET");
            responseDocument = SP.WebProxy.invoke(ctx, request);
            ctx.executeQueryAsync(onSuccess, onError);

        }, 2000)

    });

}());

var onSuccess = function () {
    var xmlDoc = $.parseXML(responseDocument.get_body());
    $(xmlDoc).find("release-group").each(function (i) {
        var title = $(this).children("title").first().text();
        $("#songList").append("<li>" + title + "</li>")
    });
}

var onError = function () {
    alert("failed!");
}

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

var artist = getQueryStringParameter("Artist");
var responseDocument = "";

var appWebUrl = getQueryStringParameter("SPAppWebUrl");
var hostWebUrl = getQueryStringParameter("SPHostUrl");
var listId = getQueryStringParameter("SPListId");
var listItemId = getQueryStringParameter("SPListItemId");

if (typeof (listId) != "undefined" && typeof (listItemId) != "undefined") {
    listId = listId.substring(1, listId.length - 1);
    var executor = new SP.RequestExecutor(appWebUrl);
    executor.executeAsync({
        url: "../_api/SP.AppContextSite(@target)/web/lists(guid'" + listId +
             "')/getItemByStringId('" + listItemId +
             "')?@target='" + hostWebUrl + "'",
        method: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            artist = JSON.parse(data.body).d.Title;
        },
        error: function (data) {
            artist = "artist";
        }
    });
}
