using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.SharePoint;
using Newtonsoft.Json;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using TasksWeb.Utils;

namespace TasksWeb.Models {
  public class SpTaskRepository {
    private async Task<string> GetAccessToken() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

      // discover contact endpoint
      var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      // create auth context
      AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(signInUserId));

      // authenticate
      var authResult = await authContext.AcquireTokenSilentAsync(SettingsHelper.SharePointServiceResourceId, clientCredential, userIdentifier);

      // obtain access token
      return authResult.AccessToken;
    }

    public async Task<List<SpTask>> GetTasks(int pageIndex, int pageSize) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
        .Append("/_api/web/lists/getbytitle('Tasks')/items")
        .Append("?$select=Id,Title,Status,Priority");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
      request.Headers.Add("ACCEPT", "application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());

      HttpResponseMessage response = await client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      var spTaskJsonResponse = JsonConvert.DeserializeObject<SpTaskJsonCollection>(responseString);

      List<SpTask> tasks = new List<SpTask>();

      foreach (var spListitem in spTaskJsonResponse.Data.Results) {
        SpTask task = new SpTask {
          Id = spListitem.Id.ToString(),
          Title = spListitem.Title,
          Status = spListitem.Status,
          Priority = spListitem.Priority
        };
        tasks.Add(task);
      }

      return tasks.OrderBy(e => e.Title).Skip(pageIndex * pageSize).Take(pageSize).ToList();
    }

    public async Task<SpTask> GetTask(string Id) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
          .Append("/_api/web/lists/getbytitle('Tasks')/items")
          .Append("(" + Id + ")")
          .Append("?$select=Id,Title,Status,Priority");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
      request.Headers.Add("ACCEPT", "application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());

      HttpResponseMessage response = await client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      var spTaskJsonResponse = JsonConvert.DeserializeObject<SpTaskJsonSingle>(responseString);

      SpTask task = new SpTask {
        Id = spTaskJsonResponse.Data.Id.ToString(),
        Title = spTaskJsonResponse.Data.Title,
        Status = spTaskJsonResponse.Data.Status,
        Priority = spTaskJsonResponse.Data.Priority
      };

      return task;
    }

    public async Task CreateTask(SpTask task) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
          .Append("/_api/web/lists/getByTitle('Tasks')/items");

      var newTaskJson = new SpTaskJson {
        __metadata = new __Metadata { Type = "SP.Data.TasksListItem" },
        Title = task.Title,
        Status = task.Status,
        Priority = task.Priority
      };

      StringContent requestContent = new StringContent(JsonConvert.SerializeObject(
        newTaskJson,
        Formatting.None,
        new JsonSerializerSettings {
          NullValueHandling = NullValueHandling.Ignore
        }));
      requestContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
      request.Headers.Add("ACCEPT", "application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
      request.Content = requestContent;

      await client.SendAsync(request);
    }

    public async Task UpdateTask(SpTask task) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
        .Append("/_api/web/lists/getByTitle('Tasks')/items")
        .Append("(" + task.Id + ")");

      var newTaskJson = new SpTaskJson {
        __metadata = new __Metadata { Type = "SP.Data.TasksListItem" },
        Title = task.Title,
        Status = task.Status,
        Priority = task.Priority
      };

      StringContent requestContent = new StringContent(JsonConvert.SerializeObject(
        newTaskJson,
        Formatting.None,
        new JsonSerializerSettings {
          NullValueHandling = NullValueHandling.Ignore
        }));
      requestContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
      request.Headers.Add("ACCEPT", "application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
      request.Content = requestContent;
      request.Headers.Add("IF-MATCH", "*");
      request.Headers.Add("X-HTTP-Method", "MERGE");

      await client.SendAsync(request);
    }

    public async Task Delete(string Id) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
        .Append("/_api/web/lists/getByTitle('Tasks')/items")
        .Append("(" + Id + ")");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
      request.Headers.Add("ACCEPT", "application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
      request.Headers.Add("IF-MATCH", "*");
      HttpResponseMessage response = await client.SendAsync(request);
    }
  }
}