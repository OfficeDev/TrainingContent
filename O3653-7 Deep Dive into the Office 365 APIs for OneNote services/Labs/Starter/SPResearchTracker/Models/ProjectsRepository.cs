using SPResearchTracker.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace SPResearchTracker.Models
{
	public interface IProjectsRepository
	{
		Task<IEnumerable<Project>> GetProjects(int pageIndex, int pageSize);
		Task<Project> GetProject(int Id, string etag);
		Task<Project> CreateProject(Project project);
		Task<bool> UpdateProject(Project project);
		Task<bool> DeleteProject(int Id, string eTag);
	}

	public class ProjectsRepository : SharePointRepositoryBase, IProjectsRepository
	{
		string ServiceResourceId = String.Empty;
		
		XNamespace a = "http://www.w3.org/2005/Atom";
		XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
		XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

		public async Task<IEnumerable<Project>> GetProjects(int pageIndex, int pageSize)
		{
			List<Project> projects = new List<Project>();

			StringBuilder requestUri = new StringBuilder()
					.Append(this.SiteUrl)
					.Append("/_api/web/lists/getbyTitle('")
					.Append(this.ProjectsListName)
					.Append("')/items?$select=ID,Title");

			HttpResponseMessage response = await this.Get(requestUri.ToString());
			string responseString = await response.Content.ReadAsStringAsync();
			XElement root = XElement.Parse(responseString);

			foreach (XElement entryElem in root.Elements().Where(e => e.Name.LocalName == "entry"))
			{
				projects.Add(entryElem.ToProject());
			}

			return projects.OrderBy(e => e.Title).Skip(pageIndex * pageSize).Take(pageSize);
		}

		public async Task<Project> GetProject(int Id, string etag)
		{
			StringBuilder requestUri = new StringBuilder()
					.Append(this.SiteUrl)
					.Append("/_api/web/lists/getbyTitle('")
					.Append(this.ProjectsListName)
					.Append("')/getItemByStringId('")
					.Append(Id.ToString())
					.Append("')?$select=ID,Title");

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
			XElement root = XElement.Parse(responseString);

			return XElement.Parse(responseString).ToProject();
		}

		public async Task<Project> CreateProject(Project project)
		{
			StringBuilder requestUri = new StringBuilder()
					 .Append(this.SiteUrl)
					 .Append("/_api/web/lists/getbyTitle('")
					 .Append(this.ProjectsListName)
					 .Append("')/items");

			XElement entry = project.ToXElement((string)base.GetFromCache(this.ProjectsListName));

			StringContent requestContent = new StringContent(entry.ToString());
			HttpResponseMessage response = await this.Post(requestUri.ToString(), requestContent);
			string responseString = await response.Content.ReadAsStringAsync();

			return XElement.Parse(responseString).ToProject();
		}

		public async Task<bool> UpdateProject(Project project)
		{
			StringBuilder requestUri = new StringBuilder()
					.Append(this.SiteUrl)
					.Append("/_api/web/lists/getbyTitle('")
					.Append(this.ProjectsListName)
					.Append("')/getItemByStringId('")
					.Append(project.Id.ToString())
					.Append("')");

			XElement entry = project.ToXElement((string)base.GetFromCache(this.ProjectsListName));

			StringContent requestContent = new StringContent(entry.ToString());
			HttpResponseMessage response = await this.Patch(requestUri.ToString(), project.__eTag, requestContent);
			return response.IsSuccessStatusCode;
		}

		public async Task<bool> DeleteProject(int Id, string eTag)
		{
			StringBuilder requestUri = new StringBuilder()
					.Append(this.SiteUrl)
					.Append("/_api/web/lists/getbyTitle('")
					.Append(this.ProjectsListName)
					.Append("')/getItemByStringId('")
					.Append(Id.ToString())
					.Append("')");

			HttpResponseMessage response = await this.Delete(requestUri.ToString(), eTag);
			return response.IsSuccessStatusCode;
		}
	}
}