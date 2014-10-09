//----------------------------------------------------------------------------------------------
//    Copyright 2014 Microsoft Corporation
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//----------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

// The following using statements were added for this sample.
using System.Globalization;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Configuration;

namespace WebApp.Controllers
{
    public class OAuthController : Controller
    {
        //
        // The Client ID is used by the application to uniquely identify itself to Azure AD.
        // The App Key is a credential used to authenticate the application to Azure AD.  Azure AD supports password and certificate credentials.
        // The Metadata Address is used by the application to retrieve the signing keys used by Azure AD.
        // The AAD Instance is the instance of Azure, for example public Azure or Azure China.
        // The Authority is the sign-in URL of the tenant.
        // The Post Logout Redirect Uri is the URL where the user will be redirected after they sign out.
        //
        private static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        private static string appKey = ConfigurationManager.AppSettings["ida:AppKey"];
        private static string aadInstance = ConfigurationManager.AppSettings["ida:AADInstance"];
        private static string tenant = ConfigurationManager.AppSettings["ida:Tenant"];
        
        string authority = String.Format(CultureInfo.InvariantCulture, aadInstance, tenant);

        private static readonly string authorizeUrl = string.Format(
            CultureInfo.InvariantCulture,
            aadInstance,
            "common/oauth2/authorize?response_type=code&client_id={0}&resource={1}&redirect_uri={2}&state={3}");

        //
        // This method will be invoked as a call-back from an authentication service (e.g., https://login.windows.net/).
        // It is not intended to be called directly, or to be called without first invoking the "GetAuthorizationUrl" method.
        // On completion, the method will cache the refresh token and access tokens, and redirect to the URL
        //     specified in the state cookie (created by the "GetAuthorizationUrl" method, with its unique ID 
        //     included in the "state" of this method).
        //
        public ActionResult Index(string code, string error, string error_description, string resource, string state)
        {
            //
            // NOTE: In production, OAuth must be done over a secure HTTPS connection.
            //
            if (Request.Url.Scheme != "https" && !Request.Url.IsLoopback)
            {
                return View("Error");
            }

            //
            // Ensure there is a state value on the response.  If there is none, stop OAuth processing and display an error.
            //
            if (state == null)
            {
                return View("Error");
            }

            //
            // Ensure the saved state value matches the value from the response.  If it does not, stop OAuth processing and display an error.
            //
            if (!FindOAuthStateInCache(state))
            {
                RemoveOAuthStateFromCache(state);
                return View("Error");
            }

            RemoveOAuthStateFromCache(state);

            //
            // Handle errors from the OAuth response, if any.  If there are errors, stop OAuth processing and display an error.
            //
            if (error != null)
            {
                return View("Error");
            }

            //
            // Redeem the authorization code from the response for an access token and refresh token.
            //
            try
            {
                ClientCredential credential = new ClientCredential(clientId, appKey);
                string authority = string.Format(CultureInfo.InvariantCulture, aadInstance, "common");
                AuthenticationContext authContext = new AuthenticationContext(authority);
                AuthenticationResult result = authContext.AcquireTokenByAuthorizationCode(
                    code, new Uri(Request.Url.GetLeftPart(UriPartial.Path)), credential);

                // Cache the access token and refresh token
                SaveAccessTokenInCache(resource, result.AccessToken, (result.ExpiresOn.AddMinutes(-5)).ToString());
                SaveRefreshTokenInCache(result.RefreshToken);

                // Also save the Tenant ID for later use when calling the Graph API.
                SaveInCache("TenantId", result.TenantId);

                // Return to the originating page where the user triggered the sign-in
                Uri redirectTo = (Uri)GetFromCache("RedirectTo");
                // BUGBUG Removing the RedirectTo will cause multiple outstanding requests to fail.  It would be better if this was carried on the request URL somehow.
                // RemoveFromCache("RedirectTo");
                return Redirect(redirectTo.ToString());
            }
            catch
            {
                return View("Error");
            }

        }

        #region HelperFunctions

