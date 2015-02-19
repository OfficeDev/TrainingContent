using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using OutlookServicesClientDemo.Utils;
using Owin;
using System.Configuration;
using System.Threading.Tasks;

namespace OutlookServicesClientDemo {
  public partial class Startup {
    public void ConfigureAuth(IAppBuilder app) {
      // configure the authentication type & settings
      app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
      app.UseCookieAuthentication(new CookieAuthenticationOptions());

      // configure the OWIN OpenId Connect options
      app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions {
        ClientId = SettingsHelper.ClientId,
        Authority = SettingsHelper.AzureADAuthority,
        Notifications = new OpenIdConnectAuthenticationNotifications() {
          // when an auth code is received...
          AuthorizationCodeReceived = (context) => {
            // get the OpenID Connect code passed from Azure AD on successful auth
            string code = context.Code;

            // create the app credentials & get reference to the user
            ClientCredential creds = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
            string userObjectId = context.AuthenticationTicket.Identity.FindFirst(System.IdentityModel.Claims.ClaimTypes.NameIdentifier).Value;

            // use the OpenID Connect code to obtain access token & refresh token...
            //  save those in a persistent store...
            EFADALTokenCache sampleCache = new EFADALTokenCache(userObjectId);
            AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, sampleCache);

            // obtain access token for the AzureAD graph
            Uri redirectUri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));
            AuthenticationResult authResult = authContext.AcquireTokenByAuthorizationCode(code, redirectUri, creds, SettingsHelper.AzureAdGraphResourceId);

            // successful auth
            return Task.FromResult(0);
          },
          AuthenticationFailed = (context) => {
            context.HandleResponse();
            return Task.FromResult(0);
          }
        },
        TokenValidationParameters = new System.IdentityModel.Tokens.TokenValidationParameters {
          ValidateIssuer = false
        }
      });
    }

  }
}