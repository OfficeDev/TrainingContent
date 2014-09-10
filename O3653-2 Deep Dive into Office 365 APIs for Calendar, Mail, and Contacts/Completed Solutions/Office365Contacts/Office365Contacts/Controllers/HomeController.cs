using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Microsoft.Office365.OAuth;
using System.Threading.Tasks;
using Office365Contacts.Models;

namespace Office365Contacts.Controllers {
    public class HomeController : Controller {
        public async Task<ActionResult> Index(int? pageNumber) {

            int pageSize = 8;
            int pageIndex = (pageNumber != null) ? (int)pageNumber - 1 : 0;

            ViewBag.pageIndex = pageIndex;
            ViewBag.pageSize = pageSize;

            List<MyContact> contacts = null;
            try {
                MyContactsRepository repository = new MyContactsRepository();
                ViewBag.contactCount = await repository.GetContactCount();
                contacts = await repository.GetContacts(pageIndex, pageSize);
            }
            catch (RedirectRequiredException x) {
                return Redirect(x.RedirectUri.ToString());
            }
            return View(contacts);
        }

        public async Task<ActionResult> Delete(string id) {
            MyContactsRepository repository = new MyContactsRepository();
            if (id != null) {
                await repository.DeleteContact(id);
            }
            return Redirect("/");
        }

        public async Task<ActionResult> Create(MyContact myContact) {
            if (Request.HttpMethod == "POST") {
                MyContactsRepository repository = new MyContactsRepository();
                await repository.AddContact(myContact);
                return Redirect("/");
            }
            else {
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