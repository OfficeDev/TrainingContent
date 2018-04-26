(function () {
    'use strict';
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            $('#error-box').hide();
            $('#pending').hide();
            $('.ms-Dropdown').Dropdown();
            $('#translateText').click(doTranslate);
        });
    };

    function doTranslate() {
        $('#error-box').hide('fast');
        var startlang = $('#start-lang').children('.ms-Dropdown-title').text();
        var endlang = $('#end-lang').children('.ms-Dropdown-title').text();

        var startlangcode = $('#start-lang').find('#start-' + startlang.replace(/\s|\./g, ''));
        var endlangcode = $('#end-lang').find('#end-' + endlang.replace(/\s|\./g, ''));

        if (startlangcode.length > 0 && endlangcode.length > 0) {
            var startlangcodeval = startlangcode.val() === 'auto-detect' ? '' : startlangcode.val();

            if (startlangcodeval === '') {
                $('#pending-message').html('Working on your ' + endlang + ' translation request');
            }
            else {
                $('#pending-message').html('Working on your ' + startlang +
                    ' to ' + endlang + ' translation request');
            }
            $('#translate-form').hide('fast');
            $('#pending').show('fast');

            translate(startlangcodeval, endlangcode.val(), function (error) {
                $('#pending').hide('fast');
                $('#translate-form').show('fast');
                if (error) {
                    $('#error-msg').html('ERROR: ' + error);
                    $('#error-box').show('fast');
                }
            });
        }
        else {
            $('#error-msg').html('Select languages!');
            $('#error-box').show('fast');
        }
    }
})();