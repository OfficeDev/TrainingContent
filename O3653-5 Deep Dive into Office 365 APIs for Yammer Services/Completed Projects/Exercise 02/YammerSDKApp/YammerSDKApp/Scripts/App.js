yam.connect.loginButton("#yammer-login", function (response) {

    if (response.authResponse) {
        $("#yammer-login").text("Welcome to Yammer!");
    }
    else {
        $("#yammer-login").text("Not logged in.");
    }

});


jQuery(function () {

    $("#searchButton").click(function () {

        yam.getLoginStatus(function (response) {

            if (response.authResponse) {

                yam.platform.request({
                    url: "https://www.yammer.com/api/v1/search.json",
                    method: "GET",
                    data: {
                        "search": $("#searchText").val(),
                        "page": 1,
                        "num_per_page": 20
                    },
                    success: function (data) {
                        $("#searchResults").html("<div class='col-md-12'><h3>Search Results</h3></div>");
                        for (var i = 0; i < data.messages.messages.length; i++) {
                            $("#searchResults").append("<div class='col-md-12'>" + data.messages.messages[i].body.rich + "</div>");
                        }
                    },
                    error: function (err) {
                        alert(JSON.stringify(err));
                    }
                })

            }
            else {
                alert("You are logged out of Yammer");
            }

        });

    });

});


