
var O365Auth;
(function (O365Auth) {
    (function (Settings) {
        Settings.clientId = '8474d163-4517-4bd2-aa34-6682f096301a';
        Settings.authUri = 'https://login.windows.net/common/';
        Settings.redirectUri = 'http://localhost:4400/services/office365/redirectTarget.html';
    })(O365Auth.Settings || (O365Auth.Settings = {}));
    var Settings = O365Auth.Settings;
})(O365Auth || (O365Auth = {}));

var O365Libraries = [
    'services/office365/scripts/InAppBrowserOverride.js',
    'services/office365/scripts/utility.js',
    'services/office365/scripts/o365adal.js',
    'services/office365/scripts/o365discovery.js',
    'services/office365/scripts/aadgraph.js',
    'services/office365/scripts/exchange.js',
    'services/office365/scripts/sharepoint.js'
];

O365Libraries.forEach(function (path, index, array) {
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', path);
    document.head.appendChild(scriptTag).parentNode.removeChild(scriptTag);
});
