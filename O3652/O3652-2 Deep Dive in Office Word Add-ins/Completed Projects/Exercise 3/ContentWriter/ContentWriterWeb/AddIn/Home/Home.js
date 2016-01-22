/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            // wire up event handler
            $("#addContentHellowWorld").click(onAddContentHellowWorld);
            $('#addContentHtml').click(onAddContentHtml);
            $('#addContentMatrix').click(onAddContentMatrix);
            $('#addContentOfficeTable').click(onAddContentOfficeTable);
            $('#addContentOfficeOpenXml').click(onAddContentOfficeOpenXml);
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
        var fileName = $("#listOpenXmlContent").val();

        $.ajax({
            url: fileName,
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
})();