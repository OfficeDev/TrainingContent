/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, require */

const ssoAuthHelper = require("./../helpers/ssoauthhelper");

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("getGraphDataButton").onclick = ssoAuthHelper.getGraphData;
  }
});
