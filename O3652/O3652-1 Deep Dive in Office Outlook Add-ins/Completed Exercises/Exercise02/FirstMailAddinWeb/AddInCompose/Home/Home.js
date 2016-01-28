/// <reference path="../App.js" />

(function () {
  'use strict';

  // yandex service endpoint & api key
  var yandexApiKey = '';
  var yandexEndpoint = 'https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-es&key=' + yandexApiKey;

  // The initialize function must be run each time a new page is loaded
  Office.initialize = function (reason) {
    $(document).ready(function () {
      app.initialize();

      // attach event handler to button
      $("#translateEmail").click(translateText);
    });
  };

  /**
   * Creates the query portion of the request to translate.
   * @param {string} textToTranslate - The string to translate into a different language.
   * @returns {string} URL escaped string that will be used in the HTTP request query.
   */
  function getTranslationQuery(textToTranslate) {
    // break up the lines to translate into an array.
    var linesToTranslate = textToTranslate.split('\n');
    var lines = [];

    // loop through each line and remove all blank lines
    for (var x = 0; x < linesToTranslate.length; x++) {
      if (linesToTranslate[x] != "") {
        lines.push(linesToTranslate[x]);
      }
    }

    // create the query for the querystring request
    var query = '&text=';
    // loop through all lines to translate URL encoding each one
    // the service allows multiple lines to be translated... each is submitted
    //  on it's own 'text=' argument, so append them together
    for (var y = 0; y < (lines.length - 1) ; y++) {
      query += encodeURI(lines[y].replace(/ /g, "+")) + "&text=";
    }
    query += lines[lines.length - 1].replace(/ /g, "+");

    return query;
  }

  /**
   * Translate the selected text.
   */
  function translateText() {
    // get the selected content from the email as plain text
    Office.context.mailbox.item.getSelectedDataAsync(Office.CoercionType.Text, {}, function (selectedData) {
      // extract the actual content from the selection & build the query
      var translateQuery = getTranslationQuery(selectedData.value.data);

      // create the HTTP translation request, appending the query to the end
      var translationServiceEndpoint = yandexEndpoint + translateQuery;

      // issue the translation request
      $.ajax({
        url: translationServiceEndpoint,
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function (response) {
          var translatedText = response.text;
          var escapedText = '';

          // upon a successful response, join the lines together 
          //  but separate each with <BR>
          for (var i = 0; i < translatedText.length; i++) {
            escapedText += translatedText[i] + "<br /><br />";
          }

          // write the escaped text back to the selected text in the email as HTML
          Office.context.mailbox.item.setSelectedDataAsync(escapedText, { coercionType: Office.CoercionType.Html }, function(result) {
            console.log(result);
          });
        }
      });
    });
  };

})();