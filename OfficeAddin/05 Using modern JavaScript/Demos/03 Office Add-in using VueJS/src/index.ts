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

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.