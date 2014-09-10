private async Task<JsonObject> GetFilesAsJsonAsync()
{
	var filesService = m_settings[DiscoveryXElements.ServiceEndpointUri.LocalName];
	var accessToken = m_settings["access_token"];

	// Build request
	var url = filesService + "/files";
	var request = HttpWebRequest.CreateHttp(url);
	request.Method = "GET";
	request.Accept = "application/json;odata=verbose";
	request.Headers["Authorization"] = "Bearer " + accessToken;

	// Get response
	var response = await request.GetResponseAsync()
																	.ConfigureAwait(continueOnCapturedContext: true)
											as HttpWebResponse;
	var responseReader = new StreamReader(response.GetResponseStream());
	var responseBody = await responseReader.ReadToEndAsync()
																							.ConfigureAwait(continueOnCapturedContext: true);

	if (response.StatusCode == HttpStatusCode.OK)
	{
		// Parse the JSON result
		var jsonResult = JsonObject.Parse(responseBody);
		return jsonResult;
	}

	// Consent was not obtained
	this.Status.Text += string.Format("Request failed. Status: '{0}', Body: '{1}'\n",
																	response.StatusCode,
																	responseBody);
	this.Status.Foreground = ErrorBrush;

	return null;
}
