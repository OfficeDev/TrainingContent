/// <reference path="../App.js" />
(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            // wire up event handler
            $("#addContentHellowWorld").click(onAddContentHellowWorld);
            $('#addContentMatrix').click(onAddContentMatrix);
            $('#addContentOfficeTable').click(onAddContentOfficeTable);
        });
    };

    // write text data to current at document selection 
    function onAddContentHellowWorld() {
        Office.context.document.setSelectedDataAsync("Hello World!", testForSuccess);
    }

    function onAddContentMatrix() {

        // create matrix as an array of arrays
        var matrix = [["First Name", "Last Name"],
                        ["Bob", "White"],
                                    ["Anna", "Conda"],
                                    ["Max", "Headroom"]];

        // insert matrix into Excel document
        Office.context.document.setSelectedDataAsync(matrix, { coercionType: "matrix" }, testForSuccess);
    }

    function onAddContentOfficeTable() {

        // create and populate an Office table
        var myTable = new Office.TableData();
        myTable.headers = [['First Name', 'Last Name']];
        myTable.rows = [['Bob', 'White'], ['Anna', 'Conda'], ['Max', 'Headroom']];

        // add table to Excel document
        Office.context.document.setSelectedDataAsync(myTable, { coercionType: "table" }, testForSuccess)
    }


    function testForSuccess(asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            app.showNotification('Error', asyncResult.error.message);
        }
    }

})();