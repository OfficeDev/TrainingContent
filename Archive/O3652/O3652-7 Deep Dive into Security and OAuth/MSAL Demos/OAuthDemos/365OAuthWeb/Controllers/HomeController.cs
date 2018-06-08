using System;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Graph;

namespace _365OAuthWeb.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
            var authCode = HttpContext.Request.Form["code"];
            var webUrl = string.Format("{0}/", Request.Url.GetLeftPart(UriPartial.Authority));
            if (!String.IsNullOrEmpty(authCode))
            {
                IEnumerable<Contact> contacts = await ContactsAPISample.GetContacts(webUrl, authCode);
                ViewBag.Contacts = contacts;
            }
            else
            {
                var adAuthority = "https://login.microsoftonline.com";
                var scope = "Contacts.Read openid email profile offline_access";
                var clientId = ConfigurationManager.AppSettings["ida:ClientID"];

                string authorizationRequest = String.Format(
                    "{0}/common/oauth2/v2.0/authorize?response_type=code&response_mode=form_post&client_id={1}&redirect_uri={2}&scope={3}&state={4}",
                    adAuthority,
                    Uri.EscapeDataString(clientId),
                    Uri.EscapeDataString(webUrl),
                    scope,
                    Uri.EscapeDataString(Guid.NewGuid().ToString())
                    );

                return Redirect(authorizationRequest);
            }
            return View();
        }
    }
}