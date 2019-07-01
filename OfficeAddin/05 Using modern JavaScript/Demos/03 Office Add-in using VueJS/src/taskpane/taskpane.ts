// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as Vue from 'vue';
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