"use strict";

window.Wingtip = window.Wingtip || {};

$(document).ready(function () {
    Wingtip.WelcomeViewModel.init();

    var showImage = Wingtip.Utilities.getQueryStringParameter("ShowImage");
    if (showImage=="true")
        $("#portrait").show();
    else
        $("#portrait").hide();

    ko.applyBindings(Wingtip.WelcomeViewModel);
});
