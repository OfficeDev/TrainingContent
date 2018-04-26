using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using System.Configuration;

namespace OneNoteDev.Models
{
    public class NotebookRepository
    {
        private HttpClient _client;

        private string _oneNoteResourceId = string.Empty; 
        private string _oneNoteEndpoint = string.Empty; 

        public NotebookRepository()
        {
            _client = new HttpClient();
            _client.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        private async Task InitOneNoteRestConnection()
        {
            _oneNoteEndpoint = "https://graph.microsoft.com/beta";
            _oneNoteResourceId = "https://graph.microsoft.com/";
            var Authority = ConfigurationManager.AppSettings["ida:AADInstance"] + ConfigurationManager.AppSettings["ida:TenantId"];

            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            var clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ida:ClientId"], ConfigurationManager.AppSettings["ida:ClientSecret"]);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            // create auth context
            AuthenticationContext authContext = new AuthenticationContext(Authority, new ADALTokenCache(signInUserId));
            var authResult = await authContext.AcquireTokenSilentAsync(_oneNoteResourceId, clientCredential, userIdentifier);

            // set the access token on all requests for onenote API
            _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + authResult.AccessToken);

            return;
        }

        public async Task<IEnumerable<Notebook>> GetNotebooks()
        {
            // ensure connection established to new onenote API
            if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
                (string.IsNullOrEmpty(_oneNoteResourceId)))
            {
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
            foreach (var notebook in jsonResponse.Notebooks)
            {
                var item = new Notebook
                {
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

        public async Task<Notebook> GetNotebook(string notebookid)
        {
            // ensure connection established to new onenote API
            if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
                (string.IsNullOrEmpty(_oneNoteResourceId)))
            {
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
            var notebook = new Notebook
            {
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

        public async Task<Notebook> GetNotebookSections(string notebookid)
        {
            var notebook = await GetNotebook(notebookid);
            return await GetNotebookSections(notebook);
        }

        public async Task<Notebook> GetNotebookSections(Notebook notebook)
        {
            // ensure connection established to new onenote API
            if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
                (string.IsNullOrEmpty(_oneNoteResourceId)))
            {
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
            foreach (var item in jsonResponse.Sections)
            {
                var section = new Section
                {
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

        public async Task<Notebook> GetNotebookPages(string notebookid, string sectionid)
        {
            var notebook = await GetNotebook(notebookid);
            notebook = await GetNotebookSections(notebook);
            return await GetNotebookPages(notebook, sectionid);
        }

        public async Task<Notebook> GetNotebookPages(Notebook notebook, string sectionid)
        {
            // ensure connection established to new onenote API
            if ((string.IsNullOrEmpty(_oneNoteEndpoint)) ||
                (string.IsNullOrEmpty(_oneNoteResourceId)))
            {
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
            foreach (var jsonPage in jsonPages.Pages)
            {
                // convert pages to model objects
                var page = new NotePage
                {
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
                (string.IsNullOrEmpty(_oneNoteResourceId)))
            {
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