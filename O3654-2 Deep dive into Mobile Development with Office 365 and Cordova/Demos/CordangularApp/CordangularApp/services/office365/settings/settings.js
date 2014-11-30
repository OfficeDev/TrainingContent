
var O365Auth;
(function (O365Auth) {
    (function (Settings) {
        Settings.clientId = 'c74cf545-5410-4e0a-9c6f-7d0cd823169b';
        Settings.authUri = 'https://login.windows.net/common/';
        Settings.redirectUri = 'http://localhost:4400/services/office365/redirectTarget.html';
    })(O365Auth.Settings || (O365Auth.Settings = {}));
    var Settings = O365Auth.Settings;
})(O365Auth || (O365Auth = {}));
