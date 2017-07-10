using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;

namespace OneNoteDev.Models
{
    public class NotebookRepository
    {
        private HttpClient _client;

        private string _msGraphResourceId = string.Empty;
        private string _msGraphEndpoint = string.Empty;

        public NotebookRepository(string accessToken)
        {
            _client = new HttpClient();
            _client.DefaultRequestHeaders.Add("Accept", "application/json");

            // set the access token on all requests to the Microsoft Graph API
            _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            _msGraphEndpoint = "https://graph.microsoft.com/beta";
            _msGraphResourceId = "https://graph.microsoft.com/";
        }

        public async Task<IEnumerable<Notebook>> GetNotebooks()
        {

            // create query
            var query = _msGraphEndpoint + "/me/onenote/notebooks";

            // create request
            var request = new HttpRequestMessage(HttpMethod.Get, query);

            // issue request & get response
            var response = await _client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.NotebooksJson>(responseString);

            // convert to model object
            var notebooks = new List<Notebook>();

            // check for null if the user's OneDrive for Business is not provisioned
            if (jsonResponse.Notebooks != null)
            {
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
            }

            return notebooks.OrderBy(n => n.Name).ToList();
        }

        public async Task<Notebook> GetNotebook(string notebookid)
        {

            // create query
            var query = string.Format("{0}/me/onenote/notebooks/?$top=1&$filter=id eq '{1}'", _msGraphEndpoint, notebookid);

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

            // create query for the specified section...
            var section = notebook.Sections.First(s => s.Id == sectionid);

            // create request to get all the pages in the section
            var request = new HttpRequestMessage(HttpMethod.Get, section.PagesUrl);

            // issue request & get response
            var response = await _client.SendAsync(request);

            // convert to JSON object
            string responseString = await response.Content.ReadAsStringAsync();
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

            // create query
            var query = string.Format("{0}/me/onenote/pages/{1}", _msGraphEndpoint, id);

            // create request
            var request = new HttpRequestMessage(HttpMethod.Delete, query);

            // issue request & get response
            await _client.SendAsync(request);
        }
    }
}