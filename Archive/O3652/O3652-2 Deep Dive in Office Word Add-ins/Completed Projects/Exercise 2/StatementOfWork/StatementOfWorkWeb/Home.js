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

            // Add event handlers here.....
            $('#addContentHelloWorld').click(onAddContentHellowWorld);
            $('#SetDataAsHTML').click(onAddContentHtml);
            $('#SetDataAsMatrix').click(onAddContentMatrix);
            $('#SetDataAsTable').click(onAddContentOfficeTable);
            $('#SetDataAsOoxml').click(onAddContentOfficeOpenXml);
        });
    };

    function onAddContentHellowWorld() {
        Office.context.document.setSelectedDataAsync("Hello World!", testForSuccess);
    }
    function onAddContentHtml() {
        // create HTML element
        var div = $("<div>")
            .append($("<h2>").text("My Heading"))
            .append($("<p>").text("This is paragraph 1"))
            .append($("<p>").text("This is paragraph 2"))

        // insert HTML into Word document
        Office.context.document.setSelectedDataAsync(div.html(), { coercionType: "html" }, testForSuccess);
    }

    function onAddContentMatrix() {
        // create matrix as an array of arrays
        var matrix = [["First Name", "Last Name"],
        ["Bob", "White"],
        ["Anna", "Conda"],
        ["Max", "Headroom"]];

        // insert matrix into Word document
        Office.context.document.setSelectedDataAsync(matrix, { coercionType: "matrix" }, testForSuccess);
    }

    function onAddContentOfficeTable() {

        // create and populate an Office table
        var myTable = new Office.TableData();
        myTable.headers = [['First Name', 'Last Name']];
        myTable.rows = [['Bob', 'White'], ['Anna', 'Conda'], ['Max', 'Headroom']];

        // add table to Word document
        Office.context.document.setSelectedDataAsync(myTable, { coercionType: "table" }, testForSuccess)
    }

    function onAddContentOfficeOpenXml() {
        $.ajax({
            url: "OpenXMLChart.xml",
            type: "GET",
            dataType: "text",
            success: function (xml) {
                Office.context.document.setSelectedDataAsync(xml, { coercionType: "ooxml" }, testForSuccess)
            }
        });
    }

    function testForSuccess(asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            app.showNotification('Error', asyncResult.error.message);
        }
    }

    //$$(Helper function for treating errors, $loc_script_taskpane_home_js_comment34$)$$
    function errorHandler(error) {
        // $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
        showNotification("Error:", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notificationHeader").text(header);
        $("#notificationBody").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();