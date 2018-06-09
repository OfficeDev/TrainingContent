/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

(function () {
    Office.initialize = function (reason) {
        $(document).ready(function () {

            // ensure client supports 1.7 APIs
            if (!Office.context.requirements.isSetSupported('ExcelApi', 1.7)) {
                console.log('Sorry. The tutorial add-in uses Excel.js APIs that are not available in your version of Office.');
            }

            // wire up button click events
            $('#open-dialog').click(openDialog);
        });
    };

    let dialog = null;
    function openDialog() {
        // Call the Office Shared API that opens a dialog
        Office.context.ui.displayDialogAsync(
            'https://localhost:3000/popup.html',
            {height: 45, width: 55},
         
            function (result) {
                dialog = result.value;
                dialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, processMessage);
             }
        );
    }

    function processMessage(arg) {
        $('#user-name').text(arg.message);
        dialog.close();
    }
})();