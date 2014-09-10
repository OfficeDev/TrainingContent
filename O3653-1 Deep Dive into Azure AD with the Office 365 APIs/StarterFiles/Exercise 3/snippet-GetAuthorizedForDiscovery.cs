private async Task<bool> GetAuthorizationCodeAsync()
{
	var accountType = m_settings["account_type"];
	var authzService = m_settings["authorization_service"];
	var clientId = m_settings["client_id"];
	var clientSecret = m_settings["client_secret"];
	var scope = m_settings.ContainsKey("scope") ? m_settings["scope"] : string.Empty;
	var userEmail = m_settings["user_email"];
	var redirectUri = m_settings["authz_redirect_uri"];

	var url = string.Format("{0}?response_type=code&client_id={1}{2}{3}&{4}={5}&redirect_uri={6}",
													authzService,
													clientId,
													!string.IsNullOrEmpty(clientSecret) ? "&client_secret=" + WebUtility.UrlEncode(clientSecret) : string.Empty,
													!string.IsNullOrEmpty(scope) ? "&scope=" + WebUtility.UrlEncode(scope) : string.Empty,
													accountType.Equals(AccountTypeMicrosoft) ? "username" : "login_hint",
													WebUtility.UrlEncode(userEmail),
													WebUtility.UrlEncode(redirectUri));
	this.Status.Text += url + "\n";

	// Navigate using the WebAuthenticationBroker!
	var webAuthResult = await WebAuthenticationBroker.AuthenticateAsync(WebAuthenticationOptions.None, new Uri(url), new Uri(redirectUri))
			.AsTask().ConfigureAwait(continueOnCapturedContext: true);

	// Process the navigation result
	if (webAuthResult.ResponseStatus == WebAuthenticationStatus.Success)
	{
		string authzCode = null;

		// Parse the output parameters
		var queryParams = SplitQueryString(webAuthResult.ResponseData);
		foreach (var param in queryParams)
		{
			// Split the current parameter into name and value
			var parts = param.Split('=');
			var paramName = parts[0].ToLowerInvariant().Trim();
			var paramValue = WebUtility.UrlDecode(parts[1]).Trim();

			// Log the output parameter
			this.Status.Text += string.Format("{0} = '{1}'\n", paramName, paramValue);

			// Process the output parameter
			if (paramName.Equals("code"))
			{
				authzCode = paramValue;
				m_settings["authz_code"] = paramValue;
			}
		}

		// Return the final result
		return !string.IsNullOrWhiteSpace(authzCode);
	}

	// Consent was not obtained
	this.Status.Text += string.Format("Consent was not obtained. Status: '{0}', Error: '{1}', Data: '{2}'\n",
																	webAuthResult.ResponseStatus,
																	webAuthResult.ResponseErrorDetail,
																	webAuthResult.ResponseData);
	this.Status.Foreground = ErrorBrush;
	return false;
}

	private async Task<bool> GetAccessTokenAsync(string grantType, string grantName, string grant, string resource)
	{
		var tokenService = m_settings["token_service"];
		var clientId = m_settings["client_id"];
		var clientSecret = m_settings["client_secret"];
		var redirectUri = m_settings["authz_redirect_uri"];

		// Build request body
		var requestBody = string.Format("grant_type={0}&{1}={2}&client_id={3}{4}{5}&redirect_uri={6}",
														grantType,
														grantName,
														grant,
														clientId,
														!string.IsNullOrEmpty(clientSecret) ? "&client_secret=" + WebUtility.UrlEncode(clientSecret) : string.Empty,
														!string.IsNullOrEmpty(resource) ? "&resource=" + WebUtility.UrlEncode(resource) : string.Empty,
														WebUtility.UrlEncode(redirectUri));
		var requestBytes = Encoding.UTF8.GetBytes(requestBody);
		this.Status.Text += requestBody + "\n";

		// Build request
		var request = HttpWebRequest.CreateHttp(tokenService);
		request.Method = "POST";
		request.ContentType = "application/x-www-form-urlencoded";
		var requestStream = await request.GetRequestStreamAsync()
																						.ConfigureAwait(continueOnCapturedContext: true);
		await requestStream.WriteAsync(requestBytes, 0, requestBytes.Length);

		// Get response
		var response = await request.GetResponseAsync()
																		.ConfigureAwait(continueOnCapturedContext: true)
												as HttpWebResponse;
		var responseReader = new StreamReader(response.GetResponseStream());
		var responseBody = await responseReader.ReadToEndAsync()
																								.ConfigureAwait(continueOnCapturedContext: true);

		if (response.StatusCode == HttpStatusCode.OK)
		{
			// Parse the JWT
			var jwt = JsonObject.Parse(responseBody);
			var accessToken = jwt["access_token"].GetString();
			var refreshToken = jwt["refresh_token"].GetString();

			m_settings["access_token"] = accessToken;
			m_settings["refresh_token"] = refreshToken;

			this.Status.Text += string.Format("access_token = '{0}'\nrefresh_token = '{1}'\n",
																							accessToken,
																							refreshToken);
			return true;
		}

		// Consent was not obtained
		this.Status.Text += string.Format("Access token was not obtained. Status: '{0}', Body: '{1}'\n",
																		response.StatusCode,
																		responseBody);
		this.Status.Foreground = ErrorBrush;
		return false;
	}
