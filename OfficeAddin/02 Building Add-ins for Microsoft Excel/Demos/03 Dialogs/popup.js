// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

(function () {
    "use strict";
    
       Office.initialize = function() {        
           $(document).ready(function () {  
    
            $('#ok-button').click(sendStringToParentPage);
           });
       }
    
        function sendStringToParentPage() {
            var userName = $('#name-box').val();
            Office.context.ui.messageParent(userName);
        }
    }());