Office 365 Client Libraries for Javascript and TypeScript

Add the appropriate references to your app - 
	The settings.js file will dynamically load the required library scripts:
		<script src="./services/office365/settings.js"></script>

To get intellisense in a js file add reference comments at the top of the file as needed 
	/// <reference path="utility.js" />
	/// <reference path="o365adal.js" />
	/// <reference path="exchange.js" />
	/// <reference path="aadgraph.js" />


Sample JavaScript code for authenticating and getting calendar events:

	// Call this code in a click handler or other user initiated action
    var authContext = new O365Auth.Context();
    authContext.getIdToken('https://outlook.office365.com/')
        .then((function (token) {
            var client = new Exchange.Client('https://outlook.office365.com/ews/odata', token.getAccessTokenFn('https://outlook.office365.com'));
            client.me.calendar.events.getEvents().fetch()
                .then(function (events) {
                    // get currentPage of events and logout
                    var myevents = events.currentPage;
                    authContext.logOut();
                }, function (reason) {
                    // handle error
                });
        }).bind(this), function (reason) {
            // handle error
        });  



Sample TypeScript code for authenticating and getting current user:

	// Call this code in a click handler or other user initiated action
	var authContext = new O365Auth.Context();
    authContext.getIdToken('https://graph.windows.net')
        .then((token) => {
            var client = new AadGraph.Client('https://graph.windows.net/' + token.tenantId, token.getAccessTokenFn());
            client.directoryObjects.getDirectoryObject(token.objectId).fetch()
                .then(object => {
                    // get current User and logout
                    var currentUser = object;
                    authContext.logOut();
                }
                , error => {
                    // handle error case
                });
        });
