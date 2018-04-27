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
    public class PageController : Controller
    {
        [Authorize]
        public async Task<ActionResult> Index(string notebookid, string sectionid)
        {

            // Get an access token for the request.
            string userObjId = AuthHelper.GetUserId(System.Security.Claims.ClaimsPrincipal.Current);
            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, HttpContext);
            string authority = string.Format(ConfigurationManager.AppSettings["ida:AADInstance"], "common", "/v2.0");

            AuthHelper authHelper = new AuthHelper(authority, ConfigurationManager.AppSettings["ida:AppId"], ConfigurationManager.AppSettings["ida:AppSecret"], tokenCache);
            string accessToken = await authHelper.GetUserAccessToken("/Page/Index");

            // Make the request.
            var repository = new NotebookRepository(accessToken);
            var notebook = await repository.GetNotebookPages(notebookid, sectionid);

            ViewBag.CurrentNotebookTitle = notebook.Name;
            ViewBag.CurrentNotebookId = notebook.Id;

            var section = notebook.Sections.First(s => s.Id == sectionid);

            ViewBag.CurrentSectionTitle = section.Name;

            return View(section.Pages);
        }

        [Authorize]
        public async Task<ActionResult> Delete(string id)
        {

            // Get an access token for the request.
            string userObjId = AuthHelper.GetUserId(System.Security.Claims.ClaimsPrincipal.Current);
            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, HttpContext);
            string authority = string.Format(ConfigurationManager.AppSettings["ida:AADInstance"], "common", "/v2.0");

            AuthHelper authHelper = new AuthHelper(authority, ConfigurationManager.AppSettings["ida:AppId"], ConfigurationManager.AppSettings["ida:AppSecret"], tokenCache);
            string accessToken = await authHelper.GetUserAccessToken("/Page/Delete");

            // Make the request.
            var repository = new NotebookRepository(accessToken);
            if (id != null)
            {
                await repository.DeletePage(id);
            }
            return Redirect("/");
        }
    }
}