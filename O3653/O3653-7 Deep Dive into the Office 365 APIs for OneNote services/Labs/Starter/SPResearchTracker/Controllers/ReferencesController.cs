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
	public class ReferencesController : Controller
	{
		// GET: References/Create
		public async Task<ActionResult> Create(int projectId)
		{
			Reference model = new Reference { Project = projectId.ToString() };
			return View(model);
		}

		// POST: References/Create
		[HttpPost]
		public async Task<ActionResult> Create(Reference reference)
		{
			try
			{
				ReferencesRepository referenceRepository = new ReferencesRepository();
				var result = await referenceRepository.CreateReference(reference);
				return RedirectToAction("View", "Home",new { projectId=reference.Project });
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
		}

		// GET: References/Edit/5
		public async Task<ActionResult> Edit(int id)
		{
			return await GetForEditDelete(id);
		}

		// POST: References/Edit/5
		[HttpPost]
		public async Task<ActionResult> Edit(Reference reference)
		{
			try
			{
				ReferencesRepository repository = new ReferencesRepository();
				if (await repository.UpdateReference(reference))
				{
					return RedirectToAction("View", "Home", new { projectId = reference.Project });
				}
				else
				{
					return View(reference);
				}
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
		}

		// GET: References/Delete/5
		public async Task<ActionResult> Delete(int id)
		{
			return await GetForEditDelete(id);
		}

		// POST: References/Delete/5
		[HttpPost]
		public async Task<ActionResult> Delete(Reference reference)
		{
			try
			{
				ReferencesRepository repository = new ReferencesRepository();
				if (await repository.DeleteReference(reference.Id, reference.__eTag))
				{
					return RedirectToAction("View", "Home", new { projectId = reference.Project });
				}
				else
				{
					return View(reference);
				}
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
		}

		private async Task<ActionResult> GetForEditDelete(int id)
		{
			ReferencesRepository referenceRepository = new ReferencesRepository();

			Reference reference = null;
			try
			{
				reference = await referenceRepository.GetReference(id, String.Empty);
			}
			catch (RedirectRequiredException x)
			{
				return Redirect(x.RedirectUri.ToString());
			}
			return View(reference);
		}
	}
}
