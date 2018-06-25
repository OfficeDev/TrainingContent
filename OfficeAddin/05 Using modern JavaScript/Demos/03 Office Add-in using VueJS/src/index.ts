/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import * as OfficeHelpers from '@microsoft/office-js-helpers';
import Vue  from 'vue';
import root from './components/Root.vue';

// The initialize function must be run each time a new page is loaded
Office.initialize = (reason) => {
  var app = new Vue({
    el: "#app",
    render: h => h(root, {}),
    comments: { root }
  });
  console.log(app);
};

async function run() {
  try {
    await Excel.run(async context => {
      /**
       * Insert your Excel code here
       */
      const range = context.workbook.getSelectedRange();

      // Read the range address
      range.load('address');

      // Update the fill color
      range.format.fill.color = 'yellow';

      await context.sync();
      console.log(`The range address was ${range.address}.`);
      });
  } catch(error) {
    OfficeHelpers.UI.notify(error);
    OfficeHelpers.Utilities.log(error);
  };
}

