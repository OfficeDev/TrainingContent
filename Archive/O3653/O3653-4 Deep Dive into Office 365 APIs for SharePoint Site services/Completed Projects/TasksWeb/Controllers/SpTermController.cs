using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.Ajax.Utilities;
using TasksWeb.Models;

namespace TasksWeb.Controllers {
  public class SpTermController : Controller {
    private SpTermRepository _repo = new SpTermRepository();

    [Authorize]
    public async Task<ActionResult> Index(Guid? parentTermId, string parentTermLabel) {
      var viewModel = new SpTermViewModel();

      // if no parent term passed in, get the root
      if (!parentTermId.HasValue)
        viewModel.Terms = await _repo.GetTerms();
      else {
        viewModel.ParentTermId = parentTermId.Value;
        viewModel.ParentTermLabel = parentTermLabel;
        viewModel.Terms = await _repo.GetTerms(parentTermId.Value);
      }

      return View(viewModel);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> Create(Guid parentTermId, string parentTermLabel) {
      var viewModel = new SpTermViewModel {
        ParentTermId = parentTermId,
        ParentTermLabel = parentTermLabel
      };

      return View(viewModel);
    }

    [HttpPost]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> Create() {
      // load model
      var viewModel = new SpTermViewModel {
        ParentTermId = new Guid(Request.Form["ParentTermId"]),
        ParentTermLabel = Request.Form["ParentTermLabel"],
        NewTermLabel = Request.Form["NewTermLabel"]
      };

      // create the term
      await _repo.CreateTerm(viewModel.ParentTermId, viewModel.NewTermLabel);
      return
        Redirect(string.Format("/SpTerm?parentTermId={0}&parentTermLabel={1}",
                                viewModel.ParentTermId,
                                viewModel.ParentTermLabel)
                );
    }

    [HttpPost]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> Delete(Guid termId) {

      await _repo.DeleteTerm(termId);

      return Redirect("/SpTerm");
    }
  }
}