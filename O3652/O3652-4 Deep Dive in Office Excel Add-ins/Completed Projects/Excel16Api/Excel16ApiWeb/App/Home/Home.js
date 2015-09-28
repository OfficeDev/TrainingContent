/// <reference path="../App.js" />

(function () {
  "use strict";

  // The initialize function must be run each time a new page is loaded
  Office.initialize = function (reason) {
    $(document).ready(function () {
      app.initialize();

      $('#addWorksheet').click(addWorksheet);
      $('#addRange').click(addRange);
      $('#addFormattedData').click(addFormattedData);
    });
  };

  function addWorksheet() {
    // get reference to hosting Word application
    var context = new Excel.RequestContext();

    // create a new worksheet
    var worksheetName = $('#worksheetName').val();
    var newWorksheet = context.workbook.worksheets.add(worksheetName);

    // create the worksheet and set as active worksheet
    context.load(newWorksheet);
    newWorksheet.activate();

    context.executeAsync().then(function () { }, errorHandler);
  };

  function addRange() {
    // get reference to hosting Word application
    var context = new Excel.RequestContext();

    // get reference to current worksheet
    var currentWorksheet = context.workbook.worksheets.getActiveWorksheet();

    // get a list of all worksheets in the current workbook
    var worksheets = context.workbook.worksheets.load();

    context.executeAsync().then(function () {
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
      context.executeAsync().then(function () { }, errorHandler);
    }, errorHandler);
  };

  function addFormattedData() {
    // get reference to hosting Word application
    var context = new Excel.RequestContext();

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

    // execute the changes
    context.executeAsync().then(function () { }, errorHandler);
  };

  function errorHandler(error) {
    console.log(JSON.stringify(error));
  };
})();