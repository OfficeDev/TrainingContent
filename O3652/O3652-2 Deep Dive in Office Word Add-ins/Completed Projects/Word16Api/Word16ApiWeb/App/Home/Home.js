/// <reference path="../App.js" />

(function () {
  "use strict";

  // The initialize function must be run each time a new page is loaded
  Office.initialize = function (reason) {
    $(document).ready(function () {
      app.initialize();

      // attach click handler to the word document
      $('#addBibliography').click(addBibliography);
      $('#highlightInstances').click(highlightInstances);
    });
  };

  function addBibliography() {
    // get reference to hosting Word application
    var context = new Word.RequestContext();

    // insert a H1 for the new paragraph to the end of the document
    var bibliographyParagraph = context.document.body.insertParagraph("Bibliography", "end");
    bibliographyParagraph.style = "Heading 1";

    // create one book entry
    var bookOneTitle = context.document.body.insertParagraph("Design Patters, Elements of Reusable Object-Oriented Software", "end");
    bookOneTitle.style = "Book Title";
    var bookOneAuthors = context.document.body.insertParagraph("by Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides", "end");
    bookOneAuthors.style = "Subtle Emphasis";

    // create another book entry
    var bookTwoTitle = context.document.body.insertParagraph("Refactoring: Improving the Design of Existing Code", "end");
    bookTwoTitle.style = "Book Title";
    var bookTwoAuthors = context.document.body.insertParagraph("by Martin Fowler", "end");
    bookTwoAuthors.style = "Subtle Emphasis";

    // execute queued operations
    context.executeAsync().then(function () { }, errorHandler);
  };

  function highlightInstances() {
    // get reference to hosting Word application
    var context = new Word.RequestContext();

    // create search options
    var options = Word.SearchOptions.newObject(context);
    options.matchCase = true;

    // get all instances of the word 'Word' in the document
    var results = context.document.body.search("Word", options);
    context.load(results);

    // establish ID's for each of the items in the results
    context.references.add(results);

    // execute queued operations
    context.executeAsync().then(
        function () {
          // for all instances found...
          for (var i = 0; i < results.items.length; i++) {
            // highlight the item in the document
            results.items[i].font.highlightColor = "#FFFF00";
          }

          // remove all the references
          context.references.remove(results);
          // execute queued operations
          context.executeAsync();
        }, errorHandler);
  };

  function errorHandler (error) {
    console.log("Failed: ErrorCode=" + error.errorCode + ", ErrorMessage=" + error.errorMessage);
    console.log(error.traceMessages);
  }

})();