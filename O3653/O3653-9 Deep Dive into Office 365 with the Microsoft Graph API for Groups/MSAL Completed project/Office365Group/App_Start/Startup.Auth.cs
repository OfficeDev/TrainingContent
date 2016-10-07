using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IdentityModel.Claims;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using Office365Group.Models;
using Microsoft.Identity.Client;

namespace Office365Group
{
    public partial class Startup
    {
        private static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        private static string appKey = ConfigurationManager.AppSettings["ida:ClientSecret"];
        private static string aadInstance = ConfigurationManager.AppSettings["ida:AADInstance"];
        private static string postLogoutRedirectUri = ConfigurationManager.AppSettings["ida:PostLogoutRedirectUri"];
        private static string[] scopes = {
            "https://graph.microsoft.com/User.Read.All",
            "https://graph.microsoft.com/Group.Read.All"
        };

        public static readonly string Authority = aadInstance + "common/v2.0";

        public void ConfigureAuth(IAppBuilder app)
        {
            ApplicationDbContext db = new ApplicationDbContext();

            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            app.UseOpenIdConnectAuthentication(
                new OpenIdConnectAuthenticationOptions
                {
                    ClientId = clientId,
                    Authority = Authority,
                    Scope = "openid offline_access profile email " + string.Join(" ", scopes),
                    RedirectUri = postLogoutRedirectUri,
                    PostLogoutRedirectUri = "/",
                    TokenValidationParameters = new System.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = false
                    },
                    Notifications = new OpenIdConnectAuthenticationNotifications()
                    {
                        // If there is a code in the OpenID Connect response, redeem it for an access token and refresh token, and store those away.
                        AuthorizationCodeReceived = async (context) =>
                        {
                            var code = context.Code;
                            string signedInUserID = context.AuthenticationTicket.Identity.FindFirst(ClaimTypes.NameIdentifier).Value;
                            ConfidentialClientApplication cca = new ConfidentialClientApplication(clientId,
                                postLogoutRedirectUri,
                                new ClientCredential(appKey),
                                new MSALTokenCache(signedInUserID));
                            var result = await cca.AcquireTokenByAuthorizationCodeAsync(scopes, code);
                        }
                    }
                });
        }
    }
}
