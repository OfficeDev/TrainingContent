using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.IO;

using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

using Microsoft.Office365.OAuth;
using Microsoft.Office365.Exchange;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace Office365ContactsREST.Models {
    public class MyContactsRepository {
        public async Task<int> GetContactCount() {

            string ServiceRootUrl = "https://outlook.office365.com/";

            StringBuilder requestUri = new StringBuilder(ServiceRootUrl)
                .Append("EWS/OData/Me/Contacts/")
                .Append("?$select=Id");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);

            XElement root = Json2Xml(await response.Content.ReadAsStringAsync());

            var myContactsList = new List<MyContact>();
            return root.Descendants("item").Count();

        }
 
        public async Task<List<MyContact>> GetContacts(int pageIndex, int pageSize) {

            string ServiceRootUrl = "https://outlook.office365.com/";

            StringBuilder requestUri = new StringBuilder(ServiceRootUrl)
                .Append("EWS/OData/Me/Contacts/")
                .Append("?$select=Id,GivenName,Surname,CompanyName,EmailAddress1,BusinessPhone1,HomePhone1");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);

            XElement root = Json2Xml(await response.Content.ReadAsStringAsync());
            
            var myContactsList = new List<MyContact>();

            foreach (XElement propElement in root.Descendants("item")) {
                myContactsList.Add(new MyContact {
                    Id = propElement.Elements("Id").First().Value,
                    GivenName = propElement.Elements("GivenName").First().Value,
                    Surname = propElement.Elements("Surname").First().Value,
                    CompanyName = propElement.Elements("CompanyName").First().Value,
                    EmailAddress1 = propElement.Elements("EmailAddress1").First().Value,
                    BusinessPhone1 = propElement.Elements("BusinessPhone1").First().Value,
                    HomePhone1 = propElement.Elements("HomePhone1").First().Value                
                });
            }

            //Perform paging here using LINQ
            return myContactsList.OrderBy(e => e.Surname).Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }

        public async Task DeleteContact(string id) {

            string ServiceRootUrl = "https://outlook.office365.com/";
            string requestUri = ServiceRootUrl = "EWS/OData/Me/Contacts('" + id + "')";

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
        }

        public async Task AddContact(MyContact myContact) {

            string ServiceRootUrl = "https://outlook.office365.com/";
            string requestUri = ServiceRootUrl + "EWS/OData/Me/Contacts";                           

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());

            StringBuilder jsonContact = new StringBuilder()
            .Append("{'@odata.type': '#Microsoft.Exchange.Services.OData.Model.Contact',")
            .Append("'GivenName': '" + myContact.GivenName + "',")
            .Append("'Surname': '" + myContact.Surname + "',")
            .Append("'CompanyName': '" + myContact.CompanyName + "',")
            .Append("'EmailAddress1': '" + myContact.EmailAddress1 + "',")
            .Append("'BusinessPhone1': '" + myContact.BusinessPhone1 + "',")
            .Append("'HomePhone1': '" + myContact.HomePhone1 + "' }");

            request.Content = new StringContent(jsonContact.ToString());
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.SendAsync(request);
        }

        private static XElement Json2Xml(string json) {
            using (XmlDictionaryReader reader = JsonReaderWriterFactory.CreateJsonReader(
                Encoding.UTF8.GetBytes(json),
                XmlDictionaryReaderQuotas.Max)) {
                return XElement.Load(reader);
            }
        }

        private async Task<string> GetAccessToken() {

            string ServiceResourceId = "https://outlook.office365.com";
            Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

            DiscoveryContext disco = await DiscoveryContext.CreateAsync();
            ResourceDiscoveryResult rdr = await disco.DiscoverResourceAsync(ServiceResourceId);

            string clientId = disco.AppIdentity.ClientId;
            string clientSecret = disco.AppIdentity.ClientSecret;
            string refreshToken = new SessionCache().Read("RefreshToken");
            ClientCredential creds = new ClientCredential(clientId, clientSecret);

            AuthenticationResult authResult =
                await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                refreshToken, creds, ServiceResourceId);

            return authResult.AccessToken;
        }

        private void SaveInCache(string name, object value) {
            System.Web.HttpContext.Current.Session[name] = value;
        }

        private object GetFromCache(string name) {
            return System.Web.HttpContext.Current.Session[name];
        }

        private void RemoveFromCache(string name) {
            System.Web.HttpContext.Current.Session.Remove(name);
        }
  
    }
}