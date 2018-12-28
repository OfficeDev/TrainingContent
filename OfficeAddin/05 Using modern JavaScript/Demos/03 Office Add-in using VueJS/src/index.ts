/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import Vue  from 'vue';
import root from './components/Root.vue';

Office.initialize = (reason) => {
  var app = new Vue({
    el: "#app",
    render: h => h(root, {}),
    comments: { root }
  });
  console.log(app);
};

