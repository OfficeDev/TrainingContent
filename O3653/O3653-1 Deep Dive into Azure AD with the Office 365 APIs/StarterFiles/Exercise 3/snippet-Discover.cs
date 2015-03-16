try
{
	// Discover the service for the desired capability
	var accessToken = m_settings["access_token"];
	var discoveryService = m_settings["discovery_service"];
	var url = string.Format("{0}/services", discoveryService);

	// Build request
	var request = HttpWebRequest.CreateHttp(url);
	request.Method = "GET";
	request.Headers["Authorization"] = "Bearer " + accessToken;

	// Get response
	var response = await request.GetResponseAsync()
																	.ConfigureAwait(continueOnCapturedContext: true)
											as HttpWebResponse;
	var responseReader = new StreamReader(response.GetResponseStream());
	var responseBody = await responseReader.ReadToEndAsync()
																							.ConfigureAwait(continueOnCapturedContext: true);

	// Load the XML of the response body
	using (var xdocReader = new StringReader(responseBody))
	{
		var xdoc = XDocument.Load(xdocReader);
		if (xdoc != null)
		{
			foreach (var entryElement in xdoc.Root.Elements(DiscoveryXElements.EntryAtom))
			{
				var contentElement = entryElement.Element(DiscoveryXElements.ContentAtom);
				var propertiesElement = contentElement.Element(DiscoveryXElements.PropertiesMetadata);
				var capabilityElement = propertiesElement.Element(DiscoveryXElements.Capability);
				var serviceIdElement = propertiesElement.Element(DiscoveryXElements.ServiceId);
				var serviceUriElement = propertiesElement.Element(DiscoveryXElements.ServiceEndpointUri);
				var serviceResourceIdElement = propertiesElement.Element(DiscoveryXElements.ServiceResourceId);

				// Since this is a MyFiles app, we only store the MyFiles service
				if (capabilityElement.Value.Equals(MyFiles, StringComparison.OrdinalIgnoreCase))
				{
					m_settings[DiscoveryXElements.ServiceEndpointUri.LocalName] = serviceUriElement.Value;
					m_settings[DiscoveryXElements.ServiceResourceId.LocalName] = serviceResourceIdElement.Value;
				}

				this.Status.Text += "**********************************\n";
				this.Status.Text += capabilityElement.Value + "\n";
				this.Status.Text += serviceIdElement.Value + "\n";
				this.Status.Text += serviceUriElement.Value + "\n";
				this.Status.Text += serviceResourceIdElement.Value + "\n";
			}
			this.Status.Text += "**********************************\n";
		}
	}
}
catch (Exception ex)
{
	this.Status.Text += "Exception caught: '" + ex.Message + "'.";
	this.Status.Foreground = ErrorBrush;
}
