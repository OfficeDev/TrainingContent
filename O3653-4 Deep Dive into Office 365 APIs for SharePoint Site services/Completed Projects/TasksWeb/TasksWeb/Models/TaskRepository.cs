using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System.Xml.Linq;
using System.Threading.Tasks;
using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;

namespace TasksWeb.Models
{
    public class TaskRepository
    {
        const string ServiceResourceId = "https://[tenant].sharepoint.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://[tenant].sharepoint.com/_api/");

        XNamespace a = "http://www.w3.org/2005/Atom";
        XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
        XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

        public async Task<List<Task>> GetTasks(int pageIndex, int pageSize)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getbytitle('Tasks')/items")
                .Append("?$select=Id,Title,Status,Priority,AssignedTo/Name&$expand=AssignedTo");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();


            XElement root = XElement.Parse(responseString);

            List<Task> tasks = new List<Task>();

            foreach (XElement entryElement in root.Elements(a + "entry"))
            {

                Task task = new Task();
                task.Id = entryElement.Descendants(m + "properties").Descendants(d + "Id").First().Value;
                task.Title = entryElement.Descendants(m + "properties").Descendants(d + "Title").First().Value;
                task.Status = entryElement.Descendants(m + "properties").Descendants(d + "Status").First().Value;
                task.Priority = entryElement.Descendants(m + "properties").Descendants(d + "Priority").First().Value;
                try { task.AssignedTo = entryElement.Descendants(a + "entry").Descendants(d + "Name").First().Value; }
                catch { }
                tasks.Add(task);
            }

            return tasks.OrderBy(e => e.Title).Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }

        public async Task<Task> GetTask(string Id)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getbytitle('Tasks')/items?$filter=Id%20eq%20")
                .Append(Id)
                .Append("&$select=Id,Title,Status,Priority,AssignedTo/Name&$expand=AssignedTo");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();


            XElement root = XElement.Parse(responseString);

            XElement entryElement = root.Elements(a + "entry").First();

            Task task = new Task();
            task.Id = entryElement.Descendants(m + "properties").Descendants(d + "Id").First().Value;
            task.Title = entryElement.Descendants(m + "properties").Descendants(d + "Title").First().Value;
            task.Status = entryElement.Descendants(m + "properties").Descendants(d + "Status").First().Value;
            task.Priority = entryElement.Descendants(m + "properties").Descendants(d + "Priority").First().Value;
            try { task.AssignedTo = entryElement.Descendants(a + "entry").Descendants(d + "Name").First().Value; }
            catch { }

            return task;
        }

        public async Task<Task> CreateTask(Task task)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
            .Append("/_api/web/lists/getByTitle('Tasks')/items");

            XElement entry = new XElement(a + "entry",
                    new XAttribute(XNamespace.Xmlns + "d", d),
                    new XAttribute(XNamespace.Xmlns + "m", m),
                    new XElement(a + "category", new XAttribute("term", "SP.Data.TasksListItem"), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
                    new XElement(a + "content", new XAttribute("type", "application/xml"),
                        new XElement(m + "properties",
                            new XElement(d + "Title", task.Title),
                            new XElement(d + "Status", task.Status),
                            new XElement(d + "Priority", task.Priority))));

            StringContent requestContent = new StringContent(entry.ToString());
            requestContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/atom+xml");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            request.Content = requestContent;
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();

            XElement root = XElement.Parse(responseString); 
            XElement entryElement = root.Elements(a + "entry").First();

            Task newTask = new Task();
            newTask.Id = entryElement.Descendants(m + "properties").Descendants(d + "Id").First().Value;
            newTask.Title = entryElement.Descendants(m + "properties").Descendants(d + "Title").First().Value;
            newTask.Status = entryElement.Descendants(m + "properties").Descendants(d + "Status").First().Value;
            newTask.Priority = entryElement.Descendants(m + "properties").Descendants(d + "Priority").First().Value;
            newTask.AssignedTo = "Not created in this exercise for simplicity";

            return newTask;
        }

        public async System.Threading.Tasks.Task DeleteTask(string Id)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getByTitle('Tasks')/getItemByStringId('")
                .Append(Id)
                .Append("')");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            request.Headers.Add("IF-MATCH", "*");
            HttpResponseMessage response = await client.SendAsync(request);
        }

        public async System.Threading.Tasks.Task UpdateTask(Task task)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getByTitle('Tasks')/getItemByStringId('")
                .Append(task.Id)
                .Append("')");

            XElement entry = new XElement(a + "entry",
                    new XAttribute(XNamespace.Xmlns + "d", d),
                    new XAttribute(XNamespace.Xmlns + "m", m),
                    new XElement(a + "category", new XAttribute("term", "SP.Data.TasksListItem"), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
                    new XElement(a + "content", new XAttribute("type", "application/xml"),
                        new XElement(m + "properties",
                            new XElement(d + "Title", task.Title),
                            new XElement(d + "Status", task.Status),
                            new XElement(d + "Priority", task.Priority))));

            StringContent requestContent = new StringContent(entry.ToString());
            requestContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/atom+xml");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            request.Content = requestContent;
            request.Headers.Add("IF-MATCH", "*");
            request.Headers.Add("X-Http-Method", "PATCH");
            HttpResponseMessage response = await client.SendAsync(request);

        }
        private async Task<string> GetAccessToken()
        {
            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null)
            {
                disco = await DiscoveryContext.CreateAsync();
                SaveInCache("DiscoveryContext", disco);
            }

            var dcr = await disco.DiscoverResourceAsync(ServiceResourceId);

            SaveInCache("LastLoggedInUser", dcr.UserId);

            return (await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                new SessionCache().Read("RefreshToken"),
                new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(
                    disco.AppIdentity.ClientId,
                    disco.AppIdentity.ClientSecret),
                    ServiceResourceId)).AccessToken;
        }
        private void SaveInCache(string name, object value)
        {
            System.Web.HttpContext.Current.Session[name] = value;
        }

        private object GetFromCache(string name)
        {
            return System.Web.HttpContext.Current.Session[name];
        }

        private void RemoveFromCache(string name)
        {
            System.Web.HttpContext.Current.Session.Remove(name);
        }
    }
}