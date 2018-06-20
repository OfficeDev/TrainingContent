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