using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml.Linq;

namespace SPContactsList.Models
{

    public interface IContactRepository
    {
        Task<List<Contact>> GetContacts(int pageIndex, int pageSize);
        Task<Contact> GetContact(string Id);
        Task<Contact> CreateContact(Contact contact);
        Task DeleteContact(string Id);
        Task UpdateContact(Contact contact);
    }
    public class ContactRepository : IContactRepository
    {
        public const string ServiceResourceId = "https://msacademy1.sharepoint.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://msacademy1.sharepoint.com/_api/");

        public const string ClientId = "54e72042-e357-437b-b8ee-73b57fcf405a";

        public const string ClientSecret = "W7pjlFs0Xf9C1P5i+s7HUlZG2WtW7xCl91i3M7EITHA=";
        public static readonly string ClientSecretEncoded = HttpUtility.UrlEncode(ClientSecret);

        public const string DebugSiteUrl = "http://localhost:46717/";
        public const string DebugSiteRedirectUrl = "http://localhost:46717/Home/OAuth/";

        public const string AADAuthUrl = "https://login.windows.net/common/oauth2/authorize" +
                                          "?resource=" + ServiceResourceId +
                                          "&client_id=" + ClientId +
                                          "&redirect_uri=" + DebugSiteRedirectUrl +
                                          "&response_type=code";

        public const string AccessTokenRequesrUrl = "https://login.windows.net/common/oauth2/token" +
                                             "";

        public static string AccessTokenRequestBody = "grant_type=authorization_code" +
                                                       "&resource=" + ServiceResourceId +
                                                       "&redirect_uri=" + DebugSiteRedirectUrl +
                                                       "&client_id=" + ClientId +
                                                       "&client_secret=" + ClientSecretEncoded +
                                                       "&code=";

        

        public async Task<List<Contact>> GetContacts(int pageIndex, int pageSize)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getByTitle('Contacts')/items")
                .Append("?$select=Id,Title,FirstName,Email,WorkPhone");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();


            XElement root = XElement.Parse(responseString);
            XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
            XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

            List<Contact> contacts = new List<Contact>();

            foreach (XElement propElement in root.Descendants(m + "properties"))
            {

                Contact contact = new Contact();
                contact.Id = propElement.Elements(d + "Id").First().Value;
                contact.LastName = propElement.Elements(d + "Title").First().Value;
                contact.FirstName = propElement.Elements(d + "FirstName").First().Value;
                contact.Phone = propElement.Elements(d + "WorkPhone").First().Value;
                contact.Email = propElement.Elements(d + "Email").First().Value;
                contacts.Add(contact);
            }

            return contacts.OrderBy(e => e.LastName).Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }

        public async Task<Contact> GetContact(string Id)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getByTitle('Contacts')/getItemByStringId('")
                .Append(Id)
                .Append("')?$select=Id,Title,FirstName,Email,WorkPhone");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();


            XElement root = XElement.Parse(responseString);
            XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
            XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

            List<Contact> contacts = new List<Contact>();

            XElement propElement = root.Descendants(m + "properties").First();

            Contact contact = new Contact();
            contact.Id = propElement.Elements(d + "Id").First().Value;
            contact.LastName = propElement.Elements(d + "Title").First().Value;
            contact.FirstName = propElement.Elements(d + "FirstName").First().Value;
            contact.Phone = propElement.Elements(d + "WorkPhone").First().Value;
            contact.Email = propElement.Elements(d + "Email").First().Value;
            contacts.Add(contact);

            return contact;
        }

        public async Task<Contact> CreateContact(Contact contact)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
            .Append("/_api/web/lists/getByTitle('Contacts')/items");

            XElement entry = contact.ToXElement();

            StringContent requestContent = new StringContent(entry.ToString());
            requestContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/atom+xml");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
            request.Content = requestContent;
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();

            return XElement.Parse(responseString).ToContact();
        }

        public async Task DeleteContact(string Id)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getByTitle('Contacts')/getItemByStringId('")
                .Append(Id)
                .Append("')");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
            request.Headers.Add("IF-MATCH", "*");
            HttpResponseMessage response = await client.SendAsync(request);
        }

        public async Task UpdateContact(Contact contact)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getByTitle('Contacts')/getItemByStringId('")
                .Append(contact.Id)
                .Append("')");

            XElement entry = contact.ToXElement();

            StringContent requestContent = new StringContent(entry.ToString());
            requestContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/atom+xml");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
            request.Content = requestContent;
            request.Headers.Add("IF-MATCH", "*");
            request.Headers.Add("X-Http-Method", "PATCH"); 
            HttpResponseMessage response = await client.SendAsync(request);

        }

        private string GetAccessToken()
        {
            string accessToken = null;

            try
            {
                accessToken = GetFromCache("AccessToken").ToString();
            }
            catch
            {
                throw new RedirectRequiredException(new Uri(AADAuthUrl));
            }

            return accessToken;

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