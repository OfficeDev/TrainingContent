    private async Task<Models.ConnectorSubmissionResult> SubmitCard(CardTypes cardType)
    {
      // replace this when third-party connector flow is ready
      string webhookUrl = WebConfigurationManager.AppSettings["WebhookUrl"];

      // Create the Connector Card payload
      var card = Models.CardFactory.GetCard(cardType);
      var requestBody = JsonConvert.SerializeObject(
        card, null,
        new JsonSerializerSettings
        {
          ContractResolver = new CamelCasePropertyNamesContractResolver(),
          NullValueHandling = NullValueHandling.Ignore
        });

      // Make POST to webhook URL
      return await Utils.HttpHelper.PostJsonMessage(webhookUrl, requestBody);
    }
