using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace WebApplication1.Utils
{
  public class HttpHelper
  {
    public static async Task<Models.ConnectorSubmissionResult> PostJsonMessage(string url, string body)
    {
      Models.ConnectorSubmissionResult result = null;
      string responseContent = String.Empty;

      var request = (HttpWebRequest)HttpWebRequest.Create(url);
      request.Method = "POST";
      request.Accept = "application/json";
      request.ContentType = "application/json";

      using (var writer = new StreamWriter(request.GetRequestStream()))
      {
        writer.Write(body);
      }

      try
      {
        var response = await request.GetResponseAsync();
        var httpResponse = response as HttpWebResponse;
        using (var reader = new StreamReader(httpResponse.GetResponseStream()))
        {
          responseContent = reader.ReadToEnd();
        }

        result = new Models.ConnectorSubmissionResult()
        {
          Status = httpResponse.StatusCode,
          Message = (httpResponse.StatusCode == HttpStatusCode.OK) ? "Card posted successfully" : responseContent
        };

      }
      catch (WebException ex)
      {
        var httpResponse = ex.Response as HttpWebResponse;
        using (var reader = new StreamReader(httpResponse.GetResponseStream()))
        {
          responseContent = reader.ReadToEnd();
        }

        result = new Models.ConnectorSubmissionResult()
        {
          Status = httpResponse.StatusCode,
          Message = (httpResponse.StatusCode == HttpStatusCode.OK) ? "Card posted successfully" : responseContent
        };
      }
      return result;
    }
  }
}