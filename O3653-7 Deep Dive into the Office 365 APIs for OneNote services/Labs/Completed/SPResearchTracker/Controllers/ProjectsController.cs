using Microsoft.Office365.OAuth;
using SPResearchTracker.Models;
using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SPResearchTracker.Controllers
{
	public class ProjectsController : Controller
	{
		// GET: Projects/Create
		public async Task<ActionResult> Create()
		{
			return View();
		}

		// POST: Projects/Create
		[HttpPost]
		public async Task<ActionResult> Create(Project project)
		{
			try
			{
				ProjectsRepository projectRepository = new ProjectsRepository();
				var result = await projectRepository.CreateProject(project);
				return RedirectToAction("Index", "Home");
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
		}

		// GET: Projects/Edit/5
		public async Task<ActionResult> Edit(int id)
		{
			return await GetForEditDelete(id);
		}

		// POST: Projects/Edit/5
		[HttpPost]
		public async Task<ActionResult> Edit(Project project)
		{
			try
			{
				ProjectsRepository repository = new ProjectsRepository();
				if (await repository.UpdateProject(project))
				{
					return RedirectToAction("View", "Home", new { projectId = project.Id });
				}
				else
				{
					return View(project);
				}
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
		}


		// GET: Projects/Delete/5
		public async Task<ActionResult> Delete(int id)
		{
			return await GetForEditDelete(id);
		}

		// POST: Projects/Delete/5
		[HttpPost]
		public async Task<ActionResult> Delete(Project project)
		{
			try
			{
				ProjectsRepository repository = new ProjectsRepository();
				if (await repository.DeleteProject(project.Id, project.__eTag))
				{
					return RedirectToAction("Index", "Home");
				}
				else
				{
					return View(project);
				}
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
		}


		private async Task<ActionResult> GetForEditDelete(int id)
		{
			ProjectsRepository projectRepository = new ProjectsRepository();

			Project project = null;
			try
			{
				project = await projectRepository.GetProject(id, String.Empty);
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
			return View(project);
		}
	}
}
