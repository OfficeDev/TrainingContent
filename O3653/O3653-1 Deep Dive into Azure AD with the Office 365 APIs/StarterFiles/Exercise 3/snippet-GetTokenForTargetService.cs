try
{
	var accountType = m_settings["account_type"];

	if (accountType.Equals(AccountTypeMicrosoft))
	{
		this.Status.Text += "The original token is good for Live. No new token is needed.\n";
	}
	else
	{
		// Get access token for the target service
		if (!await GetAccessTokenForServiceAsync()
										.ConfigureAwait(continueOnCapturedContext: true))
		{
			return;
		}
	}
}
catch (Exception ex)
{
	this.Status.Text += "Exception caught: '" + ex.Message + "'.";
	this.Status.Foreground = ErrorBrush;
}
