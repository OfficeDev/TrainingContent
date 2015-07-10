using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using Office365Mail.Models;

namespace Office365Mail.Controllers {
  public class MailController : Controller {
    MyMessagesRespository _repo = new MyMessagesRespository();

    [Authorize]
    public async Task<ActionResult> Index(int? pageNumber) {
      // setup paging
      const int pageSize = 2;
      if (pageNumber == null)
        pageNumber = 1;

      // get list of entities
      var messages = await _repo.GetMessages((int)pageNumber - 1, pageSize);

      ViewBag.pageNumber = pageNumber;
      ViewBag.morePagesAvailable = _repo.MorePagesAvailable;

      return View(messages);

    }

    [Authorize]
    public async Task<ActionResult> Details(string id) {

      MyMessage myEvent = null;
      myEvent = await _repo.GetMessage(id);
      return View(myEvent);
    }

    [Authorize]
    public async Task<ActionResult> Delete(string id) {
      if (id != null) {
        await _repo.DeleteMessage(id);
      }

      return Redirect("/Mail");

    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> Send() {
      return View(new MyMessage());
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> Send(MyMessage myEvent) {
      myEvent.FromName = User.Identity.Name;
      myEvent.FromEmailAddress = User.Identity.Name;

      await _repo.SendMessage(myEvent);
      return Redirect("/Mail");
    }
  }
}