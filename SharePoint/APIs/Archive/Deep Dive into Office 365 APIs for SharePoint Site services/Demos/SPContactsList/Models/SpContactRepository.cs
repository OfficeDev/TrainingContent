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
using SPContactsList.Utils;

namespace SPContactsList.Models {
  public class SpContactRepository {
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

    public async Task<List<SpContact>> GetContacts(int pageIndex, int pageSize) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
        .Append("/_api/web/lists/getbytitle('Contacts')/items")
        .Append("?$select=Id,Title,FirstName,Email,WorkPhone");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
      request.Headers.Add("ACCEPT", "application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());

      HttpResponseMessage response = await client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      var spContactJsonResponse = JsonConvert.DeserializeObject<SpContactJsonCollection>(responseString);

      List<SpContact> contacts = new List<SpContact>();

      foreach (var spListitem in spContactJsonResponse.Data.Results) {
        SpContact contact = new SpContact {
          Id = spListitem.Id.ToString(),
          FirstName = spListitem.FirstName,
          LastName= spListitem.Title,
          Email = spListitem.Email,
          WorkPhone = spListitem.WorkPhone
        };
        contacts.Add(contact);
      }

      return contacts.OrderBy(e => e.LastName).Skip(pageIndex * pageSize).Take(pageSize).ToList();
    }

    public async Task<SpContact> GetTask(string Id) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
          .Append("/_api/web/lists/getbytitle('Contacts')/items")
          .Append("(" + Id + ")")
          .Append("?$select=Id,Title,FirstName,Email,WorkPhone");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
      request.Headers.Add("ACCEPT", "application/json;odata=verbose");
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());

      HttpResponseMessage response = await client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      var spContactJsonResponse = JsonConvert.DeserializeObject<SpContactJsonSingle>(responseString);

      SpContact contact = new SpContact {
        Id = spContactJsonResponse.Data.Id.ToString(),
        LastName = spContactJsonResponse.Data.Title,
        FirstName = spContactJsonResponse.Data.FirstName,
        Email = spContactJsonResponse.Data.Email,
        WorkPhone = spContactJsonResponse.Data.WorkPhone
      };

      return contact;
    }

    public async Task CreateTask(SpContact contact) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
          .Append("/_api/web/lists/getByTitle('Contacts')/items");

      var newTaskJson = new SpContactJson {
        __metadata = new __Metadata { Type = "SP.Data.ContactsListItem" },
        Title = contact.LastName,
        FirstName = contact.FirstName,
        Email = contact.Email,
        WorkPhone = contact.WorkPhone
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

    public async Task UpdateTask(SpContact contact) {
      StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
        .Append("/_api/web/lists/getByTitle('Contacts')/items")
        .Append("(" + contact.Id + ")");

      var newTaskJson = new SpContactJson {
        __metadata = new __Metadata { Type = "SP.Data.ContactsListItem" },
        Title = contact.LastName,
        FirstName = contact.FirstName,
        Email = contact.Email,
        WorkPhone = contact.WorkPhone
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
        .Append("/_api/web/lists/getByTitle('Contacts')/items")
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