using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Graph;
using Microsoft.Office365.OAuth;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Net.Http.Headers;

namespace _365OAuthWeb
{
    public static class ContactsAPISample
    {
        const string GraphResourceId = "https://graph.microsoft.com";

        // Do not make static in Web apps; store it in session or in a cookie instead
        static string _lastLoggedInUser;
        static DiscoveryContext _discoveryContext;

        public static async Task<IEnumerable<Contact>> GetContacts()
        {
            var client = await EnsureClientCreated();

            // Obtain first page of contacts
            var contactsResults = await client.Me.Contacts.Request().OrderBy("displayName").GetAsync();

            return contactsResults.CurrentPage;
        }

        public static async Task<GraphServiceClient> EnsureClientCreated()
        {
            if (_discoveryContext == null)
            {
                _discoveryContext = await DiscoveryContext.CreateAsync();
            }

            var dcr = await _discoveryContext.DiscoverResourceAsync(GraphResourceId);

            _lastLoggedInUser = dcr.UserId;

            var clientCredential = new ClientCredential(_discoveryContext.AppIdentity.ClientId, _discoveryContext.AppIdentity.ClientSecret);
            var authResult = await _discoveryContext
                                    .AuthenticationContext
                                    .AcquireTokenByRefreshTokenAsync(new SessionCache().Read("RefreshToken"), clientCredential, GraphResourceId);
            var graphToken = authResult.AccessToken;
            var authenticationProvider = new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", graphToken);
                    return Task.FromResult(0);
                });
            return new GraphServiceClient(authenticationProvider);
        }

        public static Uri SignOut(string postLogoutRedirect)
        {
            if (_discoveryContext == null)
            {
                _discoveryContext = new DiscoveryContext();
            }

            _discoveryContext.ClearCache();

            return _discoveryContext.GetLogoutUri<SessionCache>(postLogoutRedirect);
        }
    }
}
