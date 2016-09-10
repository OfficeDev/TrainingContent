using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using Microsoft.Graph;
using Microsoft.Office365.OAuth;

namespace _365OAuthWeb.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
            try
            {
                IEnumerable<Contact> contacts = await ContactsAPISample.GetContacts();
                ViewBag.Contacts = contacts;
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }
            return View();
        }

 
    }
}