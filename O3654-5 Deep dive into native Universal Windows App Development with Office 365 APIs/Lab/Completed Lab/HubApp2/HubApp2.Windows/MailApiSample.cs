using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HubApp2
{
    public static class MailApiSample
    {
        const string ServiceResourceId = "https://outlook.office365.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

        // Do not make static in Web apps; store it in session or in a cookie instead
        static string _lastLoggedInUser;
        static DiscoveryContext _discoveryContext;

        public static async Task<IEnumerable<IMessage>> GetMessages()
        {
            var client = await EnsureClientCreated();

            var messageResults = await (from i in client.Me.Inbox.Messages
                                        orderby i.DateTimeSent descending
                                        select i).ExecuteAsync();

            return messageResults.CurrentPage;
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
                return (await _discoveryContext.AuthenticationContext.AcquireTokenSilentAsync(ServiceResourceId, _discoveryContext.AppIdentity.ClientId, new Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier(dcr.UserId, Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType.UniqueId))).AccessToken;
            });
        }

        public static async Task SignOut()
        {
            if (string.IsNullOrEmpty(_lastLoggedInUser))
            {
                return;
            }

            if (_discoveryContext == null)
            {
                _discoveryContext = await DiscoveryContext.CreateAsync();
            }

            await _discoveryContext.LogoutAsync(_lastLoggedInUser);
        }
    }
}
