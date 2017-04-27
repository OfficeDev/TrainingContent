// Helper function to generate an API request
// URL to the Yandex translator service
function generateRequestUrl(sourcelang, targetlang, text) {
    // Split the selected data into individual lines
    var tempLines = text.split(/\r\n|\r|\n/g);
    var lines = [];

    // Add non-empty lines to the data to translate
    for (var i = 0; i < tempLines.length; i++)
        if (tempLines[i] != '')
            lines.push(tempLines[i]);

    // Add each line as a 'text' query parameter
    var encodedText = '';
    for (var i = 0; i < (lines.length); i++) {
        encodedText += '&text=' + encodeURI(lines[i].replace(/ /g, '+'));
    }

    // API Key for the yandex service
    // Get one at translate.yandex.com/developers
    var apiKey = 'trnsl.1.1.20170426T063944Z.17ad46ea0348105e.ec805ac9e96e1fcef6ce2624fcb40c8f34426692';

    var langspec = sourcelang.length > 0 ? sourcelang + '-' + targetlang : targetlang;

    return 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='
        + apiKey + '&lang=' + langspec + encodedText;
}

function translate(sourcelang, targetlang, callback) {
    Office.context.mailbox.item.getSelectedDataAsync('text', function (ar) {
        // Make sure there is a selection
        if (ar === undefined || ar === null ||
            ar.value === undefined || ar.value === null ||
            ar.value.data === undefined || ar.value.data === null) {
            // Display an error message
            callback('No text selected! Please select text to translate and try again.');
            return;
        }

        try {
            // Generate the API call URL
            var requestUrl = generateRequestUrl(sourcelang, targetlang, ar.value.data);

            $.ajax({
                url: requestUrl,
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function (response) {
                    var translatedText = response.text;
                    var textToWrite = '';

                    // The response is an array of one or more translated lines.
                    // Append them together with <br/> tags.
                    for (var i = 0; i < translatedText.length; i++)
                        textToWrite += translatedText[i] + '<br/>';

                    // Replace the selected text with the translated version
                    Office.context.mailbox.item.setSelectedDataAsync(textToWrite, { coercionType: 'html' }, function (asyncResult) {
                        // Signal that we are done.
                        callback();
                    });
                }
            });
        }
        catch (err) {
            // Signal that we are done.
            callback(err.message);
        }
    });
}