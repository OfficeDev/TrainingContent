using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using ClientCredsAddin.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
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
                "{0}oauth2/authorize?response_type=code+id_token&response_mode=form_post&prompt=admin_consent&client_id={1}&resource={2}&redirect_uri={3}&nonce={4}",
                    SettingsHelper.AzureADAuthority,
                    Uri.EscapeDataString(SettingsHelper.ClientId),
                    Uri.EscapeDataString("https://graph.windows.net/"),
                    Uri.EscapeDataString(String.Format("{0}/Account/Auth", this.Request.Url.GetLeftPart(UriPartial.Authority))),
                    Uri.EscapeDataString(Guid.NewGuid().ToString())
                    );

            return new RedirectResult(authorizationRequest);
        }

        public async Task<ActionResult> Auth()
        {
            var authHelper = new AuthHelper();
            var appState = new AppState();

            // get id token from successful AzureAD auth
            var openIdToken = AuthHelper.OpenIdToken(Request.Form["id_token"]);
            appState.TenantId = openIdToken.TenantId;
            appState.TenantDomain = openIdToken.Domain;
            appState.LoggedOnUser = openIdToken.UserPrincipalName;

            // set app as authoirzed
            appState.AppIsAuthorized = true;

            // obtain access token for graph client
            var appOnlyGraphToken = await authHelper.GetAppOnlyAccessToken(SettingsHelper.GraphResourceId);
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