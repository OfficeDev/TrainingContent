using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using OneNoteDev.Models;

namespace OneNoteDev.Controllers {
  public class NotebookController : Controller {
    [Authorize]
    public async Task<ActionResult> Index()
    {
      var repository = new NotebookRepository();

      var myNotebooks = await repository.GetNotebooks();

      return View(myNotebooks);
    }
  }
}