        public static string GetAuthorizationUrl(string resourceId, HttpRequestBase request)
        {

            // To prevent Cross-Site Request Forgery attacks (http://tools.ietf.org/html/rfc6749 section 4.2.1),
            //     it is important to send a randomly-generated value as a state parameter.
            // This state parameter is saved in a cookie, so it can later be compared with the state
            //     parameter that we receive from the Authorization Server along with the Authorization Code.
            // The state cookie will also capture information about the resource ID and redirect-to URL,
            //     for use in the Index method (after the login page redirects back to this controller).
            string stateValue = Guid.NewGuid().ToString();

            AddOAuthStateToCache(stateValue);

            // Determine the path of the application, then append the path of the OAuthController.
            string redirectUri = request.Url.GetLeftPart(UriPartial.Authority).ToString() + "/OAuth";

            // Construct the authorization request URL.
            return String.Format(CultureInfo.InvariantCulture,
                authorizeUrl,
                Uri.EscapeDataString(clientId),
                Uri.EscapeDataString(resourceId),
                Uri.EscapeDataString(redirectUri),
                Uri.EscapeDataString(stateValue));
        }

        public static string GetAccessTokenFromCacheOrRefreshToken(string tenantId, string resourceId)
        {
            //
            // First try to get an access token for this resource from the cookie-based cache.
            // If there is no AT in the cache for this resource, see if there is a refresh token in the cache that can be used to get a new access token.
            // If all fails, return null signalling the caller to do the OAuth redirect.
            //
            string accessToken = (string)GetAccessTokenFromCache(resourceId);

            if (accessToken != null) return accessToken;

            accessToken = GetAccessTokenFromRefreshToken(tenantId, resourceId);

            if (accessToken != null) return accessToken;

            return null;
        }

        public static string GetAccessTokenFromRefreshToken(string tenantId, string resourceId)
        {
            //
            // Try to get a new access token for this resource using a refresh token.
            // If this fails, return null signalling the caller to do the OAuth redirect.
            //
            AuthenticationResult result = null;
            string refreshToken = null;

            //
            // Fetch the refresh token from the cache
            //
            refreshToken = (string)GetRefreshTokenFromCache();
            if (refreshToken == null)
            {
                //
                // No refresh token - the caller will need to send the user to get an auth code.  Return null.
                //
                return null;
            }

            try
            {
                //
                // Redeem the refresh token for an access token
                //
                ClientCredential clientcred = new ClientCredential(clientId, appKey);
                string authority = string.Format(aadInstance, tenantId);
                AuthenticationContext authcontext = new AuthenticationContext(authority);
                result = authcontext.AcquireTokenByRefreshToken(refreshToken, clientId, clientcred, resourceId);

                //
                // Save the authorization header for this resource and the refresh token in separate cookies
                //
                SaveAccessTokenInCache(resourceId, result.AccessToken, (result.ExpiresOn.AddMinutes(-5)).ToString());
                SaveRefreshTokenInCache(result.RefreshToken);

                return result.AccessToken;
            }
            catch 
            {
                //
                // If the refresh token is also expired, remove it from the cache, and send the user off to do a new OAuth auth code request
                //
                RemoveRefreshTokenFromCache();

                return null;
            }

        }

        //
        // This sample uses ASP.Net session state to cache access tokens and refresh tokens for the user.
        // You can also cache these tokens in a database, keyed to the user's identity.
        // If cached in a database, the tokens can be stored across user sessions, and can be used when the user isn't present.
        //
        private const string CachePrefix = "WindowsAzureAdCache#";

        public static void SaveAccessTokenInCache(string resourceId, object value, object expiration)
        {
            System.Web.HttpContext.Current.Session[CachePrefix + "AccessToken#" + resourceId] = value;
            System.Web.HttpContext.Current.Session[CachePrefix + "AccessTokenExpiration#" + resourceId] = expiration;
        }

        public static object GetAccessTokenFromCache(string resourceId)
        {
            string accessToken = (string)System.Web.HttpContext.Current.Session[CachePrefix + "AccessToken#" + resourceId];

            if (accessToken != null)
            {
                string expiration = (string)System.Web.HttpContext.Current.Session[CachePrefix + "AccessTokenExpiration#" + resourceId];
                DateTime expirationTime = Convert.ToDateTime(expiration);

                if (expirationTime < DateTime.Now)
                {
                    RemoveAccessTokenFromCache(resourceId);
                    accessToken = null;
                }

            }

            return accessToken;
        }

