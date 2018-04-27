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
    public class SectionController : Controller
    {
        [Authorize]
        public async Task<ActionResult> Index(string notebookid)
        {
            // Get an access token for the request.
            string userObjId = AuthHelper.GetUserId(System.Security.Claims.ClaimsPrincipal.Current);
            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, HttpContext);
            string authority = string.Format(ConfigurationManager.AppSettings["ida:AADInstance"], "common", "/v2.0");

            AuthHelper authHelper = new AuthHelper(authority, ConfigurationManager.AppSettings["ida:AppId"], ConfigurationManager.AppSettings["ida:AppSecret"], tokenCache);
            string accessToken = await authHelper.GetUserAccessToken("/Section/Index");

            // Make the request.
            var repository = new NotebookRepository(accessToken);
            var notebook = await repository.GetNotebookSections(notebookid);

            ViewBag.CurrentNotebookTitle = notebook.Name; ViewBag.CurrentNotebookId = notebook.Id;

            return View(notebook.Sections.OrderBy(s => s.Name).ToList());
        }
    }
}