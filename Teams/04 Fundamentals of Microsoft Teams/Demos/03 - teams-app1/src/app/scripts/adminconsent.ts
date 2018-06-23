/// <reference path="../../../node_modules/msal/out/msal.d.ts" />
/**
* Implementation of the teams tab1 AdminConsent page
*/
export class AdminConsent {
  /**
  * Constructor for Tab that initializes the Microsoft Teams script and themes management
  */
  constructor() {
    microsoftTeams.initialize();
  }

  public requestConsent(tenantId: string) {
    let host = "https://" + window.location.host;
    let redirectUri = "https://" + window.location.host + "/adminconsent.html";
    let clientId = "1c8a3619-428e-455b-8827-9174562e3649";
    let state = "officedev-traniningconent"; // any unique value

    var consentEndpoint = "https://login.microsoftonline.com/common/adminconsent?" +
      "client_id=" + clientId +
      "&state=" + state +
      "&redirect_uri=" + redirectUri;

    window.location.replace(consentEndpoint);
  }

  public processResponse(response: boolean, error: string) {
    if (response) {
      microsoftTeams.authentication.notifySuccess();
    } else {
      microsoftTeams.authentication.notifyFailure(error);
    }
  }
}
