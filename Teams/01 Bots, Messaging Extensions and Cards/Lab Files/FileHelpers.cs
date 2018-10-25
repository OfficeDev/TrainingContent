public class FileHelpers
{
  internal static async Task ProcessAttachment(Attachment attachment, IDialogContext context)
  {
    var replyMessage = context.MakeMessage();

    if (attachment.ContentType == FileDownloadInfo.ContentType)
    {
      FileDownloadInfo downloadInfo = (attachment.Content as JObject).ToObject<FileDownloadInfo>();
      if (downloadInfo != null)
      {
        if (downloadInfo.FileType == "txt")
        {
          try
          {
            var httpClient = new HttpClient();
            HttpResponseMessage response = await httpClient.GetAsync(downloadInfo.DownloadUrl);
            var fileContents = await response.Content.ReadAsStringAsync();

            replyMessage.Text = (fileContents.Length < 25)
              ? $"File contents: {fileContents}"
              : $"First 25 bytes: {fileContents.Substring(0, 25)}";
          }
          catch (Exception ex)
          {
            replyMessage.Text = $"Could not read file: {ex.Message}";
          }
        }
      }
    }
    await context.PostAsync(replyMessage);
  }


  internal static async Task<Activity> ProcessFileConsentResponse(object invokeValue)
  {
    Activity reply = new Activity
    {
      Type = ActivityTypes.Message
    };

    var response = ((JObject)invokeValue).ToObject<FileConsentCardResponse>();

    if (response.Action == FileConsentCardResponse.AcceptAction)
    {
      var context = (JObject)response.Context;
      var name = (string)context["name"];
      var fileId = (string)context["fileId"];

      //
      //  Access the file from some storage location and capture its metadata
      //
      //var fileID = "abc";
      var fileSize = 1500;

      var fileContent = $"This is the resume for {name}";
      fileContent += new String(' ', fileSize - fileContent.Length);

      var httpContent = new StringContent(fileContent);
      httpContent.Headers.ContentLength = fileContent.Length;
      httpContent.Headers.ContentRange =
        new System.Net.Http.Headers.ContentRangeHeaderValue(0, fileContent.Length - 1, fileContent.Length);

      var httpClient = new HttpClient();
      var httpResponse = await httpClient.PutAsync(response.UploadInfo.UploadUrl, httpContent);
      var responseText = await httpResponse.Content.ReadAsStringAsync();

      if (httpResponse.IsSuccessStatusCode)
      {
        var responseObject = JObject.Parse(responseText);

        var uploadedName = (string)responseObject["name"];
        var contentUrl = (string)responseObject["webUrl"];

        FileInfoCard card = new FileInfoCard()
        {
          ContentUrl = (string)responseObject["webUrl"],
          Name = (string)responseObject["name"],
          FileType = System.IO.Path.GetExtension(uploadedName).Replace(".", ""),
          UniqueId = (string)responseObject["id"]
        };

        reply.Attachments.Add(card.ToAttachment());
      }
      else
      {
        reply.Text =  responseText;
      }
    }
    else
    {
      reply.Text = "Upload was declined";
    }
    return reply;
  }
}
