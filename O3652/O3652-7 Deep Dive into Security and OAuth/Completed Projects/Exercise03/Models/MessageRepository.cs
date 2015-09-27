using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using ClientCredsAddin.Models.JsonHelpers;
using ClientCredsAddin.Utils;
using Newtonsoft.Json;

namespace ClientCredsAddin.Models {
  public class MessageRepository {
    private string _accessToken = null;

    public MessageRepository(string accessToken) {
      _accessToken = accessToken;
    }

    public async Task<List<string>> GetMessages(string mailboxId) {
      var mailQuery = string.Format("{0}api/v1.0/users('{1}')/folders/inbox/messages?$top=10&?select=Subject",
        SettingsHelper.ExchangeOnlineEndpoint, mailboxId);

      HttpClient client = new HttpClient();
      client.DefaultRequestHeaders.Add("Accept", "application/json");
      client.DefaultRequestHeaders.Add("Authorization", "Bearer " + _accessToken);
      // these headers should be added when doing app-only for auditing purposes
      client.DefaultRequestHeaders.Add("client-request-id", Guid.NewGuid().ToString());
      client.DefaultRequestHeaders.Add("return-client-request-id", "true");
      client.DefaultRequestHeaders.Add("UserAgent", "OfficeDev-ClientCredsAddin-HOL");

      // create request
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, mailQuery);

      // issue request & get response
      var response = await client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      // convert response to object
      var jsonResponse = JsonConvert.DeserializeObject<ExchangeMessageReponseJson>(responseString);

      return jsonResponse.Message.Select(message => message.Subject).ToList();
    }
  }
}