using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using Office365Contact.Models;

namespace Office365Contact.Controllers {
  public class ContactController : Controller {
    readonly MyContactRepository _repo = new MyContactRepository();

    [Authorize]
    public async Task<ActionResult> Index(int? pageNumber) {
      // setup paging
      const int pageSize = 5;
      if (pageNumber == null)
        pageNumber = 1;

      // get list of entities
      List<MyContact> contacts = null;
      contacts = await _repo.GetContacts((int)pageNumber - 1, pageSize);

      ViewBag.pageNumber = pageNumber;
      ViewBag.morePagesAvailable = _repo.MorePagesAvailable;

      return View(contacts);

    }

    [Authorize]
    public async Task<ActionResult> Details(string id) {

      var myContact = await _repo.GetContact(id);
      return View(myContact);
    }

    [Authorize]
    public async Task<ActionResult> Delete(string id) {
      if (id != null) {
        await _repo.DeleteContact(id);
      }

      return Redirect("/Contacts");

    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> Create()
    {
      var myContact = new MyContact();
      return View(myContact);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> Create(MyContact myEvent) {

      await _repo.AddContact(myEvent);
      return Redirect("/Contacts");
    }

  }
}