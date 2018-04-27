using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Security.AccessControl;
using System.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using System.Configuration;
using System.Threading.Tasks;
using FileHandler.Utils;

namespace FileHandler {
  public partial class Startup {
    public void ConfigureAuth(IAppBuilder app) {
      app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
      app.UseCookieAuthentication(new CookieAuthenticationOptions());

      app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions {
        ClientId = SettingsHelper.ClientId,
        Authority = SettingsHelper.AzureADAuthority,
        Notifications = new OpenIdConnectAuthenticationNotifications() {
          AuthorizationCodeReceived = (context) => {
            string code = context.Code;

            ClientCredential creds = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
            string userObjectId = context.AuthenticationTicket.Identity.FindFirst(System.IdentityModel.Claims.ClaimTypes.NameIdentifier).Value;

            EFADALTokenCache cache = new EFADALTokenCache(userObjectId);
            AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, cache);

            Uri redirectUri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));
            AuthenticationResult authResult = authContext.AcquireTokenByAuthorizationCode(code, redirectUri, creds, SettingsHelper.AzureAdGraphResourceId);

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