yam.connect.loginButton("#yammer-login", function (response) {

    if (response.authResponse) {

        //current user information
        yam.platform.request({
            url: "https://api.yammer.com/api/v1/users/current.json",
            method: "GET",
            success: function (data) {
                $("#yammer-login").hide();
                $("#portraitCaption").text("Welcome to Yammer, " + data.full_name + "!");
                $("#portrait").attr("src", data.mugshot_url);
            },
            error: function (err) {
                alert(JSON.stringify(err));
            }
        });

        //current user feed
        YammerViewModel.getMyFeed().then(
            function (messages) {

                YammerViewModel.clear_messages();

                for (var i = 0; i < messages.length; i++) {

                    var feedMessage = new YammerMessage(messages[i].body.rich, messages[i].sender_id, "");
                    YammerViewModel.push_message(feedMessage);
                    
                    //get the display name of the sender
                    YammerViewModel.getUserFullName(messages[i].sender_id).then(
                        function (data) {
                            
                            for (var m = 0; m < YammerViewModel.get_messages()().length; m++) {
                                if (YammerViewModel.get_messages()()[m].get_senderId() === data.id) {
                                    YammerViewModel.get_messages()()[m].set_senderName(data.full_name);
                                }
                            }

                        },
                        function (err) {
                            alert(JSON.stringify(err));
                        }
                    );

                }
            },
            function (err) {
                alert(JSON.stringify(err));
            }
        );

    }
    else {
        $("#yammer-login").text("Not logged in.");
    }

});


(function () {
    "use strict";

    $(function () {
        ko.applyBindings(YammerViewModel, document.getElementById("feedDisplay"));
    });

}());


var YammerMessage = function (messageBody, senderId, senderName) {

    var body = ko.observable(messageBody),
        sender_id = ko.observable(senderId),
        sender_name = ko.observable(senderName),
        set_body = function (v) { body(v); },
        get_body = function () { return body(); },
        set_senderId = function (v) { sender_id(v); },
        get_senderId = function () { return sender_id(); },
        set_senderName = function (v) { sender_name(v); },
        get_senderName = function () { return sender_name(); };

    return {
        set_body: set_body,
        get_body: get_body,
        set_senderId: set_senderId,
        get_senderId: get_senderId,
        set_senderName: set_senderName,
        get_senderName: get_senderName
    };
}

var YammerViewModel = function () {

    var feedMessages = ko.observableArray();

    var get_messages = function () {
        return feedMessages;
    };

    var push_message = function (feedMessage) {
        feedMessages.push(feedMessage);
    };

    var clear_messages = function () {
        feedMessages.removeAll();
    };

    var getMyFeed = function () {

        var deferred = $.Deferred();

        yam.platform.request({
            url: "https://www.yammer.com/api/v1/messages/my_feed.json",
            method: "GET",
            data: {
                "threaded": true,
                "limit": 50
            },
            success: function (data) {
                deferred.resolve(data.messages);
            },
            error: function (err) {
                deferred.reject(err);
            }
        })

        return deferred.promise();

    };

    var getUserFullName = function (userId) {

        var deferred = $.Deferred();

        yam.platform.request({
            url: "https://www.yammer.com/api/v1/users/" + userId + ".json",
            method: "GET",
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (err) {
                deferred.reject(err);
            }
        })

        return deferred.promise();


    };

    return {
        getUserFullName: getUserFullName,
        getMyFeed: getMyFeed,
        get_messages: get_messages,
        push_message: push_message,
        clear_messages: clear_messages
    };


}();

