using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using System.Configuration;
using System.Threading.Tasks;

namespace OutlookServicesClientDemo {
  public partial class Startup {
    private static string CLIENT_ID = ConfigurationManager.AppSettings["ida:ClientID"];
    private static string CLIENT_SECRET = ConfigurationManager.AppSettings["ida:Password"];
    private static string TENANT_ID = ConfigurationManager.AppSettings["tenantId"];
    private static string GRAPH_RESOURCE_ID = "https://graph.windows.net";
    public void ConfigureAuth(IAppBuilder app) {
      // create the authority for user login by concatenating the 
      //  URI added by O365 API tools in web.config 
      //  & user's tenant ID provided in the claims when the logged in
      var tenantAuthority = string.Format("{0}/{1}",
        ConfigurationManager.AppSettings["ida:AuthorizationUri"],
        TENANT_ID);

      app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
      app.UseCookieAuthentication(new CookieAuthenticationOptions());


      app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions {
        ClientId = CLIENT_ID,
        Authority = tenantAuthority,
        Notifications = new OpenIdConnectAuthenticationNotifications() {
          // when an auth code is received...
          AuthorizationCodeReceived = (context) => {
            // get the OpenID Connect code passed from Azure AD on successful auth
            string code = context.Code;

            // create the app credentials & get reference to the user
            ClientCredential creds = new ClientCredential(CLIENT_ID, CLIENT_SECRET);
            string userObjectId = context.AuthenticationTicket.Identity.FindFirst(System.IdentityModel.Claims.ClaimTypes.NameIdentifier).Value;

            // use the OpenID Connect code to obtain access token & refresh token...
            //  save those in a persistent store... for now, use the simplistic NaiveSessionCache
            //  NOTE: read up on the links in the NaieveSessionCache... should not be used in production
            Utils.NaiveSessionCache sampleCache = new Utils.NaiveSessionCache(userObjectId);
            AuthenticationContext authContext = new AuthenticationContext(tenantAuthority, sampleCache);

            // obtain access token for the AzureAD graph
            Uri redirectUri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));
            AuthenticationResult authResult = authContext.AcquireTokenByAuthorizationCode(
              code, redirectUri, creds, GRAPH_RESOURCE_ID);

            // successful auth
            return Task.FromResult(0);
          }

        }
      });

    }
  }
}