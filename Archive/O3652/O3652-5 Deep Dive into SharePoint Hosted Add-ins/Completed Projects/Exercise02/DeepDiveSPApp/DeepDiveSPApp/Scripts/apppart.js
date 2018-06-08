
(function () {
    "use strict";

    $(function () {

        var ctx = SP.ClientContext.get_current();
        var request = new SP.WebRequestInfo();

        request.set_url(
            "http://www.musicbrainz.org/ws/2/release-group?query=artist:" + artist
            );
        request.set_method("GET");
        responseDocument = SP.WebProxy.invoke(ctx, request);
        ctx.executeQueryAsync(onSuccess, onError);

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
