using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using ToDoConnector.Models;

namespace ToDoConnector.Controllers
{
  public class ConnectorController : ApiController
  {
    [HttpPost]
    public async Task<IHttpActionResult> Register(ConnectorSettings settings)
    {
      var activityText = $"An instance of the ToDo connector (named {settings.ConfigName}) has been set up. We will send you notification whenever new task is added.";
      string cardJson =
        "{ \"@type\": \"MessageCard\"," +
        "  \"summary\": \"Welcome Message\"," +
        "  \"sections\": [ " +
        "    { " +
        "      \"activityTitle\": \"Welcome Message\"," +
        "      \"text\": \"" + activityText + "\"" +
        "    }" +
        "  ]" +
        "}";

      //prepare the http POST
      HttpClient client = new HttpClient();
      client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
      var content = new StringContent(cardJson, System.Text.Encoding.UTF8, "application/json");
      using (var response = await client.PostAsync(settings.WebHookUrl, content))
      {
        // Check response.IsSuccessStatusCode and take appropriate action if needed.
        var responseText = await response.Content.ReadAsStringAsync();
        var status = response.StatusCode;
      }

      return Ok();
    }
  }
}
