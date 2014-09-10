// Build the /FirstSignIn URL
var firstSignInUri = new Uri(
			string.Format("{0}/discovery/me/FirstSignIn?redirect_uri={1}&scope={2}", 
				this.DiscoveryServiceHost.Text,
				TerminalUriText,
				Scope));
var terminalUri = new Uri(TerminalUriText);

var webAuthResult = await WebAuthenticationBroker.AuthenticateAsync(WebAuthenticationOptions.None, firstSignInUri, terminalUri)
		.AsTask().ConfigureAwait(continueOnCapturedContext: true);

if (webAuthResult.ResponseStatus == WebAuthenticationStatus.Success)
{
	ParseNavigationResult(webAuthResult.ResponseData);
	RenderUserRealmData();
	this.Status.Foreground = SuccessBrush;

                
	m_settings["discovery_resource"] = "Microsoft.SharePoint"; // TODO: for Mail, use "https://outlook.office365.com/";
}
else
{
	// This error wasn't expected
	this.Status.Text = string.Format("Error = {0}\nHTTP code = {1}\n", webAuthResult.ResponseStatus, webAuthResult.ResponseErrorDetail);
	this.Status.Foreground = ErrorBrush;
}
