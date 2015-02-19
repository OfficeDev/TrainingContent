using Microsoft.Office365.OAuth;
using SPResearchTracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SPResearchTracker.Controllers
{
	public class HomeController : Controller
	{
		public async Task<ActionResult> Index(int? pageIndex, int? pageSize, string projectId)
		{
			ProjectsRepository repository = new ProjectsRepository();
			ProjectListViewModel model = new ProjectListViewModel();

			if (pageIndex == null) { model.PageIndex = 0; }
			else { model.PageIndex = (int)pageIndex; }

			if (pageSize == null) { model.PageSize = 10; }
			else { model.PageSize = (int)pageSize; }

			try
			{
				SPListConfig cfg = new SPListConfig();
				await cfg.ConfigureSharePoint();

				var r = await repository.GetProjects(model.PageIndex, model.PageSize);
				model.Projects = r.ToList();
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
			return View(model);
		}

		public async Task<ActionResult> View(string projectId)
		{
			ProjectDetailViewModel model = new ProjectDetailViewModel();
			ProjectsRepository projectRepository = new ProjectsRepository();
			ReferencesRepository referenceRepository = new ReferencesRepository();

			int id = -1;
			try
			{
				if (Int32.TryParse(projectId, out id))
				{
					model.Project = await projectRepository.GetProject(id, String.Empty);
					model.References = (await referenceRepository.GetReferencesForProject(id)).ToList();
				}
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
			return View(model);
		}
	}
}