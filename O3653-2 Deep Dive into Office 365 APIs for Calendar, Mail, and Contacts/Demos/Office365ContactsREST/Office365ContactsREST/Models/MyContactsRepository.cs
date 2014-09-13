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

			string requestUri = "https://outlook.office365.com/ews/odata/Me/Contacts/?$select=Id";				                

			HttpClient client = new HttpClient();
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri);
			request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
			HttpResponseMessage response = await client.SendAsync(request);

			XElement root = Json2Xml(await response.Content.ReadAsStringAsync());

			return root.Descendants("item").Count();

		}

		public async Task<List<MyContact>> GetContacts(int pageIndex, int pageSize) {

			string requestUri = "https://outlook.office365.com/ews/odata/Me/Contacts/" +
													"?$select=Id,GivenName,Surname,CompanyName,EmailAddress1,BusinessPhone1,HomePhone1" +
													"&$skip=" + (pageIndex * pageSize).ToString() + "&$top=" + pageSize.ToString(); ;

			HttpClient client = new HttpClient();
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri);
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

			return myContactsList.OrderBy(e => e.Surname).ToList();
		}

		public async Task DeleteContact(string id) {

			string requestUri = "https://outlook.office365.com/ews/odata/Me/Contacts('" + id + "')";

			HttpClient client = new HttpClient();
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri);
			request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
			HttpResponseMessage response = await client.SendAsync(request);
		}

		public async Task AddContact(MyContact myContact) {

			string requestUri = "https://outlook.office365.com/ews/odata/Me/Contacts";

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

		// convert JSON response data into XML for easier consumption from C#
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

			// this triggers user login prompt for Office 365
			ResourceDiscoveryResult rdr = await disco.DiscoverResourceAsync(ServiceResourceId);

			string clientId = disco.AppIdentity.ClientId;
			string clientSecret = disco.AppIdentity.ClientSecret;
			string refreshToken = new SessionCache().Read("RefreshToken");
			ClientCredential creds = new ClientCredential(clientId, clientSecret);

			AuthenticationResult authResult =
					await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(refreshToken, 
					                                                                  creds, 
																																						ServiceResourceId);

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