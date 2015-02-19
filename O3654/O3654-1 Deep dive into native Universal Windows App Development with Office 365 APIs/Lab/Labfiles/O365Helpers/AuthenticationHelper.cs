// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

#if WINDOWS_APP
using Microsoft.Azure.ActiveDirectory.GraphClient;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.OutlookServices;
using Microsoft.Office365.SharePoint.CoreServices;
using System;
using System.Linq;
using System.Threading.Tasks;
using Windows.Security.Authentication.Web;

namespace HubApp2.O365Helpers
{
    /// <summary>
    /// Provides clients for the different service endpoints.
    /// </summary>
    internal static class AuthenticationHelper
    {
        // The ClientID is added as a resource in App.xaml when you register the app with Office 365. 
        // As a convenience, we load that value into a variable called ClientID. This way the variable 
        // will always be in sync with whatever client id is added to App.xaml.
        private static readonly string ClientID = App.Current.Resources["ida:ClientID"].ToString();
        private static Uri ReturnUri = WebAuthenticationBroker.GetCurrentApplicationCallbackUri();


        // Properties used for communicating with your Windows Azure AD tenant.
        // The AuthorizationUri is added as a resource in App.xaml when you regiter the app with 
        // Office 365. As a convenience, we load that value into a variable called CommonAuthority, adding Common to this Url to signify
        // multi-tenancy. This way it will always be in sync with whatever value is added to App.xaml.
        private static readonly string CommonAuthority = App.Current.Resources["ida:AuthorizationUri"].ToString() + @"/Common";
        private static readonly Uri DiscoveryServiceEndpointUri = new Uri("https://api.office.com/discovery/v1.0/me/");
        private const string DiscoveryResourceId = "https://api.office.com/discovery/";

        public static AuthenticationContext AuthenticationContext { get; set; }

        static string _loggedInUser;
        /// <summary>
        /// Gets the logged in user.
        /// </summary>
        static internal String LoggedInUser
        {
            get
            {
                return _loggedInUser;
            }
        }

