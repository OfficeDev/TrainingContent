// initialize microsoft teams.
microsoftTeams.initialize();

$(document).ready(function () {
    window.authConfig = {
        tenant: '<TENANT>',
        clientId: '<CLIENTID>',
        redirectUri: 'https://<APPNAME>.azurewebsites.net/index.html',
        postLogoutRedirectUri: 'https://<APPNAME>.azurewebsites.net/logout.html',
        endpoints: {
            graph: 'https://graph.microsoft.com'
        },
        displayCall: authenticate,
        cacheLocation: 'localStorage'
    };

    window.appConfig = {
        siteUrl: '<RELATIVE SITE URL>',
        documentLibrary: 'BikeDocuments',
        list: 'BikeInventory',
        connector: window.location.origin + "/connector.ashx"
    };

    window.authContext = new AuthenticationContext(window.authConfig);
    // determine if it's the callback page in a popup window redirecting from authentication page.
    if (window.authContext.isCallback(window.location.hash)) {
        // acquire graph token and notify the main page.
        window.authContext.handleWindowCallback();
        var loginError = window.authContext.getLoginError();
        if (!loginError) {
            window.authContext.acquireToken(window.authConfig.endpoints.graph, function (message, token) {
                if (token) {
                    microsoftTeams.authentication.notifySuccess(token);
                }
                else {
                    microsoftTeams.authentication.notifyFailure("Acquring Graph Token Failed: " + message);
                }
            });
        }
        else {
            microsoftTeams.authentication.notifyFailure("Login Failed: " + loginError);
        }
    }
    else {
        // it's the main page, initialize it.
        initPage();
    }
});

// initialize the page.
function initPage() {
    $("body").show();
    var curUser = window.authContext.getCachedUser();
    if (curUser) {
        showUserInfo(curUser);
        window.authContext.acquireToken(window.authConfig.endpoints.graph, function (message, token) {
            window.localStorage.setItem("graphToken", token);
            if (token) {
                getData();
            }
        });
    }
    else {
        cleanPage();
    }
}

// handle the navigation to Azure AD authorization endpoint when login.
// Microsoft Teams tab needs to explicitly authenticate the user in a pop up window, as it can't redirect to other domains directly.
function authenticate(url) {
    microsoftTeams.authentication.authenticate({
        url: url, width: 500, height: 700, successCallback: authenticateSucceeded, failureCallback: authenticateFailed
    });
}

// callback function called if the login or log out succeeds in the authentication popup.
function authenticateSucceeded(token) {
    $("body").show();
    if (token) {
        window.localStorage.setItem("graphToken", token);

        var curUser = window.authContext.getCachedUser();
        showUserInfo(curUser);
        getData();
    }
    else {
        cleanPage();
    }
}

// callback function called if the login failed in the authentication popup or acquire graph token failed.
function authenticateFailed(message) {
    $("#message").html(message);
}

// navigate to Azure AD authorization endpoint to log out.
// Microsoft Teams tab needs to explicitly log out in a pop up window, as it can't redirect to other domains directly.
// we can't use ADAL's logOut function because it will redirect to the Azure AD authorization endpoint directly.
function logOut() {
    window.authContext.clearCache();
    window.authContext._user = null;
    window.authContext._loginInProgress = false;

    var logout = 'post_logout_redirect_uri=' + encodeURIComponent(window.authContext.config.postLogoutRedirectUri);
    var urlNavigate = window.authContext.instance + window.authContext.config.tenant + '/oauth2/logout?' + logout;
    microsoftTeams.authentication.authenticate({
        url: urlNavigate, width: 400, height: 600, successCallback: authenticateSucceeded
    });
}

// login by ADAL.
function login() {
    window.authContext.login();
}

// clean up the data shown in the page.
function cleanPage() {
    showUserInfo();
    $("#docBin").empty();
    $("#inventoryBin").empty();
    showDetailsPage(false);
}

// show or hide the details page.
function showDetailsPage(show) {
    $("#detailsPage").toggle(show);
    $("#inventoryPage").toggle(!show);
}

// show user info, toggle the login and log Out buttons.
function showUserInfo(user) {
    var signedIn = typeof user !== "undefined" && user !== null;
    var userName = signedIn ? user.profile.name : "";
    window.localStorage.setItem("userName", userName);

    $("#signedInAsLabel").toggle(signedIn);
    $(".app-userDisplay").html(userName).toggle(signedIn);
    $(".app-signIn").toggle(!signedIn);
    $(".app-signOut").toggle(signedIn);
}

