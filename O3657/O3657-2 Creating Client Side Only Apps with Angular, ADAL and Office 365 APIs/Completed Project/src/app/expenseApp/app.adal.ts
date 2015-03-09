///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/expenseApp.d.ts" />

module expenseApp {
    'use strict';

    export class Adal {
        static configure($httpProvider: ng.IHttpProvider, settings: shared.IAdalSettings, adalProvider) {
            adalProvider.init(
            {
                tenant: settings.tenant,
                clientId: settings.clientId,
                postLogoutRedirectUri: 'http://localhost:8000',
                endpoints: settings.aadEndpoints
            },
            $httpProvider);
        }
    }

}