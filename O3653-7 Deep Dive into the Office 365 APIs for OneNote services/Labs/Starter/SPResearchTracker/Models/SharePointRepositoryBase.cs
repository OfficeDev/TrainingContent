using Microsoft.Office365.OAuth;
using System;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SPResearchTracker.Models
{
	public abstract class SharePointRepositoryBase
	{
		public string ProjectsListName = ConfigurationManager.AppSettings["ProjectsListName"];
		public string ReferencesListName = ConfigurationManager.AppSettings["ReferencesListName"];
		public string SiteUrl = ConfigurationManager.AppSettings["ida:SiteUrl"];
		string ServiceResourceId = null;

		public SharePointRepositoryBase()
		{
			ServiceResourceId = String.Format("https://{0}.sharepoint.com", ConfigurationManager.AppSettings["ida:Tenant"]);
		}

		protected async Task<string> GetAccessToken()
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

		protected void SaveInCache(string name, object value)
		{
			System.Web.HttpContext.Current.Session[name] = value;
		}

		protected object GetFromCache(string name)
		{
			return System.Web.HttpContext.Current.Session[name];
		}

		private void RemoveFromCache(string name)
		{
			System.Web.HttpContext.Current.Session.Remove(name);
		}

		public async Task<HttpResponseMessage> Get(string requestUri)
		{
			return await this.Get(requestUri, string.Empty);
		}

		/// <summary>
		/// Implements common GET functionality
		/// </summary>
		/// <param name="requestUri">The REST endpoint</param>
		/// <param name="accessToken">The SharePoint access token</param>
		/// <returns>XElement with results of operation</returns>
		public async Task<HttpResponseMessage> Get(string requestUri, string eTag)
		{
			string accessToken = await GetAccessToken();
			HttpClient client = new HttpClient();
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri);
			request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
			if (eTag.Length > 0 && eTag != "*")
			{
				request.Headers.IfNoneMatch.Add(new EntityTagHeaderValue(eTag));
			}
			return await client.SendAsync(request);
		}

		/// <summary>
		/// Implements common POST functionality
		/// </summary>
		/// <param name="requestUri">The REST endpoint</param>
		/// <param name="accessToken">The SharePoint access token</param>
		/// <param name="requestData">The POST data</param>
		/// <returns>XElement with results of operation</returns>
		public async Task<HttpResponseMessage> Post(string requestUri, StringContent requestData)
		{
			string accessToken = await GetAccessToken();
			HttpClient client = new HttpClient();
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri);
			request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
			requestData.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/atom+xml");
			request.Content = requestData;
			return await client.SendAsync(request);
		}

		/// <summary>
		/// Implements common PATCH functionality
		/// </summary>
		/// <param name="requestUri">The REST endpoint</param>
		/// <param name="accessToken">The SharePoint access token</param>
		/// <param name="eTag">The eTag of the item</param>
		/// <param name="requestData">The data to use during the update</param>
		/// <returns>XElement with results of operation</returns>
		public async Task<HttpResponseMessage> Patch(string requestUri, string eTag, StringContent requestData)
		{
			string accessToken = await GetAccessToken();
			HttpClient client = new HttpClient();
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri);
			request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
			requestData.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/atom+xml");
			if (eTag == "*")
			{
				request.Headers.Add("IF-MATCH", "*");
			}
			else
			{
				request.Headers.IfMatch.Add(new EntityTagHeaderValue(eTag));
			}
			request.Headers.Add("X-Http-Method", "PATCH");
			request.Content = requestData;
			return await client.SendAsync(request);
		}

		/// <summary>
		/// Implements common DELETE functionality
		/// </summary>
		/// <param name="requestUri">The REST endpoint</param>
		/// <param name="accessToken">The SharePoint access token</param>
		/// <param name="eTag">The eTag of the item</param>
		/// <returns>XElement with results of operation</returns>
		public async Task<HttpResponseMessage> Delete(string requestUri, string eTag)
		{
			string accessToken = await GetAccessToken();
			HttpClient client = new HttpClient();
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri);
			request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
			if (eTag == "*")
			{
				request.Headers.Add("IF-MATCH", "*");
			}
			else
			{
				request.Headers.IfMatch.Add(new EntityTagHeaderValue(eTag));
			}

			return await client.SendAsync(request);
		}
	}
}