using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Web;
using Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Protocols;
using Microsoft.Owin.Security.Notifications;
using System.Threading.Tasks;
using System.Security.Claims;
using OfficeGraphLab.Auth;
using OfficeGraphLab.TokenStorage;

namespace OfficeGraphLab
{
    public partial class Startup
    {
        public static string appId = ConfigurationManager.AppSettings["ida:AppId"];
        public static string appSecret = ConfigurationManager.AppSettings["ida:AppSecret"];
        private static string aadInstance = ConfigurationManager.AppSettings["ida:AADInstance"];
        private static string postLogoutRedirectUri = ConfigurationManager.AppSettings["ida:PostLogoutRedirectUri"];
        private static string authority = aadInstance + "common";
        private static string scopes = ConfigurationManager.AppSettings["ida:AppScopes"];

        public void ConfigureAuth(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            app.UseOpenIdConnectAuthentication(
                new OpenIdConnectAuthenticationOptions
                {
                    ClientId = appId,
                    Authority = authority + "/v2.0",
                    Scope = "openid offline_access profile " + scopes,
                    RedirectUri = postLogoutRedirectUri,
                    PostLogoutRedirectUri = postLogoutRedirectUri,
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
                        AuthorizationCodeReceived = async (notification) =>
                        {
                            // Get the user's object id (used to name the token cache)
                            ClaimsPrincipal principal = new ClaimsPrincipal(notification.AuthenticationTicket.Identity);
                            string userObjId = AuthHelper.GetUserId(principal);

                            // Create a token cache
                            HttpContextBase httpContext = notification.OwinContext.Get<HttpContextBase>(typeof(HttpContextBase).FullName);
                            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, httpContext);

                            // Exchange the auth code for a token
                            AuthHelper authHelper = new AuthHelper(authority, appId, appSecret, tokenCache);

                            var response = await authHelper.GetTokensFromAuthority("authorization_code", notification.Code,
                              notification.Request.Uri.ToString());
                        }
                    }
                });
        }
    }
}
