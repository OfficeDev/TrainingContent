/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

(function () {

    Office.onReady().then(function() {
        //If you need to initialize something you can do so here. 
    });

})();


function toggleProtection(args) {
  Excel.run(function (context) {            
    const sheet = context.workbook.worksheets.getActiveWorksheet();          
    sheet.load('protection/protected');

    return context.sync()
        .then(
            function() {
              if (sheet.protection.protected) {
                  sheet.protection.unprotect();
              } else {
                  sheet.protection.protect();
              }
            }
        )
        .then(context.sync);
  })
  .catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
  });
  args.completed();
}