// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function getConfig() {
    var config = {};
  
    config.gitHubUserName = Office.context.roamingSettings.get('gitHubUserName');
    config.defaultGistId = Office.context.roamingSettings.get('defaultGistId');
  
    return config;
  }
  
  function setConfig(config, callback) {
    Office.context.roamingSettings.set('gitHubUserName', config.gitHubUserName);
    Office.context.roamingSettings.set('defaultGistId', config.defaultGistId);
  
    Office.context.roamingSettings.saveAsync(callback);
  }