        /// <summary>
        /// Checks that a Graph client is available.
        /// </summary>
        /// <returns>The Graph client.</returns>
        public static async Task<ActiveDirectoryClient> EnsureGraphClientCreatedAsync()
        {
            // Active Directory service endpoints
            const string AadServiceResourceId = "https://graph.windows.net/";
            Uri AadServiceEndpointUri = new Uri("https://graph.windows.net/");

            try
            {
                AuthenticationContext = new AuthenticationContext(CommonAuthority);

                TokenCacheItem cacheItem = null;

                if (AuthenticationContext.TokenCache.ReadItems().Count() > 0)
                {
                    // Bind the AuthenticationContext to the authority that sourced the token in the cache 
                    // this is needed for the cache to work when asking for a token from that authority 
                    // (the common endpoint never triggers cache hits) 
                    cacheItem = AuthenticationContext.TokenCache.ReadItems().First();
                    AuthenticationContext = new AuthenticationContext(cacheItem.Authority);

                }
                else
                {
                    // Nothing was found in the cache, so let's acquire a token.
                    var token = await AcquireTokenAsync(AuthenticationContext, AadServiceResourceId);

                    // Check the token
                    if (String.IsNullOrEmpty(token))
                    {
                        // User cancelled sign-in
                        return null;
                    }
                    else
                    {
                        // If a token was acquired, the TokenCache will contain a TokenCacheItem containing
                        // all the details of the authorization.
                        cacheItem = AuthenticationContext.TokenCache.ReadItems().First();
                    }
                }

                // Store the Id of the logged-in user so that we can retrieve more user info later.
                _loggedInUser = cacheItem.UniqueId;
                
                // Create our ActiveDirectory client.
                var client = new ActiveDirectoryClient(
                    new Uri(AadServiceEndpointUri, cacheItem.TenantId),
                    async () => await AcquireTokenAsync(AuthenticationContext, AadServiceResourceId));

                return client;
            }
            // The following is a list of all exceptions you should consider handling in your app.
            // In the case of this sample, the exceptions are handled by returning null upstream. 
            catch (DiscoveryFailedException dfe)
            {
                MessageDialogHelper.DisplayException(dfe as Exception);

                // Discovery failed.
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
            catch (MissingConfigurationValueException mcve)
            {
                MessageDialogHelper.DisplayException(mcve);

                // Connected services not added correctly, or permissions not set correctly.
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
            catch (AuthenticationFailedException afe)
            {
                MessageDialogHelper.DisplayException(afe);

                // Failed to authenticate the user
                AuthenticationContext.TokenCache.Clear();
                return null;

            }
            catch (ArgumentException ae)
            {
                MessageDialogHelper.DisplayException(ae as Exception);

                // Argument exception
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
        }

        /// <summary>
        /// Checks that an OutlookServicesClient object is available. 
        /// </summary>
        /// <returns>The OutlookServicesClient object. </returns>
        public static async Task<OutlookServicesClient> EnsureOutlookClientCreatedAsync()
        {
            try
            {
                AuthenticationContext = new AuthenticationContext(CommonAuthority);

                if (AuthenticationContext.TokenCache.ReadItems().Count() > 0)
                {
                    // Bind the AuthenticationContext to the authority that sourced the token in the cache 
                    // this is needed for the cache to work when asking for a token from that authority 
                    // (the common endpoint never triggers cache hits) 
                    string cachedAuthority = AuthenticationContext.TokenCache.ReadItems().First().Authority;
                    AuthenticationContext = new AuthenticationContext(cachedAuthority);

                }

                // Create a DiscoveryClient using the discovery endpoint Uri.  
                DiscoveryClient discovery = new DiscoveryClient(DiscoveryServiceEndpointUri,
                    async () => await AcquireTokenAsync(AuthenticationContext, DiscoveryResourceId));

                // Now get the capability that you are interested in.
                CapabilityDiscoveryResult result = await discovery.DiscoverCapabilityAsync("Mail");

                var client = new OutlookServicesClient(
                    result.ServiceEndpointUri,
                    async () => await AcquireTokenAsync(AuthenticationContext, result.ServiceResourceId));

                return client;
            }
            // The following is a list of all exceptions you should consider handling in your app.
            // In the case of this sample, the exceptions are handled by returning null upstream. 
            catch (DiscoveryFailedException dfe)
            {
                MessageDialogHelper.DisplayException(dfe as Exception);

                // Discovery failed.
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
            catch (MissingConfigurationValueException mcve)
            {
                MessageDialogHelper.DisplayException(mcve);

                // Connected services not added correctly, or permissions not set correctly.
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
            catch (AuthenticationFailedException afe)
            {
                MessageDialogHelper.DisplayException(afe);

                // Failed to authenticate the user
                AuthenticationContext.TokenCache.Clear();
                return null;

            }
            catch (ArgumentException ae)
            {
                MessageDialogHelper.DisplayException(ae as Exception);
                // Argument exception
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
        }

        /// <summary>
        /// Checks that a SharePoint client is available to the client.
        /// </summary>
        /// <returns>The SharePoint Online client.</returns>
        public static async Task<SharePointClient> EnsureSharePointClientCreatedAsync()
        {
            try
            {
                AuthenticationContext = new AuthenticationContext(CommonAuthority);

                if (AuthenticationContext.TokenCache.ReadItems().Count() > 0)
                {
                    // Bind the AuthenticationContext to the authority that sourced the token in the cache 
                    // this is needed for the cache to work when asking for a token from that authority 
                    // (the common endpoint never triggers cache hits) 
                    string cachedAuthority = AuthenticationContext.TokenCache.ReadItems().First().Authority;
                    AuthenticationContext = new AuthenticationContext(cachedAuthority);

                }

                // Create a DiscoveryClient using the discovery endpoint Uri.  
                DiscoveryClient discovery = new DiscoveryClient(DiscoveryServiceEndpointUri,
                    async () => await AcquireTokenAsync(AuthenticationContext, DiscoveryResourceId));

                // Now get the capability that you are interested in.
                CapabilityDiscoveryResult result = await discovery.DiscoverCapabilityAsync("MyFiles");

                var client = new SharePointClient(
                    result.ServiceEndpointUri,
                    async () => await AcquireTokenAsync(AuthenticationContext, result.ServiceResourceId));

                return client;
            }
            catch (DiscoveryFailedException dfe)
            {
                MessageDialogHelper.DisplayException(dfe as Exception);

                // Discovery failed.
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
            catch (MissingConfigurationValueException mcve)
            {
                MessageDialogHelper.DisplayException(mcve);

                // Connected services not added correctly, or permissions not set correctly.
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
            catch (AuthenticationFailedException afe)
            {
                MessageDialogHelper.DisplayException(afe);

                // Failed to authenticate the user
                AuthenticationContext.TokenCache.Clear();
                return null;

            }
            catch (ArgumentException ae)
            {
                MessageDialogHelper.DisplayException(ae as Exception);
                // Argument exception
                AuthenticationContext.TokenCache.Clear();
                return null;
            }
        }


        /// <summary>
        /// Signs the user out of the service.
        /// </summary>
        public static async Task SignOutAsync()
        {
            if (string.IsNullOrEmpty(_loggedInUser))
            {
                return;
            }

            await AuthenticationContext.LogoutAsync(_loggedInUser);
            AuthenticationContext.TokenCache.Clear();
        }

        // Get an access token for the given context and resourceId. An attempt is first made to 
        // acquire the token silently. If that fails, then we try to acquire the token by prompting the user.
        private static async Task<string> AcquireTokenAsync(AuthenticationContext context, string resourceId)
        {
            string accessToken = null;

            try
            {
                // First, we are going to try to get the access token silently using the resourceId that was passed in
                // and the clientId of the application...
                accessToken = (await context.AcquireTokenSilentAsync(resourceId, ClientID)).AccessToken;
            }
            catch (Exception)
            {
                // We were unable to acquire the AccessToken silently. So, we'll try again with full
                // prompting. 
                accessToken = null;

            }

            if (accessToken == "" || accessToken == null)
                accessToken = (await context.AcquireTokenAsync(resourceId, ClientID, ReturnUri)).AccessToken;

            return accessToken;
        }

    }
}
#endif
//********************************************************* 
// 
//O365-APIs-Start-Windows, https://github.com/OfficeDev/O365-APIs-Start-Windows
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