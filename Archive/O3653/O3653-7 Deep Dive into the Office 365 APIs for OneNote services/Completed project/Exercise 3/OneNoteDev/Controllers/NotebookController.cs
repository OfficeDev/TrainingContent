using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Threading.Tasks;
using OneNoteDev.Auth;
using OneNoteDev.Models;
using OneNoteDev.TokenStorage;

namespace OneNoteDev.Controllers
{
    public class NotebookController : Controller
    {
        [Authorize]
        public async Task<ActionResult> Index()
        {
            // Get an access token for the request.
            string userObjId = AuthHelper.GetUserId(System.Security.Claims.ClaimsPrincipal.Current); 
            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, HttpContext);
            string authority = string.Format(ConfigurationManager.AppSettings["ida:AADInstance"], "common", "/v2.0");
            
            AuthHelper authHelper = new AuthHelper(authority, ConfigurationManager.AppSettings["ida:AppId"], ConfigurationManager.AppSettings["ida:AppSecret"], tokenCache);
            string accessToken = await authHelper.GetUserAccessToken("/Notebook/Index");

            // Make the request.
            var repository = new NotebookRepository(accessToken);
            var myNotebooks = await repository.GetNotebooks();

            return View(myNotebooks);
        }


    }
}