        public static void RemoveAccessTokenFromCache(string resourceId)
        {
            System.Web.HttpContext.Current.Session.Remove(CachePrefix + "AccessToken#" + resourceId);
            System.Web.HttpContext.Current.Session.Remove(CachePrefix + "AccessTokenExpiration#" + resourceId);
        }

        public static void SaveRefreshTokenInCache(object value)
        {
            System.Web.HttpContext.Current.Session[CachePrefix + "RefreshToken"] = value;
        }

        public static object GetRefreshTokenFromCache()
        {
            return System.Web.HttpContext.Current.Session[CachePrefix + "RefreshToken"];
        }

        public static void RemoveRefreshTokenFromCache()
        {
            System.Web.HttpContext.Current.Session.Remove(CachePrefix + "RefreshToken");
        }

        public static void AddOAuthStateToCache(object value)
        {
            DateTime currentTime = DateTime.Now;
            string expiration = currentTime.AddMinutes(10).ToString();
            string currentTimeString = currentTime.ToString();

            System.Web.HttpContext.Current.Session[CachePrefix + "OAuthState#" + currentTimeString] = value;
            System.Web.HttpContext.Current.Session[CachePrefix + "OAuthStateExpiration#" + currentTimeString] = expiration;
        }

        public static bool FindOAuthStateInCache(string state)
        {
            //
            // First, remove any old outstanding state values that have expired.
            //
            foreach (object sessionObject in System.Web.HttpContext.Current.Session)
            {
                string sessionName = (string)sessionObject;
                if (sessionName.StartsWith(CachePrefix + "OAuthStateExpiration#"))
                {
                    DateTime expiration = Convert.ToDateTime(System.Web.HttpContext.Current.Session[sessionName]);
                    if (expiration < DateTime.Now)
                    {
                        // First, find the timestamp value in the session name.
                        int index = sessionName.LastIndexOf("#");
                        string timeStamp = sessionName.Substring(index + 1);

                        // Then, remove the corresponding OAuthState and Expiration values.
                        System.Web.HttpContext.Current.Session.Remove(CachePrefix + "OAuthState#" + timeStamp);
                        System.Web.HttpContext.Current.Session.Remove(CachePrefix + "OAuthStateExpiration#" + timeStamp);
                    }
                }
            }

            //
            // Finally, look for a corresponding state value, and if found, return true.
            //
            foreach (object sessionObject in System.Web.HttpContext.Current.Session)
            {
                string sessionName = (string)sessionObject;
                if (sessionName.StartsWith(CachePrefix + "OAuthState#"))
                {
                    if ((string)System.Web.HttpContext.Current.Session[sessionName] == state) return true;
                }
            }

            return false;
        }

        public static void RemoveOAuthStateFromCache(string state)
        {
            foreach (object sessionObject in System.Web.HttpContext.Current.Session)
            {
                string sessionName = (string)sessionObject;
                if (sessionName.StartsWith(CachePrefix + "OAuthState#"))
                {
                    if ((string)System.Web.HttpContext.Current.Session[sessionName] == state)
                    {
                        // Find the timestamp value in the session name.
                        int index = sessionName.LastIndexOf("#");
                        string timeStamp = sessionName.Substring(index + 1);
                        System.Web.HttpContext.Current.Session.Remove(CachePrefix + "OAuthState#" + timeStamp);
                        System.Web.HttpContext.Current.Session.Remove(CachePrefix + "OAuthStateExpiration#" + timeStamp);
                        return;
                    }
                }
            }
        }

        public static void SaveInCache(string name, object value)
        {
            System.Web.HttpContext.Current.Session[CachePrefix + name] = value;
        }

        public static object GetFromCache(string name)
        {
            return System.Web.HttpContext.Current.Session[CachePrefix + name];
        }

        public static void RemoveFromCache(string name)
        {
            System.Web.HttpContext.Current.Session.Remove(CachePrefix + name);
        }

        public static void RemoveAllFromCache()
        {
            List<string> keysToRemove = new List<string>();
            foreach (object session in System.Web.HttpContext.Current.Session)
            {
                string sessionName = (string)session;
                if (sessionName.StartsWith(CachePrefix, StringComparison.Ordinal))
                {
                    keysToRemove.Add(sessionName);
                }
            }

            foreach (string key in keysToRemove)
            {
                System.Web.HttpContext.Current.Session.Remove(key);
            }
        }

        #endregion
    }
}
