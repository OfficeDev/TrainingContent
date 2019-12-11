/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
import "zone.js"; // Required for Angular
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import AppModule from "./app/app.module";
/* global console, document, Office */

Office.initialize = () => {
  document.getElementById("sideload-msg").style.display = "none";

  // Bootstrap the app
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(error => console.error(error));
};
