using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using Microsoft.Office365.OutlookServices;
using Microsoft.Office365.OAuth;
using OutlookServicesClientDemo.Models;


namespace OutlookServicesClientDemo.Controllers {
  public class ContactsController : Controller {
    [Authorize]
    public async Task<ActionResult> Index(int? pageNumber) {

      int pageSize = 8;
      int pageIndex = (pageNumber != null) ? (int)pageNumber - 1 : 0;

      ViewBag.pageIndex = pageIndex;
      ViewBag.pageSize = pageSize;

      List<MyContact> contacts = null;
      MyContactRepository repo = new MyContactRepository();
      ViewBag.contactCount = await repo.GetContactCount();
      contacts = await repo.GetContacts(pageIndex, pageSize);

      return View(contacts);
    }

    [Authorize]
    public async Task<ActionResult> Details(string id) {

      MyContact contact = null;
      MyContactRepository repo = new MyContactRepository();
      contact = await repo.GetContact(id);

      return View(contact);
    }

    [Authorize]
    public async Task<ActionResult> Delete(string id) {
      MyContactRepository repo = new MyContactRepository();

      if (id != null) {
        await repo.DeleteContact(id);
      }

      return Redirect("/Contacts");

    }

    [Authorize]
    public async Task<ActionResult> Create(MyContact contact) {
      if (Request.HttpMethod == "POST") {
        MyContactRepository repo = new MyContactRepository();
        await repo.AddContact(contact);
        return Redirect("/Contacts");
      } else {
        return View(contact);
      }
    }

    [Authorize]
    public async Task<ActionResult> Edit(string Id, MyContact contact) {
      MyContactRepository repo = new MyContactRepository();

      if (Request.HttpMethod == "POST") {
        await repo.UpdateContact(contact);
        return Redirect("/Contacts");
      } else {
        contact = await repo.GetContact(Id);
        return View(contact);
      }
    }

    [Authorize]
    public async Task<ActionResult> AddSampleData() {
      MyContactRepository repo = new MyContactRepository();
      await repo.AddSampleData();
      return Redirect("/Contacts");
    }

    [Authorize]
    public async Task<ActionResult> DeleteAllContacts() {
      MyContactRepository repo = new MyContactRepository();
      await repo.DeleteAllContacts();
      return Redirect("/Contacts");
    }

  }
}