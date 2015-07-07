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
  public class GraphRepository {

    public async Task<Dictionary<string, string>> GetUsers(string accessToken) {
      string graphQuery = SettingsHelper.AzureAdGraphEndpoint + "users?api-version=2013-04-05";

      HttpClient client = new HttpClient();
      client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
      client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
      // these headers should be added when doing app-only for auditing purposes
      client.DefaultRequestHeaders.Add("client-request-id", Guid.NewGuid().ToString());
      client.DefaultRequestHeaders.Add("return-client-request-id", "true");
      client.DefaultRequestHeaders.Add("UserAgent", "OfficeDev-ClientCredsAddin-HOL");

      // create request
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, graphQuery);

      // issue request & get response
      var response = await client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      // convert response to object
      var jsonResponse = JsonConvert.DeserializeObject<AadUserResponseJson>(responseString);

      return jsonResponse.Data.Users.ToDictionary(user => user.objectId, user => user.mail);
    }

  }
}