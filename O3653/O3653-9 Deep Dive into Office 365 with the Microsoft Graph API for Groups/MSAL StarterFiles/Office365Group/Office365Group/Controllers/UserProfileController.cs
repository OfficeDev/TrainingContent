using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Office365Group.Models;
using Microsoft.Graph;
using System.Net.Http.Headers;

namespace Office365Group.Controllers
{
    [Authorize]
    public class UserProfileController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        private string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        private string appKey = ConfigurationManager.AppSettings["ida:ClientSecret"];
        private string redirectUri = ConfigurationManager.AppSettings["ida:PostLogoutRedirectUri"];
        private string[] scopes = { "https://graph.microsoft.com/User.Read.All" };
        private string graphResourceID = "https://graph.microsoft.com/V1.0";

        // GET: UserProfile
        public async Task<ActionResult> Index()
        {
            try
            {
                var accessToken = await GetTokenForApplication();
                var graphserviceClient = new GraphServiceClient(graphResourceID,
                                          new DelegateAuthenticationProvider(
                                                        (requestMessage) =>
                                                        {
                                                            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                                                            return Task.FromResult(0);
                                                        }));
                var me = await graphserviceClient.Me.Request().GetAsync();
                return View(me);
            }
            catch (MsalException)
            {
                // Return to error page.
                return View("Error");
            }
            // if the above failed, the user needs to explicitly re-authenticate for the app to obtain the required token
            catch (Exception)
            {
                return View("Relogin");
            }
        }

        public void RefreshSession()
        {
            HttpContext.GetOwinContext().Authentication.Challenge(
                new AuthenticationProperties { RedirectUri = "/UserProfile" },
                OpenIdConnectAuthenticationDefaults.AuthenticationType);
        }

        public async Task<string> GetTokenForApplication()
        {
            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            ConfidentialClientApplication cca = new ConfidentialClientApplication(clientId, redirectUri, new ClientCredential(appKey), new MSALTokenCache(signInUserId));
            var result = await cca.AcquireTokenSilentAsync(scopes);
            return result.Token;
        }
    }
}
