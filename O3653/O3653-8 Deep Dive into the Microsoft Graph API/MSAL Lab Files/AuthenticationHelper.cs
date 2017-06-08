// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
using Microsoft.Identity.Client;
using System;
using System.Diagnostics;
using System.Net.Http;
using System.Linq;
using System.Threading.Tasks;
using Windows.Security.Authentication.Web;
using Windows.Storage;
using Microsoft.Graph;
using System.Net.Http.Headers;

namespace O365_Win_Profile
{
    internal static class AuthenticationHelper
    {
        // The ClientID is added as a resource in App.xaml when you register the app with Office 365. 
        // As a convenience, we load that value into a variable called ClientID. This way the variable 
        // will always be in sync with whatever client id is added to App.xaml.
        private static readonly string ClientID = App.Current.Resources["ida:ClientID"].ToString();
        public static string AccessToken = null;


        public const string EndpointUrl = "https://graph.microsoft.com/v1.0/";

        // The scope parameter is required in your authorization URL. 
        // Please view this page to locate the desired scopes required by your application: http://graph.microsoft.io/docs/authorization/converged_auth
        public static string[] Scopes = {
            "https://graph.microsoft.com/User.Read.All"
        };

        public static ApplicationDataContainer _settings = ApplicationData.Current.LocalSettings;

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
                else
                {
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
                else
                {
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
                else
                {
                    return string.Empty;
                }

            }

            set
            {
                _settings.Values["LoggedInUserEmail"] = value;
            }
        }

        //Property for storing the public client application.
        public static PublicClientApplication _publicClientApplication { get; set; }

        /// <summary>
        /// Checks that an OutlookServicesClient object is available. 
        /// </summary>
        /// <returns>The OutlookServicesClient object. </returns>
        public static async Task<GraphServiceClient> GetGraphServiceAsync(string url)
        {
            return null;
        }
        /// <summary>
        /// Checks that an OutlookServicesClient object is available. 
        /// </summary>
        /// <returns>The OutlookServicesClient object. </returns>
        public static async Task<string> GetGraphAccessTokenAsync()
        {
            try
            {
                // Create an PublicClientApplication using the client ID.
                _publicClientApplication = new PublicClientApplication(ClientID);
                var token = await GetTokenHelperAsync();

                return token;
            }
            // The following is a list of all exceptions you should consider handling in your app.
            // In the case of this sample, the exceptions are handled by returning null upstream. 
            catch (ArgumentException ae)
            {
                // Argument exception
                Debug.WriteLine("Exception: " + ae.Message);
                _publicClientApplication.UserTokenCache.Clear(ClientID);
                return null;
            }
            catch (Exception e)
            {
                Debug.WriteLine("Exception: " + e.Message);
                _publicClientApplication.UserTokenCache.Clear(ClientID);
                return null;
            }
        }

        /// <summary>
        /// Signs the user out of the service.
        /// </summary>
        public static void SignOut()
        {
            _publicClientApplication.UserTokenCache.Clear(ClientID);

            //Clean up all existing clients
            AccessToken = null;
            //Clear stored values from last authentication.
            LoggedInUser = null;
            LoggedInUserEmail = null;
            TenantId = null;
        }

        // Get an access token for the given context and resourceId. An attempt is first made to 
        // acquire the token silently. If that fails, then we try to acquire the token by prompting the user.
        private static async Task<string> GetTokenHelperAsync()
        {
            string accessToken = null;
            AuthenticationResult result = null;

            try
            {
                // If the value of LoggedInUserEmail is empty or null, you need to acquire a new access token,
                // otherwise, you need to refresh the access token.
                if (!string.IsNullOrEmpty(LoggedInUserEmail))
                {
                    result = await _publicClientApplication.AcquireTokenSilentAsync(Scopes);
                }
                else
                {
                    result = await _publicClientApplication.AcquireTokenAsync(Scopes);
                }

                accessToken = result.Token;
                //Store values for logged-in user, tenant id, and authority, so that
                //they can be re-used if the user re-opens the app without disconnecting.
                LoggedInUser = result.User.Name;
                LoggedInUserEmail = result.User.DisplayableId;
                TenantId = result.TenantId;

                AccessToken = accessToken;
                return accessToken;
            }
            catch
            {
                return null;
            }
        }


    }
}



//********************************************************* 
// 
//O365-Win-Profile, https://github.com/OfficeDev/O365-Win-Profile
//
//Copyright (c) Microsoft Corporation
//All rights reserved. 
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// ""Software""), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
//********************************************************* 