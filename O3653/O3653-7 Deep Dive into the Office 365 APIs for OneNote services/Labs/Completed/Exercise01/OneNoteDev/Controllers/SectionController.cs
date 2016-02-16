using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using OneNoteDev.Models;

namespace OneNoteDev.Controllers
{
    public class SectionController : Controller
    {
        // GET: Section
        [Authorize]
        public async Task<ActionResult> Index(string notebookid)
        {
            var repository = new NotebookRepository();

            var notebook = await repository.GetNotebookSections(notebookid);

            ViewBag.CurrentNotebookTitle = notebook.Name; ViewBag.CurrentNotebookId = notebook.Id;

            return View(notebook.Sections.OrderBy(s => s.Name).ToList());
        }
    }
}