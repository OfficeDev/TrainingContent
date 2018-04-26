using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using ClientCredsAddin.Models;
using ClientCredsAddin.Utils;

namespace ClientCredsAddin.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AdminConsentApp()
        {
            string authorizationRequest = String.Format(
                "{0}adminconsent?client_id={1}&redirect_uri={2}&state={3}",
                    SettingsHelper.AzureADAuthority,
                    Uri.EscapeDataString(SettingsHelper.ClientId),
                    Uri.EscapeDataString(String.Format("{0}/Account/Auth", this.Request.Url.GetLeftPart(UriPartial.Authority))),
                    Uri.EscapeDataString(Guid.NewGuid().ToString())
                    );

            return new RedirectResult(authorizationRequest);
        }

        public async Task<ActionResult> Auth()
        {
            var authHelper = new AuthHelper();
            var appState = new AppState();

            // set app as authoirzed
            appState.AppIsAuthorized = true;

            // obtain access token for graph client
            var appOnlyGraphToken = await authHelper.GetAppOnlyAccessToken();
            appState.AppOnlyGraphToken = appOnlyGraphToken;

            // TODO LATER: get all users in the directory
            var graphRepo = new GraphRepository();
            var users = await graphRepo.GetUsers(appOnlyGraphToken);
            appState.MailboxList = users;

            Session["ClientCredsAddinAppState"] = appState;

            return new RedirectResult("/Mail");
        }
    }
}