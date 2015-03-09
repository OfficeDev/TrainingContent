///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    'use strict';
    var Adal = (function () {
        function Adal() {
        }
        Adal.configure = function ($httpProvider, settings, adalProvider) {
            adalProvider.init({
                tenant: settings.tenant,
                clientId: settings.clientId,
                postLogoutRedirectUri: 'http://localhost:8000',
                endpoints: settings.aadEndpoints
            }, $httpProvider);
        };
        return Adal;
    })();
    expenseApp.Adal = Adal;
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=app.adal.js.map