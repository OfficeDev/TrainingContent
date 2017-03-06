using AuthFlowDemo.Models;
using AuthFlowDemo.Utils;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace AuthFlowDemo.Controllers
{
    public class AcceptRedirectController : Controller
    {
        // GET: AcceptRedirect
        public async Task<ActionResult> Index()
        {
            var accessToken = await AuthenticationHelper.GetGraphAccessToken();
            ViewBag.AccessToken= accessToken;
            return View();
        }
    }
}