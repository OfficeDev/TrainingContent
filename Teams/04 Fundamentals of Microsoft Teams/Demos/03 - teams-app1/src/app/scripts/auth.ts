/**
* Implementation of the teams app1 Auth page
*/
export class Auth {
  private token: string = "";
  private user: Msal.User;

  /**
  * Constructor for Tab that initializes the Microsoft Teams script
  */
  constructor() {
    microsoftTeams.initialize();
  }

  public performAuthV2(level: string) {
    // Setup auth parameters for MSAL
    let graphAPIScopes: string[] = ["https://graph.microsoft.com/user.read", "https://graph.microsoft.com/group.read.all"];
    let userAgentApplication = new Msal.UserAgentApplication(
      "1c8a3619-428e-455b-8827-9174562e3649",
      "https://login.microsoftonline.com/common",
      this.tokenReceivedCallback);

    if (userAgentApplication.isCallback(window.location.hash)) {
      userAgentApplication.handleAuthenticationResponse(
        window.location.hash,
        (token) => {
          if (this.user == null) {
            this.user = userAgentApplication.getUser()!;
            this.getToken(userAgentApplication, graphAPIScopes);
          } else {
            microsoftTeams.authentication.notifySuccess(token);
          }
        },
        (error) => { microsoftTeams.authentication.notifyFailure(error); }
      );
    } else {
      this.user = userAgentApplication.getUser();
      if (!this.user) {
        // If user is not signed in, then prompt user to sign in via loginRedirect.
        // This will redirect user to the Azure Active Directory v2 Endpoint
        userAgentApplication.loginRedirect(graphAPIScopes);
      } else {
        this.getToken(userAgentApplication, graphAPIScopes);
      }
    }
  }

  private getToken(userAgentApplication: Msal.UserAgentApplication, graphAPIScopes: string[]) {
    // In order to call the Graph API, an access token needs to be acquired.
    // Try to acquire the token used to query Graph API silently first:
    userAgentApplication.acquireTokenSilent(graphAPIScopes).then(
      (token) => {
        //After the access token is acquired, return to MS Teams, sending the acquired token
        microsoftTeams.authentication.notifySuccess(token);
      },
      (error) => {
        // If the acquireTokenSilent() method fails, then acquire the token interactively via acquireTokenRedirect().
        // In this case, the browser will redirect user back to the Azure Active Directory v2 Endpoint so the user
        // can reenter the current username/ password and/ or give consent to new permissions your application is requesting.
        if (error) {
          userAgentApplication.acquireTokenRedirect(graphAPIScopes);
        }
      }
    );
  }

  private tokenReceivedCallback(errorDesc, token, error, tokenType) {
    //  suppress typescript compile errors
  }
}
