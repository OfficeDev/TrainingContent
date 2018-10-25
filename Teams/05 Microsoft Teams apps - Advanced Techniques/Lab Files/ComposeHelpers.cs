public class ComposeHelpers
{
  public static async Task<HttpResponseMessage> HandleInvoke(Activity activity)
  {
    // these are the values specified in manifest.json
    string COMMANDID = "searchCmd";
    string PARAMNAME = "searchText";

    var unrecognizedResponse = new HttpResponseMessage(HttpStatusCode.BadRequest);
    unrecognizedResponse.Content = new StringContent("Invoke request was not recognized.");

    if (!activity.IsComposeExtensionQuery())
    {
      return unrecognizedResponse;
    }

    // This helper method gets the query as an object.
    var query = activity.GetComposeExtensionQueryData();
    if (query.CommandId == null || query.Parameters == null)
    {
      return unrecognizedResponse;
    }


    if (query.CommandId != COMMANDID)
    {
      return unrecognizedResponse;
    }

    var param = query.Parameters.FirstOrDefault(p => p.Name.Equals(PARAMNAME)).Value.ToString();
    if (String.IsNullOrEmpty(param))
    {
      return unrecognizedResponse;
    }

    // This is the response object that will get sent back to the compose extension request.
    ComposeExtensionResponse invokeResponse = new ComposeExtensionResponse();

    // search our data
    var resultData = BotChannels.GetBotChannels().FindAll(t => t.Title.ToLowerInvariant().Contains(param.ToLowerInvariant()));

    // format the results
    var results = new ComposeExtensionResult()
    {
      AttachmentLayout = "list",
      Type = "result",
      Attachments = new List<ComposeExtensionAttachment>(),
    };

    foreach (var resultDataItem in resultData)
    {
      var card = new ThumbnailCard()
      {
        Title = resultDataItem.Title,
        Images = new List<CardImage>() { new CardImage() { Url = resultDataItem.LogoUrl } }
      };

      var composeExtensionAttachment = card.ToAttachment().ToComposeExtensionAttachment();
      results.Attachments.Add(composeExtensionAttachment);
    }

    invokeResponse.ComposeExtension = results;

    // Return the response
    StringContent stringContent;
    try
    {
      stringContent = new StringContent(JsonConvert.SerializeObject(invokeResponse));
    }
    catch (Exception ex)
    {
      stringContent = new StringContent(ex.ToString());
    }
    var response = new HttpResponseMessage(HttpStatusCode.OK);
    response.Content = stringContent;
    return response;
  }

}
