///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/expenseApp.d.ts" />

'use strict';

module expenseApp {

  var settings:shared.IAdalSettings = {
    tenant:          '30497b7c-5fa6-4284-ba4d-6cece5689dc0',
    clientId:        '59f4d76d-2808-4bbb-8d48-0a0f017fea8c',
    baseSPUrl:       'https://tenant.sharepoint.com/_api/',
    baseOneDriveUrl: 'https://tenant-my.sharepoint.com/_api/v1.0/me',
    aadEndpoints:    {
      /* 'target endpoint to be called': 'target endpoint's resource ID'  */

      // sharepoint site containing lists
      'https://tenant.sharepoint.com/sites/expenseApp/ngconf/_api/': 'https://tenant.sharepoint.com',
      // o365 files api
      'https://tenant-my.sharepoint.com/_api/v1.0/me':               'https://tenant-my.sharepoint.com/'
    }
  };

  angular.module('expenseApp').constant('settings', settings);

}
