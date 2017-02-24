using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Windows.Storage;

namespace WinOffice365Calendar
{
    internal static class AuthenticationHelper
    {
        // The ClientID is added as a resource in App.xaml when you register the app with Office 365. 
        // As a convenience, we load that value into a variable called ClientID. This way the variable 
        // will always be in sync with whatever client id is added to App.xaml.
        private static readonly string ClientID = App.Current.Resources["ida:ClientID"].ToString();
        public static string AccessToken = null;


        // Properties used for communicating with your Windows Azure AD tenant.
        // The AuthorizationUri is added as a resource in App.xaml when you regiter the app with 
        // Office 365. As a convenience, we load that value into a variable called _commonAuthority, adding _common to this Url to signify
        // multi-tenancy. This way it will always be in sync with whatever value is added to App.xaml.
        private static readonly string CommonAuthority = App.Current.Resources["ida:AuthorizationUri"].ToString() + @"/Common";
        public const string ResourceUrl = "https://graph.microsoft.com/";


        // TODO: Add your redirect URI value here.
        private static Uri redirectUri = new Uri(" ");

        
        //Property for storing the authentication context.
        public static AuthenticationContext _authenticationContext { get; set; }
        public static ApplicationDataContainer _settings = ApplicationData.Current.LocalSettings;

        public static string LastAccessToken
        {
            get
            {
                return AccessToken;
            }
        }
        private static string LastAuthority
        {
            get
            {
                if (_settings.Values.ContainsKey("LastAuthority") && _settings.Values["LastAuthority"] != null)
                {
                    return _settings.Values["LastAuthority"].ToString();
                }
                else {
                    return string.Empty;
                }

            }

            set
            {
                _settings.Values["LastAuthority"] = value;
            }
        }

        /// <summary>
        /// Checks that an OutlookServicesClient object is available. 
        /// </summary>
        /// <returns>The OutlookServicesClient object. </returns>
        public static async Task<string> GetGraphAccessTokenAsync()
        {
            AccessToken = null;

            try
            {
                //First, look for the authority used during the last authentication.
                //If that value is not populated, use CommonAuthority.
                string authority = null;
                if (String.IsNullOrEmpty(LastAuthority))
                {
                    authority = CommonAuthority;
                }
                else
                {
                    authority = LastAuthority;
                }

                _authenticationContext = new AuthenticationContext(authority, new TokenCache());

                var token = await GetTokenHelperAsync(_authenticationContext, ResourceUrl);

                AccessToken = token;
                return token;
            }
            // The following is a list of all exceptions you should consider handling in your app.
            // In the case of this sample, the exceptions are handled by returning null upstream. 
            catch (ArgumentException ae)
            {
                // Argument exception
                Debug.WriteLine("Exception: " + ae.Message);
                _authenticationContext.TokenCache.Clear();
                return null;
            }
            catch (Exception e)
            {
                Debug.WriteLine("Exception: " + e.Message);
                _authenticationContext.TokenCache.Clear();
                return null;
            }
        }

        /// <summary>
        /// Signs the user out of the service.
        /// </summary>
        public static void SignOut()
        {
            _authenticationContext.TokenCache.Clear();
            _settings.Values["LastAuthority"] = null;
            AccessToken = null;
        }

        // Get an access token for the given context and resourceId. An attempt is first made to 
        // acquire the token silently. If that fails, then we try to acquire the token by prompting the user.
        private static async Task<string> GetTokenHelperAsync(AuthenticationContext context, string resourceId)
        {
            AuthenticationResult result = null;

            result = await context.AcquireTokenAsync(resourceId, ClientID, redirectUri,
                new PlatformParameters(PromptBehavior.Auto, true));

            _settings.Values["LastAuthority"] = context.Authority;
            return result.AccessToken;
        }
    }
}
