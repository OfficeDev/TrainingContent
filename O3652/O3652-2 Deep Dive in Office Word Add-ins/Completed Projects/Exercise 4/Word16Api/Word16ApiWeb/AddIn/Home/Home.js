/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            // Use this to check whether the API is supported in the Word client.
            if (Office.context.requirements.isSetSupported('WordApi', 1.1)) {
                // attach click handlers to the word document
                $('#addBibliography').click(addBibliography);
                $('#highlightInstances').click(highlightInstances);
            }
            else {
                // Just letting you know that this code will not work with your version of Word.
                console.log('This code requires Word 2016 or greater.');
            }


        });
    };

    function addBibliography() {
        // get reference to hosting Word application
        var context = new Word.RequestContext();
        // Run a batch operation against the Word object model.
        Word.run(function (context) {
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

                // Synchronize the document state by executing the queued commands, 
                // and return a promise to indicate task completion.
                return context.sync().then(function () { }, errorHandler);
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            if (error instanceof OfficeExtension.Error) {
                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
            }
        });
    };

    function highlightInstances() {
        // get reference to hosting Word application
        var context = new Word.RequestContext();
        // Run a batch operation against the Word object model.
        Word.run(function (context) {
            // create search options
            var options = Word.SearchOptions.newObject(context);
            options.matchWildCards = true;

            // get all instances of the word 'Word' in the document
            var searchResults = context.document.body.search("Word", options);
            context.load(searchResults, 'font');

            // Synchronize the document state by executing the queued commands, 
            // and return a promise to indicate task completion.
            return context.sync().then(function () {
                console.log('Found count: ' + searchResults.items.length);

                // Queue a set of commands to change the font for each found item.
                for (var i = 0; i < searchResults.items.length; i++) {
                    searchResults.items[i].font.color = 'purple';
                    searchResults.items[i].font.highlightColor = 'pink';
                    searchResults.items[i].font.bold = true;
                }
                // Synchronize the document state by executing the queued commands, 
                // and return a promise to indicate task completion.
                return context.sync();
            }, errorHandler);
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            if (error instanceof OfficeExtension.Error) {
                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
            }
        });
    };

    function errorHandler(error) {
        console.log("Failed: ErrorCode=" + error.errorCode + ", ErrorMessage=" + error.errorMessage);
        console.log(error.traceMessages);
    }
})();