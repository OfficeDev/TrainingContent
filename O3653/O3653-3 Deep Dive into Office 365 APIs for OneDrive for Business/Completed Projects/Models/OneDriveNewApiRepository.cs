using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.SharePoint.FileServices;
using Newtonsoft.Json;
using OneDriveWeb.Utils;

namespace OneDriveWeb.Models {
  public class OneDriveNewApiRepository {

    private HttpClient _client;

    private string _oneDriveAccessToken = string.Empty;
    private string _oneDriveResourceId = string.Empty;
    private string _oneDriveEndpoint = string.Empty;

    public OneDriveNewApiRepository() {
      _client = new HttpClient();
      _client.DefaultRequestHeaders.Add("Accept", "application/json");
    }

    private async Task InitOneDriveNewRestConnection() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

      // discover contact endpoint
      var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      // create auth context
      AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(signInUserId));

      // authenticate with directory service
      var discoClient = new DiscoveryClient(new Uri(SettingsHelper.O365DiscoveryServiceEndpoint),
        async () => {
          var authResult = await authContext.AcquireTokenSilentAsync(SettingsHelper.O365DiscoveryResourceId, clientCredential, userIdentifier);
          return authResult.AccessToken;
        });

      // query discovery service for endpoint for onedrive endpoint
      var discoCapabilityResult = await discoClient.DiscoverCapabilityAsync("MyFiles");

      // get details around onedrive endpoint (replace 1.0 with 2.0 for the new REST API)
      _oneDriveResourceId = discoCapabilityResult.ServiceResourceId;
      _oneDriveEndpoint = discoCapabilityResult.ServiceEndpointUri.ToString().Replace("1.0", "2.0");
      _oneDriveAccessToken = (await authContext.AcquireTokenSilentAsync(_oneDriveResourceId, clientCredential, userIdentifier)).AccessToken;

      return;
    }

    public async Task<IEnumerable<IItem>> GetMyFiles(int pageIndex, int pageSize) {
      // ensure connection established to new onedrive API
      if ((string.IsNullOrEmpty(_oneDriveAccessToken)) ||
          (string.IsNullOrEmpty(_oneDriveEndpoint)) ||
          (string.IsNullOrEmpty(_oneDriveResourceId))) {
        await InitOneDriveNewRestConnection();
      }

      // set the access token on the request
      _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + _oneDriveAccessToken);

      // create the query for all file at the root
      var query = _oneDriveEndpoint + "/drive/root/children";

      // create request for items
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, query);

      // issue request & get response
      var response = await _client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      // convert them to JSON
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.FolderContents>(responseString);

      // convert to model object
      var items = new List<IItem>();

      foreach (var folderItem in jsonResponse.FolderItems) {
        // if folder
        if (folderItem.FileSize == 0) {
          var folder = new Folder {
            Id = folderItem.Id,
            Name = folderItem.Name,
            ETag = folderItem.eTag,
            DateTimeCreated = folderItem.CreatedDateTime,
            DateTimeLastModified = folderItem.LastModifiedDateTime,
            WebUrl = folderItem.WebUrl,
            Size = 0
          };
          items.Add(folder);
        } else {
          var file = new File {
            Id = folderItem.Id,
            Name = folderItem.Name,
            ETag = folderItem.eTag,
            DateTimeCreated = folderItem.CreatedDateTime,
            DateTimeLastModified = folderItem.LastModifiedDateTime,
            WebUrl = folderItem.WebUrl,
            Size = folderItem.FileSize
          };
          items.Add(file);
        }
      }

      return items.OrderBy(item => item.Name).ToList();
    }

    public async Task DeleteFile(string id, string etag) {
      // ensure connection established to new onedrive API
      if ((string.IsNullOrEmpty(_oneDriveAccessToken)) ||
          (string.IsNullOrEmpty(_oneDriveEndpoint)) ||
          (string.IsNullOrEmpty(_oneDriveResourceId))) {
        await InitOneDriveNewRestConnection();
      }

      // set the access token on the request
      _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + _oneDriveAccessToken);

      // create query request to delete file
      var query = _oneDriveEndpoint + "/drive/items/" + id;

      // create delete request
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, query);
      request.Headers.IfMatch.Add(new EntityTagHeaderValue(etag));

      await _client.SendAsync(request);
    }

  }
}