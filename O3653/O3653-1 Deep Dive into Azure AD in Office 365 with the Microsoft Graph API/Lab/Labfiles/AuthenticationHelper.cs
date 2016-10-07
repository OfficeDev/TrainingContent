using Windows.Security.Authentication.Web;
using System;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Windows.Storage;
using System.Diagnostics;

namespace MyFilesWin10
{
    internal static class AuthenticationHelper
    {
        // The ClientID is added as a resource in App.xaml when you register the app with Office 365. 
        // As a convenience, we load that value into a variable called ClientID. This way the variable 
        // will always be in sync with whatever client id is added to App.xaml.
        private static readonly string ClientID = App.Current.Resources["ida:ClientID"].ToString();
        private static Uri _returnUri = WebAuthenticationBroker.GetCurrentApplicationCallbackUri();
        public static string AccessToken = null;


        // Properties used for communicating with your Windows Azure AD tenant.
        // The AuthorizationUri is added as a resource in App.xaml when you regiter the app with 
        // Office 365. As a convenience, we load that value into a variable called _commonAuthority, adding _common to this Url to signify
        // multi-tenancy. This way it will always be in sync with whatever value is added to App.xaml.

        private static readonly string CommonAuthority = App.Current.Resources["ida:AuthorizationUri"].ToString() + @"/Common";
        public const string ResourceBetaUrl = "https://graph.microsoft.com/v1.0/";
        public const string ResourceUrl = "https://graph.microsoft.com/";


        // TODO:s Add your redirect URI value here.
        private static Uri redirectUri = new Uri(" ");

        public static ApplicationDataContainer _settings = ApplicationData.Current.LocalSettings;

        //Property for storing and returning the authority used by the last authentication.
        //This value is populated when the user connects to the service and made null when the user signs out.
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

        //Property for storing the tenant id so that we can pass it to the ActiveDirectoryClient constructor.
        //This value is populated when the user connects to the service and made null when the user signs out.
        static internal string TenantId
        {
            get
            {
                if (_settings.Values.ContainsKey("TenantId") && _settings.Values["TenantId"] != null)
                {
                    return _settings.Values["TenantId"].ToString();
                }
                else {
                    return string.Empty;
                }

            }

            set
            {
                _settings.Values["TenantId"] = value;
            }
        }

        // Property for storing the logged-in user so that we can display user properties later.
        //This value is populated when the user connects to the service.
        static internal string LoggedInUser
        {
            get
            {
                if (_settings.Values.ContainsKey("LoggedInUser") && _settings.Values["LoggedInUser"] != null)
                {
                    return _settings.Values["LoggedInUser"].ToString();
                }
                else {
                    return string.Empty;
                }

            }

            set
            {
                _settings.Values["LoggedInUser"] = value;
            }
        }

        // Property for storing the logged-in user email address so that we can display user properties later.
        //This value is populated when the user connects to the service.
        static internal string LoggedInUserEmail
        {
            get
            {
                if (_settings.Values.ContainsKey("LoggedInUserEmail") && _settings.Values["LoggedInUserEmail"] != null)
                {
                    return _settings.Values["LoggedInUserEmail"].ToString();
                }
                else {
                    return string.Empty;
                }

            }

            set
            {
                _settings.Values["LoggedInUserEmail"] = value;
            }
        }

        //Property for storing the authentication context.
        public static AuthenticationContext _authenticationContext { get; set; }

        /// <summary>
        /// Checks that an OutlookServicesClient object is available. 
        /// </summary>
        /// <returns>The OutlookServicesClient object. </returns>
        public static async Task<string> GetGraphAccessTokenAsync()
        {
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

                // Create an AuthenticationContext using this authority.
                _authenticationContext = new AuthenticationContext(authority);

                // Set the value of _authenticationContext.UseCorporateNetwork to true so that you 
                // can use this app inside a corporate intranet. If the value of UseCorporateNetwork 
                // is true, you also need to add the Enterprise Authentication, Private Networks, and
                // Shared User Certificates capabilities in the Package.appxmanifest file.

                var token = await GetTokenHelperAsync(_authenticationContext, ResourceUrl);

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

            //Clean up all existing clients
            AccessToken = null;
            //Clear stored values from last authentication.
            _settings.Values["TenantId"] = null;
            _settings.Values["LastAuthority"] = null;
            _settings.Values["LoggedInUser"] = null;
            _settings.Values["LoggedInUserEmail"] = null;

        }

        // Get an access token for the given context and resourceId. An attempt is first made to 
        // acquire the token silently. If that fails, then we try to acquire the token by prompting the user.
        private static async Task<string> GetTokenHelperAsync(AuthenticationContext context, string resourceId)
        {
            string accessToken = null;
            AuthenticationResult result = null;
            result = await context.AcquireTokenAsync(resourceId, ClientID, redirectUri, new PlatformParameters(PromptBehavior.Auto, true));
            accessToken = result.AccessToken;

            if (!string.IsNullOrEmpty(accessToken))
            {
                //Store values for logged-in user, tenant id, and authority, so that
                //they can be re-used if the user re-opens the app without disconnecting.
                _settings.Values["LoggedInUser"] = result.UserInfo.GivenName;
                _settings.Values["LoggedInUserEmail"] = result.UserInfo.DisplayableId;
                _settings.Values["TenantId"] = result.TenantId;
                _settings.Values["LastAuthority"] = context.Authority;
            }
            return accessToken;
        }
    }
}