// show details page for the selected bike.
function showBike() {
    var item = $(this).data("bike");
    if (!item) {
        return;
    }

    if (item.columnSet.Picture !== null) {
        $("#bikeImage").css("background-image", "url('" + item.columnSet.Picture.Url + "')");
    }

    $("#bikeTitle").text(item.columnSet.Title + " " + item.columnSet.Serial);
    $("#bikeDescription").html(item.columnSet.Description);
    $("#bikeDetailsPrice").text(item.columnSet.Price + " / day");
    $("#bikeDetailsLocation").text(item.columnSet.Location);
    $("#bikeDetailsCondition").text(item.columnSet.Condition);
    $("#detailsPage").data("bike", item);

    showDetailsPage(true);
}

// actions (check out and check in) for a bike.
// it will show waiting message for 1.2 seconds, then toggle the bike's state.
function bikeAction() {
    var jElement = $(this);
    if (jElement.hasClass("wait")) {
        return;
    }

    var isCheckOut = jElement.hasClass("checkOut");
    jElement.removeClass("checkOut checkIn").addClass("wait");
    $(".notifyConnector").hide();
    window.setTimeout(bikeActionCompleted.bind(jElement, isCheckOut), 1200);
}

// function called when the action (check out or check in) for a bike completes.
function bikeActionCompleted(isCheckOut) {
    this.removeClass("wait").addClass(isCheckOut ? "checkIn" : "checkOut");
    this.closest("#detailsPage").data("lastAction", isCheckOut ? "checked out" : "checked in");
    $(".notifyConnector").show();
}

// get documents and bikes.
function getData() {
    acquireSiteId(function () {
        acquireListIds(function () {
            retrieveBikes();
            retrieveDocs();
        });
    });
}

// get documents from sharepoint document library and show them.
function retrieveDocs() {
    var token = getGraphToken();
    var siteId = getSiteId();
    var listId = getListId(window.appConfig.documentLibrary);
    if (!token || !siteId || !listId) {
        return;
    }

    $.ajax({
        type: "GET",
        url: window.authConfig.endpoints.graph + "/beta/sharepoint/sites/" + siteId + "/lists/" + listId + "/items?expand=columnSet",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' + getGraphToken(),
            'Accept': 'application/json'
        }
    }).done(function (response) {
        var docs = response.value;
        for (var i = 0; i < docs.length; i++) {
            var item = docs[i];
            var sDocName = getFileNameWithoutExtension(item.columnSet.LinkFilename);

            var element = $("<a target='_blank'>").attr("href", item.webUrl).addClass("docTile ms-font-m");
            var html = $("<div>");
            var content = $("<div class='docTileContent'>").appendTo(html);
            var text = $("<div class='docTileText'>").text(sDocName).appendTo(content);
            var icon = $("<div class='docTileIcon'><i class='ms-Icon ms-Icon--WordLogo'></i></div>").appendTo(content);
            element.html(html);
            $("#docBin").append(element);
        }
    }).fail(function (response) {
        $("#message").html("Web Request Failed: " + response.responseText);
    });
}

// get bikes from sharepoint list and show them.
function retrieveBikes() {
    var token = getGraphToken();
    var siteId = getSiteId();
    var listId = getListId(window.appConfig.list);
    if (!token || !siteId || !listId) {
        return;
    }

    $.ajax({
        type: "GET",
        url: window.authConfig.endpoints.graph + "/beta/sharepoint/sites/" + siteId + "/lists/" + listId + "/items?expand=columnSet",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    }).done(function (response) {
        var bikes = response.value;
        for (var i = 0; i < bikes.length; i++) {
            var item = bikes[i];

            var element = $("<div class='itemTile ms-font-m'>").data("bike", item);
            var html = $("<div>");

            var image = $("<div class='itemTileImage'>").appendTo(html);
            if (item.columnSet.Picture !== null) {
                image.css("background-image", "url('" + item.columnSet.Picture.Url + "')");
            }

            var content = $("<div class='itemTileContent'>").appendTo(html);
            var text = $("<div class='itemTileText'>").text(item.columnSet.Title + " " + item.columnSet.Serial).appendTo(content);

            if (item.columnSet.Color_x0020_Swatch !== null) {
                var color = $("<div class='itemColorArea'>").appendTo(content);
                var colorSwatch = $("<div class='itemColorSwatch'>").css("background-color", item.columnSet.Color_x0020_Swatch).appendTo(color);
                var colorTitle = $("<div class='itemColorTitle'>").text(item.columnSet.Color_x0020_Scheme).appendTo(color);
            }

            if (item.columnSet.Price !== null) {
                var price = $("<div class='itemFieldArea'>").appendTo(content);
                price.append("<div class='itemFieldLabel'>Price</div>");
                $("<div class='itemFieldValue'>").text(item.columnSet.Price).appendTo(price);
                price.append("<span> / day</span>");
            }

            if (item.columnSet.Location !== null) {
                var location = $("<div class='itemFieldArea'>").appendTo(content);
                location.append("<div class='itemFieldLabel'>Location</div>");
                $("<div class='itemFieldValue'>").text(item.columnSet.Location).appendTo(location);
            }


            element.html(html).click(showBike);
            $("#inventoryBin").append(element);
        }
    }).fail(function (response) {
        $("#message").html("Web Request Failed: " + response.responseText);
    });
}

