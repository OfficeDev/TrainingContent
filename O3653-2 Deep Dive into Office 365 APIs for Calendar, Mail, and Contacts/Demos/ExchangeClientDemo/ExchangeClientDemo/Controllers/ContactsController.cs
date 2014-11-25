using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;

using ExchangeClientDemo.Models;

namespace ExchangeClientDemo.Controllers
{
    public class ContactsController : Controller
    {
        public async Task<ActionResult> Index(int? pageNumber) {

            int pageSize = 8;
            int pageIndex = (pageNumber != null) ? (int)pageNumber - 1 : 0;

            ViewBag.pageIndex = pageIndex;
            ViewBag.pageSize = pageSize;

            List<ExchangeClientDemo.Models.MyContact> contacts = null;
            try {
                MyContactsRepository repo = new MyContactsRepository();
                ViewBag.contactCount = await repo.GetContactCount();
                contacts = await repo.GetContacts(pageIndex, pageSize);                
            }
            catch (RedirectRequiredException x) {
                return Redirect(x.RedirectUri.ToString());
            }
            return View(contacts);
        }

        public async Task<ActionResult> Details(string id) {

            ExchangeClientDemo.Models.MyContact contact = null;
            try {
                MyContactsRepository repo = new MyContactsRepository();
                contact = await repo.GetContact(id);
            }
            catch (RedirectRequiredException x) {
                return Redirect(x.RedirectUri.ToString());
            }
            return View(contact);
        }

        public async Task<ActionResult> Delete(string id) {
            MyContactsRepository repo = new MyContactsRepository();

            if (id != null) {
                await repo.DeleteContact(id);
            }

            return Redirect("/Contacts");

        }

        public async Task<ActionResult> Create(ExchangeClientDemo.Models.MyContact contact) {

            if (Request.HttpMethod == "POST") {
                MyContactsRepository repo = new MyContactsRepository();
                await repo.AddContact(contact);
                return Redirect("/Contacts");
            }
            else {
                return View(contact);
            }
        }

        public async Task<ActionResult> Edit(string Id, ExchangeClientDemo.Models.MyContact contact) {

            MyContactsRepository repo = new MyContactsRepository();
             
            if (Request.HttpMethod == "POST") {
                await repo.UpdateContact(contact);
                return Redirect("/Contacts");
            }
            else {
                contact = await repo.GetContact(Id);
                return View(contact);
            }
        }

        public async Task<ActionResult> AddSampleData() {
                MyContactsRepository repo = new MyContactsRepository();
                await repo.AddSampleData();            
                return Redirect("/Contacts");            
        }

        public async Task<ActionResult> DeleteAllContacts() {
                MyContactsRepository repo = new MyContactsRepository();
                await repo.DeleteAllContacts();
                return Redirect("/Contacts");            
        }

        
 
    }
}