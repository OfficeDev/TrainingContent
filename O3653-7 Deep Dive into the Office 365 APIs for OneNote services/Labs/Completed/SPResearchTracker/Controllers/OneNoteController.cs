using Microsoft.Live;
using SPResearchTracker.Models;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SPResearchTracker.Controllers
{
	public class OneNoteController : Controller
	{
		private const string clientId = "000000004812A09A";
		private const string clientSecret = "Nt7xRt4zTeWbBBvlUSzv76J4ymTxizoz";
		private const string clientRedirect = "https://officedevlocal.com:44300/OneNote/Process";
		private string[] scopes = new string[] { "wl.signin", "wl.offline_access", "Office.OneNote_Create" };

		private LiveAuthClient liveAuthClient = new LiveAuthClient(clientId, clientSecret, clientRedirect);

		// GET: OneNote
		public async Task<ActionResult> Index(string id)
		{
			// save the selected project id
			this.HttpContext.Session["onenote-project"] = id;

			LiveLoginResult loginStatus = await liveAuthClient.InitializeWebSessionAsync(this.HttpContext);
			return Redirect(liveAuthClient.GetLoginUrl(scopes));
		}

		public async Task<ActionResult> Process(string code)
		{
			OneNoteViewModel model = new OneNoteViewModel();
			StringBuilder status = new StringBuilder();
			Tuple<string, OneNoteNotebook> notebookApiResult = null;
			Tuple<string, OneNoteSection> sectionApiResult = null;

			if (code != null)
			{
				LiveLoginResult loginStatus = await liveAuthClient.ExchangeAuthCodeAsync(this.HttpContext);

				// get the selected project
				string projectId = (string)this.HttpContext.Session["onenote-project"];
				ProjectDetailViewModel data = await GetProjectAndReferencesFromSharePoint(projectId);

				OneNoteRepository repository = new OneNoteRepository(loginStatus.Session);

				status.Append("GetNotebook: ");
				notebookApiResult = await repository.GetNotebook("name eq 'Project Research Tracker'");
				status.Append(notebookApiResult.Item1 + "<br/>");
				OneNoteNotebook notebook = notebookApiResult.Item2;

				if (notebook == null)
				{
					status.Append("CreateNotebook: ");
					notebookApiResult = await repository.CreateNotebook();
					status.Append(notebookApiResult.Item1 + "<br/>");
					notebook = notebookApiResult.Item2;
				}

				if (notebook != null)
				{
					model.NewNotebookLink = notebook.links.oneNoteWebUrl.href;

					string filter = String.Format("name eq '{0}'", data.Project.Title);
					status.Append("GetSection: ");
					sectionApiResult = await repository.GetNotebookSection(notebook, filter);
					status.Append(sectionApiResult.Item1 + "<br/>");
					OneNoteSection section = sectionApiResult.Item2;

					if (section == null)
					{
						status.Append("CreateSection: ");
						sectionApiResult = await repository.CreateSection(notebook, data.Project.Title);
						status.Append(sectionApiResult.Item1 + "<br/>");
						section = sectionApiResult.Item2;
					}

					if (section != null)
					{
						foreach (Reference reference in data.References)
						{
							status.Append("CreatePage: ");
							string result = await repository.CreatePageForReference(section.pagesUrl, reference);
							status.Append(result + "<br/>");
						}
					}
				}

				model.ResponseMessage = status.ToString();
				return View(model);
			}
			else
			{
				RedirectToAction("Index", "Home");
			}

			return null;
		}
		

		private async Task<ProjectDetailViewModel> GetProjectAndReferencesFromSharePoint(string projectId)
		{
			ProjectDetailViewModel model = new ProjectDetailViewModel();
			ProjectsRepository projectRepository = new ProjectsRepository();
			ReferencesRepository referenceRepository = new ReferencesRepository();

			int id = -1;
			if (Int32.TryParse(projectId, out id))
			{
				model.Project = await projectRepository.GetProject(id, String.Empty);
				model.References = (await referenceRepository.GetReferencesForProject(id)).ToList();
			}
			return model;
		}
	}
}