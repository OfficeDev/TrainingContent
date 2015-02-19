using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace _365OAuthWeb
{
    public static class ContactsAPISample
    {
        const string ServiceResourceId = "https://outlook.office365.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

        // Do not make static in Web apps; store it in session or in a cookie instead
        static string _lastLoggedInUser;
        static DiscoveryContext _discoveryContext;

        public static async Task<IEnumerable<IContact>> GetContacts()
        {
            var client = await EnsureClientCreated();

            // Obtain first page of contacts
            var contactsResults = await (from i in client.Me.Contacts
                                         orderby i.DisplayName
                                         select i).ExecuteAsync();

            return contactsResults.CurrentPage;
        }

        public static async Task<ExchangeClient> EnsureClientCreated()
        {
            if (_discoveryContext == null)
            {
                _discoveryContext = await DiscoveryContext.CreateAsync();
            }

            var dcr = await _discoveryContext.DiscoverResourceAsync(ServiceResourceId);

            _lastLoggedInUser = dcr.UserId;

            return new ExchangeClient(ServiceEndpointUri, async () =>
            {
                return (await _discoveryContext.AuthenticationContext.AcquireTokenByRefreshTokenAsync(new SessionCache().Read("RefreshToken"), new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(_discoveryContext.AppIdentity.ClientId, _discoveryContext.AppIdentity.ClientSecret), ServiceResourceId)).AccessToken;
            });
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
