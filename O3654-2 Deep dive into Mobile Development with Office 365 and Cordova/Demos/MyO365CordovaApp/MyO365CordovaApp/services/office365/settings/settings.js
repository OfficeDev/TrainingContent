
var O365Auth;
(function (O365Auth) {
    (function (Settings) {
        Settings.clientId = '600bcbe7-637f-4503-b163-a4e8acb873a0';
        Settings.authUri = 'https://login.windows.net/common/';
        Settings.redirectUri = 'http://localhost:4400/services/office365/redirectTarget.html';
    })(O365Auth.Settings || (O365Auth.Settings = {}));
    var Settings = O365Auth.Settings;
})(O365Auth || (O365Auth = {}));
