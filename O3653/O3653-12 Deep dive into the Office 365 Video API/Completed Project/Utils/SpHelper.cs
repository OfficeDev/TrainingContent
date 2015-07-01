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
    private static string _videoPortalRootUrl = "";
    private static string _formDigest = "";

    public static async Task<string> GetVideoPortalRootUrl() {
      if (string.IsNullOrEmpty(_videoPortalRootUrl)) {
        HttpClient client = new HttpClient();
        client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + await AadHelper.GetAccessToken());

        // create request to video portal's discovery endpoint
        var query = string.Format("https://{0}.sharepoint.com/_api/VideoService.Discover",
          SettingsHelper.Office365TenantId);

        // issue request & get response
        var response = await client.GetAsync(query);
        string responseString = await response.Content.ReadAsStringAsync();

        // convert response to object
        var jsonResponse = JsonConvert.DeserializeObject<VideoServiceDiscovery>(responseString);

        _videoPortalRootUrl = jsonResponse.Data.VideoPortalUrl;
      }

      return _videoPortalRootUrl;
    }
  }
}