var Profiles = window.Profiles || {};

(function () {
    "use strict";

    jQuery(function () {

        $("#mainDiv").hide();

        var appWebUrl = getQueryStringParameter("SPAppWebUrl");
        var hostWebUrl = getQueryStringParameter("SPHostUrl");
        var listId = getQueryStringParameter("SPListId");
        var listItemId = getQueryStringParameter("SPListItemId");

        if(typeof(listId) != "undefined" && typeof(listItemId) != "undefined") {

            //Get Full Name from the selected contact
            Profiles.GetDisplayName(appWebUrl, listId, listItemId)
                .then(function (displayName) {
                    //Get the account name from the "User Information List"
                    return Profiles.GetAccountName(appWebUrl, hostWebUrl, displayName);
                })
                .then(function (accountName) {
                    //Get the Profile properties for the user
                    return Profiles.GetPropertiesFor(accountName);
                })
                .then(function (data) {
                    //Render profile data in UI
                    $("#photo").attr("src", data.d.PictureUrl);
                    $("#displayName").text(data.d.DisplayName);
                    $("#accountName").text(data.d.AccountName);
                    $("#emailAddress").text(data.d.Email);
                    $("#title").text(data.d.Title);
                    $("#userUrl").attr("href", data.d.UserUrl);
                })
                .done(function () {
                    //Show it
                    $("#mainDiv").show();
                });

        }

    });

}());



Profiles.GetDisplayName = function (appWebUrl, listId, listItemId) {
    listId = listId.substring(1, listId.length - 1);
    var def1 = $.Deferred();
    var executor = new SP.RequestExecutor(appWebUrl);
    executor.executeAsync({
        url: "../_api/web/lists(guid'" + listId +
             "')/getItemByStringId('" + listItemId +
             "')",
        method: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            def1.resolve(JSON.parse(data.body).d.FullName);
        },
        error: function (data) {
            def1.reject(data);
        }
    });
    return def1.promise();
}

Profiles.GetAccountName = function (appWebUrl, hostWebUrl, displayName) {
    var def2 = $.Deferred();
    var executor = new SP.RequestExecutor(appWebUrl);
    executor.executeAsync({
        url: "../_api/SP.AppContextSite(@target)/site/rootWeb/lists/getByTitle('User%20Information%20List')/items?@target='"
            + hostWebUrl + "'&$filter=Title eq '" + displayName + "'",
        method: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            def2.resolve(JSON.parse(data.body).d.results[0].Name);
        },
        error: function (data) {
            def2.reject(data);
        }
    });
    return def2.promise();
}

Profiles.GetPropertiesFor = function (accountName) {
    return jQuery.ajax({
        url: "../_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + encodeURIComponent(accountName) + "'",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
    });
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

