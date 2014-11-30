
var O365Auth;
(function (O365Auth) {
    (function (Settings) {
        Settings.clientId = '534990cf-099e-447e-aab9-6888fca3b2ba';
        Settings.authUri = 'https://login.windows.net/common/';
        Settings.redirectUri = 'http://localhost:4400/services/office365/redirectTarget.html';
    })(O365Auth.Settings || (O365Auth.Settings = {}));
    var Settings = O365Auth.Settings;
})(O365Auth || (O365Auth = {}));
