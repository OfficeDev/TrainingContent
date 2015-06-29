using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using VideoApiWeb.Models.JsonHelpers;
using VideoApiWeb.Utils;

namespace VideoApiWeb.Models {
  public class VideoChannelRepository {
    HttpClient _client = new HttpClient();
    private string _videoPortalRootUrl = string.Empty;

    private async Task<string> GetVideoPortalRootUrl() {
      if (string.IsNullOrEmpty(_videoPortalRootUrl)) {
        // create request to video portal's discovery endpoint
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, string.Format("https://{0}.sharepoint.com/_api/VideoService.Discover", SettingsHelper.Office365TenantId));
        request.Headers.Add("ACCEPT", "application/json;odata=verbose");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await AadHelper.GetAccessToken());

        // issue request & get response 
        var response = await _client.SendAsync(request);
        string responseString = await response.Content.ReadAsStringAsync();
        // convert response to object
        var jsonResponse = JsonConvert.DeserializeObject<VideoServiceDiscovery>(responseString);

        _videoPortalRootUrl = jsonResponse.Data.VideoPortalUrl;
      }

      return _videoPortalRootUrl;
    }

    public async Task<List<VideoChannel>> GetChannels(bool onlyEditable) {
      var query = onlyEditable
        ? await GetVideoPortalRootUrl() + "/_api/VideoService/CanEditChannels"
        : await GetVideoPortalRootUrl() + "/_api/VideoService/Channels";

      // create request for channels
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, query);
      request.Headers.Add("ACCEPT", "application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await AadHelper.GetAccessToken());

      // issue request & get response 
      var response = await _client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      // convert response to object
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.VideoChannel>(responseString);

      // convert to model object
      var channels = new List<VideoChannel>();

      foreach (var videoChannel in jsonResponse.Data.Results) {
        var channel = new VideoChannel {
          Id = videoChannel.Id,
          HtmlColor = videoChannel.TileHtmlColor,
          Title = videoChannel.Title,
          Description = videoChannel.Description,
          ServerRelativeUrl = videoChannel.ServerRelativeUrl
        };
        channels.Add(channel);
      }

      return channels.OrderBy(vc => vc.Title).ToList();
    }

  }
}