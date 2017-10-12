using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;

namespace UserSync.Controllers
{
    public class AccountController : Controller
    {
        private const string adminConsentUrlFormat = "https://login.microsoftonline.com/{0}/adminconsent?client_id={1}&redirect_uri={2}";

        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        public void SignIn()
        {
            HttpContext.GetOwinContext().Authentication.Challenge(new AuthenticationProperties { RedirectUri = "/User" }, OpenIdConnectAuthenticationDefaults.AuthenticationType);
        }

        public ActionResult SignOut()
        {
            HttpContext.GetOwinContext().Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return new RedirectResult("/");
        }

        public ActionResult UserMismatch()
        {
            return View();
        }

        [Authorize]
        public ActionResult GrantPermissions(string admin_consent, string tenant, string error, string error_description)
        {
            // If there was an error getting permissions from the admin. ask for permissions again
            if (error != null)
            {
                ViewBag.ErrorDescription = error_description;
            }
            // If the admin successfully granted permissions, continue to showing the list of users
            else if (admin_consent == "True" && tenant != null)
            {
                return new RedirectResult("/User");
            }

            return View();
        }

        [Authorize]
        public ActionResult RequestPermissions()
        {
            return new RedirectResult(
                String.Format(adminConsentUrlFormat, 
                ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value, 
                Startup.clientId, 
                HttpUtility.UrlEncode(Startup.redirectUri + "Account/GrantPermissions")));
        }
    }
}