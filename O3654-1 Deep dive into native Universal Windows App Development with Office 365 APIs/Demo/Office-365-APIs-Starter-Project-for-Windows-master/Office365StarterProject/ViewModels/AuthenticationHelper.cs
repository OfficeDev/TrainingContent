// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using System;
using System.Threading.Tasks;
using Microsoft.Office365.SharePoint;
using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.ActiveDirectory;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Office365StarterProject.Helpers;

namespace Office365StarterProject
{
    /// <summary>
    /// Provides clients for the different service endpoints.
    /// </summary>
    internal static class AuthenticationHelper
    {
        // Exchange Online service endpoints
        const string ExchangeServiceResourceId = "https://outlook.office365.com";
        static readonly Uri ExchangeServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

        // Active Directory service endpoints
        const string AadServiceResourceId = "https://graph.windows.net/";
        static readonly Uri AadServiceEndpointUri = new Uri("https://graph.windows.net/");

        static string _loggedInUser;
        static DiscoveryContext _discoveryContext;

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
        /// Checks that an Azure AD client is available to the client.
        /// </summary>
        /// <returns>The Azure AD client.</returns>
        public static async Task<AadGraphClient> EnsureAadGraphClientCreatedAsync()
        {
            if (_discoveryContext == null)
            {
                _discoveryContext = await DiscoveryContext.CreateAsync();
            }

            var dcr = await _discoveryContext.DiscoverResourceAsync(AadServiceResourceId);

            _loggedInUser = dcr.UserId;


            return new AadGraphClient(new Uri(AadServiceEndpointUri, dcr.TenantId), async () =>
            {
                return (await _discoveryContext.AuthenticationContext.AcquireTokenSilentAsync(AadServiceResourceId, _discoveryContext.AppIdentity.ClientId
                    , new Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier(dcr.UserId, Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType.UniqueId))).AccessToken;
            });
        }

        /// <summary>
        /// Checks that an Exchange client is available to the client.
        /// </summary>
        /// <returns>The Exchange Online client.</returns>
        public static async Task<ExchangeClient> EnsureCalendarClientCreatedAsync()
        {
            try
            {
                if (_discoveryContext == null)
                {
                    _discoveryContext = await DiscoveryContext.CreateAsync();
                }

                var dcr = await _discoveryContext.DiscoverResourceAsync(ExchangeServiceResourceId);

                _loggedInUser = dcr.UserId;

                return new ExchangeClient(ExchangeServiceEndpointUri, async () =>
                {
                    return (await _discoveryContext.AuthenticationContext.AcquireTokenSilentAsync(ExchangeServiceResourceId, _discoveryContext.AppIdentity.ClientId, new Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier(dcr.UserId, Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType.UniqueId))).AccessToken;
                });

            }
            catch (AuthenticationFailedException ex)
            {
                string errorText = String.Format(
                    "{0}, code {1}.  EnsureCalendarClientCreatedAsync - failed",
                    ex.ErrorDescription,
                    ex.ErrorCode);

                LoggingViewModel.Instance.Information = errorText;
            }

            return null;
        }

        /// <summary>
        /// Checks that a SharePoint client is available to the client.
        /// </summary>
        /// <returns>The SharePoint Online client.</returns>
        public static async Task<SharePointClient> EnsureSharePointClientCreatedAsync()
        {
            try
            {
                if (_discoveryContext == null)
                {
                    _discoveryContext = await DiscoveryContext.CreateAsync();
                }

                var dcr = await _discoveryContext.DiscoverCapabilityAsync("MyFiles");
                var serviceEndPointUri = dcr.ServiceEndpointUri;
                var serviceResourceId = dcr.ServiceResourceId;

                _loggedInUser = dcr.UserId;

                return new SharePointClient(serviceEndPointUri, async () =>
                {
                    return (await _discoveryContext.AuthenticationContext.AcquireTokenSilentAsync(serviceResourceId, _discoveryContext.AppIdentity.ClientId, new Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier(dcr.UserId, Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType.UniqueId))).AccessToken;
                });

            }
            catch (AuthenticationFailedException ex)
            {
                string errorText = String.Format(
                    "{0}, code {1}.  EnsureSharePointClientCreatedAsync - failed",
                    ex.ErrorDescription,
                    ex.ErrorCode
                    );

                LoggingViewModel.Instance.Information = errorText;
            }

            return null;
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

            if (_discoveryContext == null)
            {
                _discoveryContext = await DiscoveryContext.CreateAsync();
            }

            await _discoveryContext.LogoutAsync(_loggedInUser);
        }
    }
}
//********************************************************* 
// 
//O365-APIs-Start-Windows, https://github.com/OfficeDev/O365-APIs-Start-Windows
//
//Copyright (c) Microsoft Corporation
//All rights reserved. 
//
//MIT License:
//
//Permission is hereby granted, free of charge, to any person obtaining
//a copy of this software and associated documentation files (the
//""Software""), to deal in the Software without restriction, including
//without limitation the rights to use, copy, modify, merge, publish,
//distribute, sublicense, and/or sell copies of the Software, and to
//permit persons to whom the Software is furnished to do so, subject to
//the following conditions:
//
//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
//********************************************************* 
