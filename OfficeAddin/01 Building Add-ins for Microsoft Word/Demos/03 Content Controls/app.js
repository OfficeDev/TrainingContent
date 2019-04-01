/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';
import { base64Image } from "./base64Image";
(function () {
    Office.initialize = function (reason) {
        $(document).ready(function () {

            // ensure client supports 1.3 APIs
            if (!Office.context.requirements.isSetSupported('WordApi', 1.3)) {
                console.log('Sorry. The tutorial add-in uses Word.js APIs that are not available in your version of Office.');
            }

            // wire up button click events
            $('#create-content-control').click(createContentControl);
            $('#replace-content-in-control').click(replaceContentInControl);
        });
    };

    function createContentControl() {
        Word.run(function (context) {
            const serviceNameRange = context.document.getSelection();
            const serviceNameContentControl = serviceNameRange.insertContentControl();
            serviceNameContentControl.title = "Service Name";
            serviceNameContentControl.tag = "serviceName";
            serviceNameContentControl.appearance = "Tags";
            serviceNameContentControl.color = "blue";

            return context.sync();
        })
        .catch(function (error) {
            console.log("Error: " + error);
            if (error instanceof OfficeExtension.Error) {
                console.log("Debug info: " + JSON.stringify(error.debugInfo));
            }
        });
    }

    function replaceContentInControl() { 
        Word.run(function (context) {
            const serviceNameContentControl = context.document.contentControls.getByTag("serviceName").getFirst();
            serviceNameContentControl.insertText("Fabrikam Online Productivity Suite", "Replace");

            return context.sync();
        })
        .catch(function (error) {
            console.log("Error: " + error);
            if (error instanceof OfficeExtension.Error) {
                console.log("Debug info: " + JSON.stringify(error.debugInfo));
            }
        });
    }
})();