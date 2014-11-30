// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // app start up code goes here
        $("#btnGetContacts").click(onGetContacts);
    };

    function onGetContacts() {
        //authenticate to Office 365
        var authContext = new O365Auth.Context();
        authContext.getIdToken('https://outlook.office365.com/').then(function (token) {
            //get access token for exchange
            var accessTokenFn = token.getAccessTokenFn('https://outlook.office365.com');

            //create exchange client and query contacts
            var client = new Microsoft.OutlookServices.Client('https://outlook.office365.com/ews/odata', accessTokenFn);
            client.me.contacts.getContacts().fetch().then(onContactsReceived);
        });
    };

    function onContactsReceived(contacts) {
        for (var i = 0; i < contacts.currentPage.length; i++) {
            var currentContact = contacts.currentPage[i];
            var currentContactName =
                currentContact.surname + ', ' + currentContact.givenName;
            var contactDiv = $('<div>').text(currentContactName);
            $('#status').append(contactDiv);
            $('#btnGetContacts').hide();
        }
    };
})();