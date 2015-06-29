using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using VideoApiWeb.Models;
using VideoApiWeb.Models.JsonHelpers;

namespace VideoApiWeb.Utils {
  public class SpHelper {
    public async Task<string> GetRequestDigest() {
      var client = new HttpClient();

      var office365TenantId = SettingsHelper.Office365TenantId;

      // create request to contextinfo endpoint
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, string.Format("https://{0}.sharepoint.com/_api/contextinfo", office365TenantId));
      request.Headers.Add("ACCEPT","application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await AadHelper.GetAccessToken());      

      // issue request & get response 
      var response = await client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      // convert response to object
      var jsonResponse = JsonConvert.DeserializeObject<SpContextInfo>(responseString);

      // obtain digest value
      return jsonResponse.Data.GetContextWebInformation.FormDigestValue;
    }
  }
}