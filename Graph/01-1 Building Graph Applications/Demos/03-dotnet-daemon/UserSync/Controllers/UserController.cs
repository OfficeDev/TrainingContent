using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Microsoft.Identity.Client;

namespace UserSync.Controllers
{
    public class UserController : Controller
    {
        private const string tenantIdClaimType = "http://schemas.microsoft.com/identity/claims/tenantid";
        private const string authorityFormat = "https://login.microsoftonline.com/{0}/v2.0";
        private const string msGraphScope = "https://graph.microsoft.com/.default";
        private const string msGraphQuery = "https://graph.microsoft.com/v1.0/users";

        // GET: Calendar
        public ActionResult Index()
        {
            // Make sure the user is signed in
            if (!Request.IsAuthenticated)
            {
                return new RedirectResult("/Account/Index");
            }

            // Show the list of users that have been sync'd to the database
            string tenantId = ClaimsPrincipal.Current.FindFirst(tenantIdClaimType).Value;
            ViewBag.TenantId = tenantId;
            ViewBag.Users = SyncController.GetUsersForTenant(tenantId);

            return View();
        }
    }
}