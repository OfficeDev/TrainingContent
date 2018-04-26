/// <reference path="/Scripts/FabricUI/MessageBanner.js" />

(function () {
    "use strict";

    var messageBanner;

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Initialize the FabricUI notification mechanism and hide it
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();

            $('#addRange').click(addRange);
            $('#addFormattedData').click(addFormattedData);
            $('#insertData').click(insertData);
            $('#sort').click(sort);
            $('#filter').click(filter);
            $('#report').click(report);
        });
    }

    function addRange() {
        var context = new Excel.RequestContext();
        Excel.run(function (context) {
            var currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
            var worksheets = context.workbook.worksheets.load();
            return context.sync().then(function () {
                var worksheetList = [];
                worksheetList.push(['Worksheets in the Workbook']);
                for (var i = 0; i < worksheets.items.length; i++) {
                    worksheetList.push([worksheets.items[i].name]);
                };
                var rangeSpec = "A1:A" + worksheetList.length;
                var range = currentWorksheet.getRange(rangeSpec);
                range.values = worksheetList;
                context.sync().then(function () { }, errorHandler);
            }, errorHandler);
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            if (error instanceof OfficeExtension.Error) {
                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
            }
        });
    }

    function addFormattedData() {
        var context = new Excel.RequestContext();
        Excel.run(function (context) {
            var rangeAddress = "C3:E5";
            var values = [
                ['Expense', 'Date', 'Amount'],
                ['Lunch', '7/15/2015', 45.98],
                ['Taxi', '7/15/2015', 18.22]
            ];
            var formats = [
                [null, null, null],
                [null, 'mmmm dd, yyyy', '$#,##0.00'],
                [null, 'mmmm dd, yyyy', '$#,##0.00']
            ];

            var range = context.workbook.worksheets.getActiveWorksheet().getRange(rangeAddress);
            range.numberFormat = formats;
            range.values = values;
            range.load();
            context.sync().then(function () { }, errorHandler);
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            if (error instanceof OfficeExtension.Error) {
                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
            }
        });
    }

    function insertData() {
        Excel.run(function (ctx) {
            var sheet = ctx.workbook.worksheets.add("Data");
            sheet.activate();
            var range = sheet.getRange("A1:E11");
            range.values = [[
                "Date",
                "Merchant",
                "Category",
                "Sub-Category",
                "Amount"],
            [
                "01/12/2014",
                "WHOLE FOODS MARKET",
                "Merchandise & Supplies",
                "Groceries",
                "84.99"
            ],
            [
                "01/13/2014",
                "COSTCO GAS",
                "Transportation",
                "Fuel",
                "52.20"
            ],
            [
                "01/13/2014",
                "COSTCO WHOLESALE",
                "Merchandise & Supplies",
                "Wholesale Stores",
                "163.67"
            ],
            [
                "01/13/2014",
                "ITUNES",
                "Merchandise & Supplies",
                "Internet Purchase",
                "9.83"
            ],
            [
                "01/13/2014",
                "SMITH BROTHERS FARMS INC",
                "Merchandise & Supplies",
                "Groceries",
                "21.45"
            ],
            [
                "01/14/2014",
                "SHELL",
                "Transportation",
                "Fuel",
                "44.00"
            ],
            [
                "01/14/2014",
                "WHOLE FOODS MARKET",
                "Merchandise & Supplies",
                "Groceries",
                "17.98"
            ],
            [
                "01/15/2014",
                "BRIGHT EDUCATION SERVICES",
                "Other",
                "Education",
                "59.92"
            ],
            [
                "01/15/2014",
                "BRIGHT EDUCATION SERVICES",
                "Other",
                "Education",
                "59.92"
            ],
            [
                "01/17/2014",
                "SMITH BROTHERS FARMS INC-HQ",
                "Merchandise & Supplies",
                "Groceries",
                "21.45"
            ]];
            range.getEntireColumn().format.autofitColumns();
            range.getEntireRow().format.autofitRows();

            var table = ctx.workbook.tables.add("Data!A1:E11", true);
            return ctx.sync().then(function () {
            });
        }).catch(errorHandler);
    }

    function sort() {
        Excel.run(function (ctx) {
            var sheet = ctx.workbook.worksheets.getItem("Data");
            sheet.activate();
            var sortRange = sheet.getRange("A1:E1").getEntireColumn().getUsedRange();
            sortRange.sort.apply([
                {
                    key: 0,
                    ascending: false,
                },
            ]);
            return ctx.sync().then(function () {
            })
        }).catch(errorHandler);
    }

    function filter() {
        Excel.run(function (ctx) {
            var sheet = ctx.workbook.worksheets.getItem("Data");
            sheet.activate();
            var table = sheet.tables.getItemAt(0);
            var filter = table.columns.getItemAt(3).filter;
            filter.applyValuesFilter(["Fuel", "Education"]);
            return ctx.sync().then(function () {
            })
        }).catch(errorHandler);
    }

    function report() {
        Excel.run(function (ctx) {
            var sheet = ctx.workbook.worksheets.add("Summary");
            sheet.activate();
            var sumRange = sheet.getRange("A1:B6");
            sumRange.values = [['Category', 'Total'],
            ['Groceries', '=SUMIF( Data!D2:D100, "Groceries", Data!E2:E100 )'],
            ['Fuel', '=SUMIF( Data!D2:D100, "Fuel", Data!E2:E100 )'],
            ['Wholesale Store', '=SUMIF( Data!D2:D100, "Wholesale Stores", Data!E2:E100 )'],
            ['Internet Purchase', '=SUMIF( Data!D2:D100, "Internet Purchase", Data!E2:E100 )'],
            ['Education', '=SUMIF( Data!D2:D100, "Education", Data!E2:E100 )']];

            ctx.workbook.tables.add("Summary!A1:B6", true);
            var chartRange = sheet.getRange("A1:B6");
            var chart = ctx.workbook.worksheets.getItem("Summary").charts.add("Pie", chartRange);
            chart.title.text = "Spending based on catagory";
            sheet.protection.protect();
            return ctx.sync().then(function () {

            })
                .then(ctx.sync);
        }).catch(errorHandler);
    }

    // Helper function for treating errors
    function errorHandler(error) {
        // Always be sure to catch any accumulated errors that bubble up from the Excel.run execution
        showNotification("Error", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();
