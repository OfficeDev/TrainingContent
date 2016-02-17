/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            // Use this to check whether the API is supported in the Excel client.
            if (Office.context.requirements.isSetSupported('ExcelApi', 1.1)) {
                // attach click handlers to the word document
                $('#addWorksheet').click(addWorksheet);
                $('#addRange').click(addRange);
                $('#addFormattedData').click(addFormattedData);
            }
            else {
                // Just letting you know that this code will not work with your version of Excel.
                console.log('This code requires Excel 2016 or greater.');
            }
        });
    };

    function addWorksheet() {
        // get reference to hosting Excel application
        var context = new Excel.RequestContext();

        Excel.run(function (context) {
            // create a new worksheet
            var worksheetName = $('#worksheetName').val();
            var newWorksheet = context.workbook.worksheets.add(worksheetName);

            // create the worksheet and set as active worksheet
            context.load(newWorksheet);
            newWorksheet.activate();
            return context.sync().then(function () {
            }, errorHandler);
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            if (error instanceof OfficeExtension.Error) {
                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
            }
        });
    };
    function addRange() {
        // get reference to hosting Excel application
        var context = new Excel.RequestContext();
        Excel.run(function (context) {
            // get reference to current worksheet
            var currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
            // get a list of all worksheets in the current workbook
            var worksheets = context.workbook.worksheets.load();

            return context.sync().then(function () {

                // create a one-dimensional array of all worksheets in the workbook
                var worksheetList = [];
                worksheetList.push(['Worksheets in the Workbook']);
                for (var i = 0; i < worksheets.items.length; i++) {
                    worksheetList.push([worksheets.items[i].name]);
                };

                // get a range to write to
                var rangeSpec = "A1:A" + worksheetList.length;
                var range = currentWorksheet.getRange(rangeSpec);
                range.values = worksheetList;

                // execute the change
                context.sync().then(function () { }, errorHandler);
            }, errorHandler);
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            if (error instanceof OfficeExtension.Error) {
                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
            }
        });
    };

    function addFormattedData() {
        // get reference to hosting Excel application
        var context = new Excel.RequestContext();
        Excel.run(function (context) {
                // define a range
                var rangeAddress = "C3:E5";

                // define values in the range
                var values = [
                  ['Expense', 'Date', 'Amount'],
                  ['Lunch', '7/15/2015', 45.98],
                  ['Taxi', '7/15/2015', 18.22]
                ];

                // define the formats
                var formats = [
                  [null, null, null],
                  [null, 'mmmm dd, yyyy', '$#,##0.00'],
                  [null, 'mmmm dd, yyyy', '$#,##0.00']
                ];

                // get the range in the worksheet
                var range = context.workbook.worksheets.getActiveWorksheet().getRange(rangeAddress);
                range.numberFormat = formats;
                range.values = values;
                range.load();
                // execute the change
                context.sync().then(function () { }, errorHandler);
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            if (error instanceof OfficeExtension.Error) {
                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
            }
        });
    };


    function errorHandler(error) {
        console.log(JSON.stringify(error));
    };
})();