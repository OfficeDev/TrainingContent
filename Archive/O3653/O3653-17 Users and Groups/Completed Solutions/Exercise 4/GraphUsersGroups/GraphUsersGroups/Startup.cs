using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Globalization;
using System.IdentityModel.Tokens;
using System.Web;
using Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Notifications;
using Microsoft.Owin.Security.OpenIdConnect;
using Microsoft.IdentityModel.Protocols;
using System.Security.Claims;
using GraphUsersGroups.TokenStorage;
using GraphUsersGroups.Auth;

[assembly: OwinStartup(typeof(GraphUsersGroups.Startup))]

namespace GraphUsersGroups
{
    public class Startup
    {
        public static string appId = ConfigurationManager.AppSettings["ida:AppId"];
        public static string appSecret = ConfigurationManager.AppSettings["ida:AppSecret"];
        public static string aadInstance = ConfigurationManager.AppSettings["ida:AADInstance"];

        public static string[] scopes = ConfigurationManager.AppSettings["ida:AppScopes"]
          .Replace(' ', ',').Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

        public void Configuration(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            app.UseOpenIdConnectAuthentication(
              new OpenIdConnectAuthenticationOptions
              {
                  // The `Authority` represents the v2.0 endpoint - https://login.microsoftonline.com/common/v2.0
                  // The `Scope` describes the permissions that your app will need.  
                  // See https://azure.microsoft.com/documentation/articles/active-directory-v2-scopes/
                  // The 'ResponseType' indicates that we want an authorization code and an ID token 
                  // In a real application you could use issuer validation for additional checks, like making 
                  // sure the user's organization has signed up for your app, for instance.

                  ClientId = appId,
                  Authority = string.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0"),
                  Scope = "openid offline_access profile " + string.Join(" ", scopes),
                  ResponseType = "code id_token",
                  RedirectUri = ConfigurationManager.AppSettings["ida:PostLogoutRedirectUri"],
                  PostLogoutRedirectUri = "/",
                  TokenValidationParameters = new TokenValidationParameters
                  {
                      // For demo purposes only, see below
                      ValidateIssuer = false

                      // In a real multitenant app, you would add logic to determine whether the
                      // issuer was from an authorized tenant
                      //ValidateIssuer = true,
                      //IssuerValidator = (issuer, token, tvp) =>
                      //{
                      //  if (MyCustomTenantValidation(issuer))
                      //  {
                      //    return issuer;
                      //  }
                      //  else
                      //  {
                      //    throw new SecurityTokenInvalidIssuerException("Invalid issuer");
                      //  }
                      //}
                  },
                  Notifications = new OpenIdConnectAuthenticationNotifications
                  {
                      AuthenticationFailed = OnAuthenticationFailed,
                      AuthorizationCodeReceived = OnAuthorizationCodeReceived
                  }
              }
            );
        }

        private Task OnAuthenticationFailed(AuthenticationFailedNotification<OpenIdConnectMessage,
          OpenIdConnectAuthenticationOptions> notification)
        {
            notification.HandleResponse();
            notification.Response.Redirect("/Error?message=" + notification.Exception.Message);
            return Task.FromResult(0);
        }

        private async Task OnAuthorizationCodeReceived(AuthorizationCodeReceivedNotification notification)
        {
            // Get the user's object id (used to name the token cache)
            // Get the user's object id (used to name the token cache)
            ClaimsPrincipal principal = new ClaimsPrincipal(notification.AuthenticationTicket.Identity);
            string userObjId = AuthHelper.GetUserId(principal);

            // Create a token cache
            HttpContextBase httpContext = notification.OwinContext.Get<HttpContextBase>(typeof(HttpContextBase).FullName);
            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, httpContext);

            // Exchange the auth code for a token
            AuthHelper authHelper = new AuthHelper(
              string.Format(CultureInfo.InvariantCulture, aadInstance, "common", ""),
              appId, appSecret, tokenCache);

            var response = await authHelper.GetTokensFromAuthority("authorization_code", notification.Code,
              notification.Request.Uri.ToString());
        }
    }
}
