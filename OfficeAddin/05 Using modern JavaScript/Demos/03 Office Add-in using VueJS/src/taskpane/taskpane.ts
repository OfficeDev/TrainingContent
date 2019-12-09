/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */
import * as Vue from "vue";
import root from './components/Root.vue';

Office.onReady(info => {
  if (info.host === Office.HostType.Excel) {
    var app = new Vue({
      el: "#app",
      render: h => h(root, {})
    });
    console.log(app);
  }
});
