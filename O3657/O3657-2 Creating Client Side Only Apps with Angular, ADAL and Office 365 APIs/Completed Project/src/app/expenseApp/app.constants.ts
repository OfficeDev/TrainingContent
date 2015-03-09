///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/expenseApp.d.ts" />

'use strict';

module expenseApp {

    var settings: shared.IAdalSettings = {
        tenant: '30497b7c-5fa6-4284-ba4d-6cece5689dc0',
        clientId: '59f4d76d-2808-4bbb-8d48-0a0f017fea8c',
        baseSPUrl: 'https://pso365apis01.sharepoint.com/sites/expenseApp/ngconf/_api/',
        baseOneDriveUrl: 'https://pso365apis01-my.sharepoint.com/_api/v1.0/me',
        aadEndpoints:
            {
                /* 'target endpoint to be called': 'target endpoint's resource ID'  */

                // sharepoint site containing lists
                'https://pso365apis01.sharepoint.com/sites/expenseApp/ngconf/_api/': 'https://pso365apis01.sharepoint.com',
                // o365 files api
                'https://pso365apis01-my.sharepoint.com/_api/v1.0/me':'https://pso365apis01-my.sharepoint.com/'
            }
    };

    angular.module('expenseApp').constant('settings', settings);

}
