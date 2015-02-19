using Microsoft.Live;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;

namespace SPResearchTracker.Models
{
	public class OneNoteRepository
	{
		private const string NotebookName = "Project Research Tracker";
		private const string notebooksEndPoint = "https://www.onenote.com/api/v1.0/notebooks";
		private LiveConnectSession liveConnectSession;

		public OneNoteRepository(LiveConnectSession liveConnectSession)
		{
			this.liveConnectSession = liveConnectSession;
		}

		public async Task<Tuple<string, OneNoteNotebook>> CreateNotebook()
		{
			var createNotebookMessage = new HttpRequestMessage(HttpMethod.Post, notebooksEndPoint)
			{
				Content = new ObjectContent<OneNoteNotebookCreationInformation>(
												new OneNoteNotebookCreationInformation { name = NotebookName }, 
												new JsonMediaTypeFormatter(), "application/json")
			};

			HttpClient httpClient = new HttpClient();
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", liveConnectSession.AccessToken);
			httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

			HttpResponseMessage response = await httpClient.SendAsync(createNotebookMessage);

			OneNoteNotebook notebook = null;
			if (response.StatusCode == System.Net.HttpStatusCode.Created)
			{
				string payload = await response.Content.ReadAsStringAsync();
				notebook = JsonConvert.DeserializeObject<OneNoteNotebook>(payload);
			}
			string status = String.Format("HttpStatus: {0} - {1}<br />notebook: {2}",
															(int)response.StatusCode, response.ReasonPhrase,
															(notebook == null) ? "null" : notebook.id);
			return Tuple.Create(status, notebook);
		}

		public async Task<Tuple<string, OneNoteNotebook>> GetNotebook(string filter)
		{
			string uri = notebooksEndPoint + "?$filter=" + filter;
			var getNotebookMessage = new HttpRequestMessage(HttpMethod.Get, uri);
			HttpClient httpClient = new HttpClient();
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", liveConnectSession.AccessToken);
			httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

			HttpResponseMessage response = await httpClient.SendAsync(getNotebookMessage);

			OneNoteNotebook notebook = null; 
			if (response.StatusCode == System.Net.HttpStatusCode.OK)
			{
				string payload = await response.Content.ReadAsStringAsync();

				dynamic results = JsonConvert.DeserializeObject(payload);
				JArray resultArray = results.value as JArray;
				if (resultArray.Count > 0)
				{
					JObject jNotebook = resultArray[0] as JObject;
					notebook = jNotebook.ToObject<OneNoteNotebook>(); 
				}
			}
			string status = String.Format("HttpStatus: {0} - {1}<br />notebook: {2}",
															(int)response.StatusCode, response.ReasonPhrase,
															(notebook == null) ? "null" : notebook.id);
			return Tuple.Create(status, notebook);
		}

		public async Task<Tuple<string, OneNoteSection>> GetNotebookSection(OneNoteNotebook notebook, string filter)
		{
			string uri = notebook.sectionsUrl + "?$filter=" + filter;
			var getSectionMessage = new HttpRequestMessage(HttpMethod.Get, uri);
			HttpClient httpClient = new HttpClient();
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", liveConnectSession.AccessToken);
			httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

			HttpResponseMessage response = await httpClient.SendAsync(getSectionMessage);

			OneNoteSection section = null;
			if (response.StatusCode == System.Net.HttpStatusCode.OK)
			{
				string payload = await response.Content.ReadAsStringAsync();
				dynamic results = JsonConvert.DeserializeObject(payload);
				JArray resultArray = results.value as JArray;
				if (resultArray.Count > 0)
				{
					JObject jSection = resultArray[0] as JObject;
					section = jSection.ToObject<OneNoteSection>();
				}
			}
			string status = String.Format("HttpStatus: {0} - {1}<br />section: {2}",
															(int)response.StatusCode, response.ReasonPhrase,
															(section == null) ? "null" : section.id);
			return Tuple.Create(status, section);
		}

		public async Task<Tuple<string,OneNoteSection>> CreateSection(OneNoteNotebook notebook, string sectionName)
		{
			var createSectionMessage = new HttpRequestMessage(HttpMethod.Post, notebook.sectionsUrl)
			{
				Content = new ObjectContent<OneNoteSectionCreationInformation>(
												new OneNoteSectionCreationInformation { name = sectionName },
												new JsonMediaTypeFormatter(), "application/json")
			};

			HttpClient httpClient = new HttpClient();
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", liveConnectSession.AccessToken);
			httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

			HttpResponseMessage response = await httpClient.SendAsync(createSectionMessage);

			OneNoteSection section = null;
			if (response.StatusCode == System.Net.HttpStatusCode.Created)
			{
				string payload = await response.Content.ReadAsStringAsync();
				section = JsonConvert.DeserializeObject<OneNoteSection>(payload);
			}
			string status = String.Format("HttpStatus: {0} - {1}<br />section: {2}",
															(int)response.StatusCode, response.ReasonPhrase,
															(section == null) ? "null" : section.id);
			return Tuple.Create(status, section);
		}
	
		public async Task<string> CreatePageForReference(string pageEndPoint, Reference reference)
		{
			string pageTemplate = @"<html>" +
															"<head>" +
																"<title>{0}</title>" +
																"<meta name=\"created\" content=\"{1}\" />" +
															"</head>" +
															"<body>" +
																"<p>{2}</p>" +
																"<img data-render-src=\"{3}\" alt=\"{4}\"/>" +
															"</body>" +
														"</html>";
			string pageContent = String.Format(pageTemplate,
																		reference.Title,
																		DateTime.Now.ToString("o"),
																		reference.Notes,
																		reference.Url,
																		reference.Title);

			var createPageMessage = new HttpRequestMessage(HttpMethod.Post, pageEndPoint)
			{
				Content = new StringContent(pageContent, System.Text.Encoding.UTF8, "text/html")
			};

			HttpClient httpClient = new HttpClient();
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", liveConnectSession.AccessToken);
			httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

			HttpResponseMessage response = await httpClient.SendAsync(createPageMessage);

			return String.Format("HttpStatus: {0} - {1}", (int)response.StatusCode, response.ReasonPhrase);
		}
	}
}