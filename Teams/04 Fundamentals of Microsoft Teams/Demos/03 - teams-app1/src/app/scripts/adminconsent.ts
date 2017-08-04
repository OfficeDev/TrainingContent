/// <reference path="../../../node_modules/msal/out/msal.d.ts" />
/**
 * Implementation of the teams tab1 Auth page
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
		let clientId = "b96902c4-9cf2-4398-a131-9d120b208ec9";
		let state = "officedev-traniningconent";

		var consentEndpoint = "https://login.microsoftonline.com/common/adminconsent?" +
			"client_id=" + clientId +
			"&state=" + state +
			"&redirect_uri=" + redirectUri;

		window.location.replace(consentEndpoint);
	}

	public processResponse(response: boolean, error: string) {
		if (response) {
			microsoftTeams.authentication.notifySuccess();
		}
		else {
			microsoftTeams.authentication.notifyFailure(error);
		}
	}

}