var profile = 1;
var appointments=0;
window.trial = true;
window.actionCounter = 0;

$(document).ready(function () {
    $('.profile').hide();
    $('.Trial').hide();
    $('#profile_completion1').appendTo('#trialmessage');
    $('#profile_completion1').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
    

});
$('#close').click(function () {
    if ($('.profile').is(":visible"))
    {
        if (confirm("Are you sure? You must complete registration to use the trial")) {
        	window.history.back();
        }
        else {
            return false();
        }
    }
    $('.profile').hide();
    $('.Trial').hide();
    $('#Trial_Messaging').hide();
    $('.ui-widget-overlay').remove();

});
$('.next').click(function () {
    profile++;
    if (profile == 2) {
        if ($('#view').val()=="Medical")
        {
            $('link[href="/Content/demo.css"]').attr('href', '/Content/demo2.css');
        }
        $('#title').append(" - " + $("#view").val());
        $('#profile_completion1').toggle("slide", function () {
            $('#profile_completion2').appendTo('#trialmessage');
            $('#profile_completion2').toggle("slide");
        });

    }
    else if (profile == 3) {
      
            $('#profile_completion2').toggle("slide", function () {
                $('#profile_completion3').appendTo('#trialmessage');
                $('#profile_completion3').toggle("slide");
            });
        

    }
    else {
        $('.profile').hide();
        $('.Trial').hide();
        $('#Trial_Messaging').hide();
        $('.ui-widget-overlay').remove();
        jQuery.getScript("/Scripts/demo.js");
        $('#spam').hide();
    }
});

$('#close_spam').click(function () {
    $('#spam').hide();
});


$('#import').click(function () {
    $('#Import_Trial').appendTo('#trialmessage');
    $('#Trial_Messaging').show();
    $('#Import_Trial').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
});
$('#export').click(function () {
    $('#Import_Trial').appendTo('#trialmessage');
    $('#Trial_Messaging').show();
    $('#Import_Trial').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
});
$('#text').click(function () {
    $('#Text_Trial').appendTo('#trialmessage');
    $('#Trial_Messaging').show();
    $('#Text_Trial').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
});
$('#mail').click(function () {
    $('#Mail_Trial').appendTo('#trialmessage');
    $('#Trial_Messaging').show();
    $('#Mail_Trial').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
});
$('#contact').click(function () {
    $('#Contact_Trial').appendTo('#trialmessage');
    $('#Trial_Messaging').show();
    $('#Contact_Trial').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
});
$('#print').click(function () {
    $('#Print_Trial').appendTo('#trialmessage');
    $('#Trial_Messaging').show();
    $('#Print_Trial').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
});
$('#marketing').click(function () {
    $('#Marketing_Trial').appendTo('#trialmessage');
    $('#Trial_Messaging').show();
    $('#Marketing_Trial').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
});
$('#all').click(function () {
    toastr.options = { "positionClass": "toast-bottom-right" };
    toastr.info("Loading all appointments...")
});
$('#confirmed').click(function () {
    toastr.options = { "positionClass": "toast-bottom-right" };
    toastr.info("Loading confirmed appointments...")
});
$('#datepicker').click(function () {
    toastr.options = { "positionClass": "toast-bottom-right" };
    toastr.info("Date picker...")
});
$('#testimonials').click(function () {
    toastr.options = { "positionClass": "toast-bottom-right" };
    toastr.info("Loading testimonials...")
});
$('#tutorial').click(function () {
    $('#Tutorial_Trial').appendTo('#trialmessage');
    $('#Trial_Messaging').show();
    $('#Tutorial_Trial').show();
    $("<div></div>").appendTo(document.body).addClass("ui-widget-overlay").css({ width: $(this).width(), height: $(this).height() });
});

$(".reviewButton").live("click", function () {
    toastr.options = { "positionClass": "toast-bottom-right" };
    toastr.info("Loading review form...")
});


$('#feedback').click(function () {
    toastr.options = { "positionClass": "toast-bottom-right" };
    toastr.info("Loading feedback form...")
});


