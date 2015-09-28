using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Newtonsoft.Json;
using OneNoteDev.Utils;

namespace OneNoteDev.Models {
  public class NotebookRepository {
    private HttpClient _client;

    private string _oneNoteResourceId = string.Empty;
    private string _oneNoteEndpoint = string.Empty;

    public NotebookRepository() {
      _client = new HttpClient();
      _client.DefaultRequestHeaders.Add("Accept", "application/json");
    }

    private async Task InitOneNoteRestConnection() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

      // discover onenote endpoint
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

      // query discovery service for endpoint for onenote endpoint
      var discoCapabilityResult = await discoClient.DiscoverCapabilityAsync("Notes");

      // get details around onedrive endpoint (replace 1.0 with 2.0 for the new REST API)
      _oneNoteResourceId = discoCapabilityResult.ServiceResourceId;
      _oneNoteEndpoint = discoCapabilityResult.ServiceEndpointUri.ToString();
      var accessToken = (await authContext.AcquireTokenSilentAsync(_oneNoteResourceId, clientCredential, userIdentifier)).AccessToken;

      // set the access token on all requests for onenote API
      _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

      return;
    }

    public async Task<IEnumerable<Notebook>> GetNotebooks() {
      // ensure connection established to new onenote API
      if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
          (string.IsNullOrEmpty(_oneNoteResourceId))) {
        await InitOneNoteRestConnection();
      }

      // create query
      var query = _oneNoteEndpoint + "/me/notes/notebooks";

      // create request
      var request = new HttpRequestMessage(HttpMethod.Get, query);

      // issue request & get response
      var response = await _client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.NotebooksJson>(responseString);

      // convert to model object
      var notebooks = new List<Notebook>();
      foreach (var notebook in jsonResponse.Notebooks) {
        var item = new Notebook {
          Id = notebook.Id,
          Name = notebook.Name,
          NotebookUrl = notebook.NotebookUrl,
          IsDefault = notebook.IsDefault,
          CreatedDateTime = notebook.CreatedTime,
          LastModifiedDateTime = notebook.LastModifiedTime,
          SectionsUrl = notebook.SectionsUrl,
          SectionGroupsUrl = notebook.SectionGroupsUrl,
          ClientUrl = notebook.Links.OneNoteClientUrl.href,
          WebUrl = notebook.Links.OneNoteWebUrl.href
        };

        notebooks.Add(item);
      }

      return notebooks.OrderBy(n => n.Name).ToList();
    }

    public async Task<Notebook> GetNotebook(string notebookid) {
      // ensure connection established to new onenote API
      if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
          (string.IsNullOrEmpty(_oneNoteResourceId))) {
        await InitOneNoteRestConnection();
      }

      // create query
      var query = string.Format("{0}/me/notes/notebooks/?$top=1&$filter=id eq '{1}'", _oneNoteEndpoint, notebookid);

      // create request
      var request = new HttpRequestMessage(HttpMethod.Get, query);

      // issue request & get response
      var response = await _client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.NotebooksJson>(responseString).Notebooks[0];

      // convert to model object
      var notebook = new Notebook {
        Id = jsonResponse.Id,
        Name = jsonResponse.Name,
        NotebookUrl = jsonResponse.NotebookUrl,
        IsDefault = jsonResponse.IsDefault,
        CreatedDateTime = jsonResponse.CreatedTime,
        LastModifiedDateTime = jsonResponse.LastModifiedTime,
        SectionsUrl = jsonResponse.SectionsUrl,
        SectionGroupsUrl = jsonResponse.SectionGroupsUrl,
        ClientUrl = jsonResponse.Links.OneNoteClientUrl.href,
        WebUrl = jsonResponse.Links.OneNoteWebUrl.href
      };

      return notebook;
    }

    public async Task<Notebook> GetNotebookSections(string notebookid) {
      var notebook = await GetNotebook(notebookid);
      return await GetNotebookSections(notebook);
    }

    public async Task<Notebook> GetNotebookSections(Notebook notebook) {
      // ensure connection established to new onenote API
      if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
          (string.IsNullOrEmpty(_oneNoteResourceId))) {
        await InitOneNoteRestConnection();
      }

      // create query
      var query = notebook.SectionsUrl;

      // create request
      var request = new HttpRequestMessage(HttpMethod.Get, query);

      // issue request & get response
      var response = await _client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.SectionsJson>(responseString);

      // convert to model object
      foreach (var item in jsonResponse.Sections) {
        var section = new Section {
          Id = item.Id,
          Name = item.Name,
          CreatedDateTime = item.CreatedTime,
          LastModifiedDateTime = item.LastModifiedTime,
          PagesUrl = item.PagesUrl
        };
        notebook.Sections.Add(section);
      }

      return notebook;
    }

    public async Task<Notebook> GetNotebookPages(string notebookid, string sectionid) {
      var notebook = await GetNotebook(notebookid);
      notebook = await GetNotebookSections(notebook);
      return await GetNotebookPages(notebook, sectionid);
    }

    public async Task<Notebook> GetNotebookPages(Notebook notebook, string sectionid) {
      // ensure connection established to new onenote API
      if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
          (string.IsNullOrEmpty(_oneNoteResourceId))) {
        await InitOneNoteRestConnection();
      }

      HttpRequestMessage request = null;
      HttpResponseMessage response = null;
      string responseString;

      // for the specified section...
      var section = notebook.Sections.First(s => s.Id == sectionid);

      // get all the pages in the section
      request = new HttpRequestMessage(HttpMethod.Get, section.PagesUrl);
      response = await _client.SendAsync(request);
      
      // convert to JSON object
      responseString = await response.Content.ReadAsStringAsync();
      var jsonPages = JsonConvert.DeserializeObject<JsonHelpers.PagesJson>(responseString);

      // loop through all pages
      foreach (var jsonPage in jsonPages.Pages) {
        // convert pages to model objects
        var page = new NotePage {
          Id = jsonPage.Id,
          Name = jsonPage.Title,
          CreatedDateTime = jsonPage.CreatedTime,
          LastModifiedDateTime = jsonPage.LastModifiedTime,
          PageUrl = jsonPage.PageUrl,
          ClientUrl = jsonPage.Links.OneNoteClientUrl.href,
          WebUrl = jsonPage.Links.OneNoteWebUrl.href,
          ContentUrl = jsonPage.ContentUrl
        };

        // get the body of the page
        request = new HttpRequestMessage(HttpMethod.Get, page.ContentUrl);
        response = await _client.SendAsync(request);
        page.Content = await response.Content.ReadAsStringAsync();

        // add page to section
        section.Pages.Add(page);
      }

      return notebook;
    }

    public async Task DeletePage(string id)
    {
      // ensure connection established to new onenote API
      if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
          (string.IsNullOrEmpty(_oneNoteResourceId))) {
        await InitOneNoteRestConnection();
      }

      // create query
      var query = string.Format("{0}/me/notes/pages/{1}", _oneNoteEndpoint, id);

      // create request
      var request = new HttpRequestMessage(HttpMethod.Delete, query);

      // issue request & get response
      await _client.SendAsync(request);
      
    }
  }
}