// acquire the site Id according the site url
function acquireSiteId(cb) {
    var token = getGraphToken();
    if (!token) {
        return;
    }

    $.ajax({
        type: "GET",
        url: window.authConfig.endpoints.graph + "/beta/sharepoint:" + window.appConfig.siteUrl,
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    }).done(function (response) {
        window.localStorage.setItem("siteId", response.id);
        cb();
    });
}

// acquire the ids of the lists according their name
function acquireListIds(cb) {
    var siteId = getSiteId();
    if (!siteId) {
        return;
    }

    $.ajax({
        type: "GET",
        url: window.authConfig.endpoints.graph + "/beta/sharepoint/sites/" + siteId + "/lists",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' + getGraphToken(),
            'Accept': 'application/json'
        }
    }).done(function (response) {
        var lists = response.value;
        var listId = findListId(lists, window.appConfig.list);
        window.localStorage.setItem(window.appConfig.list, findListId(lists, window.appConfig.list));
        window.localStorage.setItem(window.appConfig.documentLibrary, findListId(lists, window.appConfig.documentLibrary));
        cb();
    });
}

// find list id according list name in an array of list.
function findListId(lists, listName) {
    for (var key in lists) {
        var list = lists[key];
        if (list.name === listName) {
            return list.id;
        }
    }
    return null;
}

// get graph token from localStorage
function getGraphToken() {
    return window.localStorage.getItem("graphToken");
}

// get site id from localStorage
function getSiteId() {
    return window.localStorage.getItem("siteId");
}

// get list id according list name from localStorage
function getListId(listName) {
    return window.localStorage.getItem(listName);
}

// get the logged in user'name from localStorage
function getUserName() {
    return window.localStorage.getItem("userName");
}

// get file name from the full file name without the extension
function getFileNameWithoutExtension(fileName) {
    var dotIndex = fileName.indexOf(".");
    if (dotIndex > 0) {
        return fileName.substring(0, dotIndex);
    }
    return fileName;
}

// send a hello world message to a Microsoft Teams Connector.
function sayHelloWorld() {
    sendConnectorMessage({ "text": "Hello World!" });
}

// send a Card message to a Microsoft Teams Connector to notify the last action of the bike.
function notifyConnector() {
    var container = $(this).closest("#detailsPage");
    var lastAction = container.data("lastAction");
    var bike = container.data("bike");
    if (lastAction && bike) {
        var message = {
            "text": getUserName() + " " + lastAction + " " + bike.columnSet.Title,
            "activityTitle": bike.columnSet.Title + " " + bike.columnSet.Serial,
            "activityText": bike.columnSet.Description,
            "activityImage": bike.columnSet.Picture.Url
        };
        sendConnectorMessage(message, function () {
            container.data("lastAction", "");
            $(".notifyConnector").hide();
        });
    }
}

// send a Card message to a Microsoft Teams Connector.
// if succeeded, the cb will be called.
// if failed, the error message will be shown.
function sendConnectorMessage(message, cb) {
    $.ajax({
        type: "GET",
        url: window.appConfig.connector,
        contentType: "application/json",
        data: message
    }).done(function (response) {
        if (typeof cb === "function") {
            cb();
        }
    }).fail(function (response) {
        $("#message").html("Notify Connector Failed: " + JSON.stringify(response));
    });
}
