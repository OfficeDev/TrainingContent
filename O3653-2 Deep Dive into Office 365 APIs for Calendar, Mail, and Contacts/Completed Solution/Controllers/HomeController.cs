using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

using Microsoft.Office365.OAuth;
using System.Threading.Tasks;
using Office365Contacts.Models;

namespace Office365Contacts.Controllers {
  public class HomeController : Controller {
    [Authorize]
    public async Task<ActionResult> Index(int? pageNumber) {
      // setup paging control
      int pageSize = 8;
      int pageIndex = (pageNumber != null) ? (int)pageNumber - 1 : 0;
      ViewBag.pageIndex = pageIndex;
      ViewBag.pageSize = pageSize;

      // get a list of all contacts
      List<MyContact> contacts = null;
      MyContactRepository contactRepository = new MyContactRepository();
      ViewBag.ContactCount = await contactRepository.GetContactCount();
      contacts = await contactRepository.GetContacts(pageIndex, pageSize);

      // pass the collection of contacts to the view in the model
      return View(contacts);
    }

    [Authorize]
    public async Task<ActionResult> Delete(string id) {
      MyContactRepository contactRepository = new MyContactRepository();
      if (id != null) {
        await contactRepository.DeleteContact(id);
      }
      return Redirect("/");
    }

    [Authorize]
    public async Task<ActionResult> Create(MyContact myContact) {
      // if a contact was submitted, create it
      if (Request.HttpMethod == "POST") {
        MyContactRepository contactRepository = new MyContactRepository();
        await contactRepository.AddContact(myContact);
        return Redirect("/");
      // else create a empty model & return to the create page view
      } else {
        return View(myContact);
      }
    }

    public ActionResult About() {
      ViewBag.Message = "Your application description page.";

      return View();
    }

    public ActionResult Contact() {
      ViewBag.Message = "Your contact page.";

      return View();
    }
  }
}