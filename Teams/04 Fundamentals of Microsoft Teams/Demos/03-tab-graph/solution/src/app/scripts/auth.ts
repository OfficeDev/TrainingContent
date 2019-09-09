// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as Msal from "msal";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Implementation of the teams app1 Auth page
 */
export class Auth {
  private token: string = "";
  private user: Msal.Account;

  /**
   * Constructor for Tab that initializes the Microsoft Teams script
   */
  constructor() {
    microsoftTeams.initialize();
  }

  public performAuthV2(level: string) {
    // Setup auth parameters for MSAL
    const graphAPIScopes: string[] = ["https://graph.microsoft.com/user.read", "https://graph.microsoft.com/group.read.all"];
    const msalConfig: Msal.Configuration = {
      auth: {
        clientId: "[app-id-from-registration]",
        authority: "https://login.microsoftonline.com/[directory-id-from-registration]"
      }
    };

    const userAgentApplication = new Msal.UserAgentApplication(msalConfig);
    userAgentApplication.handleRedirectCallback(() => { const notUsed = ""; });

    if (userAgentApplication.isCallback(window.location.hash)) {
      const user = userAgentApplication.getAccount();
      if (user) {
        this.getToken(userAgentApplication, graphAPIScopes);
      }
    } else {
      this.user = userAgentApplication.getAccount();
      if (!this.user) {
        // If user is not signed in, then prompt user to sign in via loginRedirect.
        // This will redirect user to the Azure Active Directory v2 Endpoint
        userAgentApplication.loginRedirect({ scopes: graphAPIScopes });
      } else {
        this.getToken(userAgentApplication, graphAPIScopes);
      }
    }
  }

  private getToken(userAgentApplication: Msal.UserAgentApplication, graphAPIScopes: string[]) {
    // In order to call the Microsoft Graph API, an access token needs to be acquired.
    // Try to acquire the token used to query Microsoft Graph API silently first:
    userAgentApplication.acquireTokenSilent({ scopes: graphAPIScopes }).then(
      (token) => {
        // After the access token is acquired, return to MS Teams, sending the acquired token
        microsoftTeams.authentication.notifySuccess(token.accessToken);
      },
      (error) => {
        // If the acquireTokenSilent() method fails, then acquire the token interactively via acquireTokenRedirect().
        // In this case, the browser will redirect user back to the Azure Active Directory v2 Endpoint so the user
        // can reenter the current username/ password and/ or give consent to new permissions your application is requesting.
        if (error) {
          userAgentApplication.acquireTokenRedirect({ scopes: graphAPIScopes });
        }
      }
    );
  }

  private tokenReceivedCallback(errorDesc, token, error, tokenType) {
    //  suppress typescript compile errors
  }
}
