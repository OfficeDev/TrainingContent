using SPResearchTracker.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace SPResearchTracker.Models
{
	public interface IReferencesRepository
	{
		Task<IEnumerable<Reference>> GetReferences();
		Task<Reference> GetReference(int Id, string etag);
		Task<Reference> CreateReference(Reference reference);
		Task<bool> UpdateReference(Reference reference);
		Task<bool> DeleteReference(int Id, string eTag);
	}
	public class ReferencesRepository : SharePointRepositoryBase, IReferencesRepository
	{
		public async Task<IEnumerable<Reference>> GetReferences()
		{
			return await GetReferencesFiltered(String.Empty);
		}

		public async Task<IEnumerable<Reference>> GetReferencesForProject(int projectId)
		{
			string filter = String.Format("Project eq '{0}'", projectId);
			return await GetReferencesFiltered(filter);
		}

		public async Task<IEnumerable<Reference>> GetReferencesFiltered(string filter)
		{
			List<Reference> references = new List<Reference>();

			StringBuilder requestUri = new StringBuilder()
					.Append(this.SiteUrl)
					.Append("/_api/web/lists/getbyTitle('")
					.Append(this.ReferencesListName)
					.Append("')/items?$select=ID,Title,URL,Comments,Project");

			if (!String.IsNullOrEmpty(filter))
			{
				requestUri.Append("&$filter=" + filter);
			}

			HttpResponseMessage response = await this.Get(requestUri.ToString());
			string responseString = await response.Content.ReadAsStringAsync();
			XElement root = XElement.Parse(responseString);

			foreach (XElement entryElem in root.Elements().Where(e => e.Name.LocalName == "entry"))
			{
				references.Add(entryElem.ToReference());
			}

			return references.AsQueryable();

		}

		public async Task<Reference> GetReference(int Id, string etag)
		{
			StringBuilder requestUri = new StringBuilder()
					.Append(this.SiteUrl)
					.Append("/_api/web/lists/getbyTitle('")
					.Append(this.ReferencesListName)
					.Append("')/getItemByStringId('")
					.Append(Id.ToString())
					.Append("')?$select=ID,Title,URL,Comments,Project");

			HttpResponseMessage response = null;
			if (String.IsNullOrEmpty(etag))
			{
				response = await this.Get(requestUri.ToString());
			}
			else
			{
				response = await this.Get(requestUri.ToString(), etag);
			}
			string responseString = await response.Content.ReadAsStringAsync();

			return XElement.Parse(responseString).ToReference();

		}

		public async Task<Reference> CreateReference(Reference reference)
		{
			StringBuilder requestUri = new StringBuilder()
					 .Append(this.SiteUrl)
					 .Append("/_api/web/lists/getbyTitle('")
					 .Append(this.ReferencesListName)
					 .Append("')/items");

			if (reference.Title == null || reference.Title.Length == 0)
			{
				reference.Title = await GetTitleFromLink(reference.Url);
			}

			XElement entry = reference.ToXElement((string)base.GetFromCache(this.ReferencesListName));

			StringContent requestContent = new StringContent(entry.ToString());
			HttpResponseMessage response = await this.Post(requestUri.ToString(), requestContent);
			string responseString = await response.Content.ReadAsStringAsync();

			return XElement.Parse(responseString).ToReference();
		}

		public async Task<bool> UpdateReference(Reference reference)
		{
			StringBuilder requestUri = new StringBuilder()
					.Append(this.SiteUrl)
					.Append("/_api/web/lists/getbyTitle('")
					.Append(this.ReferencesListName)
					.Append("')/getItemByStringId('")
					.Append(reference.Id.ToString())
					.Append("')");

			XElement entry = reference.ToXElement((string)base.GetFromCache(this.ReferencesListName));

			StringContent requestContent = new StringContent(entry.ToString());
			HttpResponseMessage response = await this.Patch(requestUri.ToString(), reference.__eTag, requestContent);
			return response.IsSuccessStatusCode;

		}

		public async Task<bool> DeleteReference(int Id, string eTag)
		{
			StringBuilder requestUri = new StringBuilder()
					.Append(this.SiteUrl)
					.Append("/_api/web/lists/getbyTitle('")
					.Append(this.ReferencesListName)
					.Append("')/getItemByStringId('")
					.Append(Id.ToString())
					.Append("')");


			HttpResponseMessage response = await this.Delete(requestUri.ToString(), eTag);
			return response.IsSuccessStatusCode;
		}

		private async Task<string> GetTitleFromLink(string Url)
		{
			HttpClient client = new HttpClient();
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Url);
			HttpResponseMessage response = await client.SendAsync(request);
			string responseString = await response.Content.ReadAsStringAsync();
			Match match = Regex.Match(responseString, @"<title>\s*(.+?)\s*</title>");
			if (match.Success)
			{
				return match.Groups[1].Value;
			}
			else
			{
				return "Unknown Title";
			}
		}
	}
}