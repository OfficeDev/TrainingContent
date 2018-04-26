using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using OneNoteDev.Models;

namespace OneNoteDev.Controllers
{
    public class PageController : Controller
    {
        // GET: Page
        [Authorize]
        public async Task<ActionResult> Index(string notebookid, string sectionid)
        {
            var repository = new NotebookRepository();
            var notebook = await repository.GetNotebookPages(notebookid, sectionid);
            ViewBag.CurrentNotebookTitle = notebook.Name;
            ViewBag.CurrentNotebookId = notebook.Id;
            var section = notebook.Sections.First(s => s.Id == sectionid);
            ViewBag.CurrentSectionTitle = section.Name;
            return View(section.Pages);
        }

        [Authorize]
        public async Task<ActionResult> Delete(string id)
        {
            var repository = new NotebookRepository();
            if (id != null)
            {
                await repository.DeletePage(id);
            }
            return Redirect("/");
        }
    }
}