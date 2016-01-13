  ///<reference path="../../../tools/typings/tsd.d.ts" />
  ///<reference path="../../../tools/typings/expenseApp.d.ts" />

  'use strict';

  module expenseApp {

    var settings:shared.IAdalSettings = {
      tenant:          '0534985e-032e-430a-9b95-60f5277b96f4', //Update with your tenant ID
      clientId:        'b01e72a7-6017-4cf0-b16a-e032f6c869c4', //Update with your client ID
      aadEndpoints:    {
        // sharepoint site containing lists
        'https://cand3.sharepoint.com/sites/ChadDev/ExpenseApp/_api/': 'https://cand3.sharepoint.com',
        // MS Graph API
        'https://graph.microsoft.com/v1.0/me': 'https://graph.microsoft.com/'
      },
      baseSPUrl:       'https://cand3.sharepoint.com/sites/ChadDev/ExpenseApp/_api/',
      baseOneDriveUrl: 'https://graph.microsoft.com/v1.0/me',
    };

    angular.module('expenseApp').constant('settings', settings);

  }  
  