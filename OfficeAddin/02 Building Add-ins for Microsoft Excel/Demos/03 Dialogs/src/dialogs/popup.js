/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function () {
    "use strict";
    
    Office.onReady().then(function() {
        document.getElementById("ok-button").onclick = sendStringToParentPage;
    });
    
    function sendStringToParentPage() {
        var userName = document.getElementById("name-box").value;
        Office.context.ui.messageParent(userName);
    }
}());