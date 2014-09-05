using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace O365Discovery
{
    public static class CalendarAPISample
    {
        const string ServiceResourceId = "https://outlook.office365.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

        // Do not make static in Web apps; store it in session or in a cookie instead
        static string _lastLoggedInUser;
        static DiscoveryContext _discoveryContext;

        public static async Task<IOrderedEnumerable<IEvent>> GetCalendarEvents()
        {
            var client = await EnsureClientCreated();

            // Obtain calendar event data
            var eventsResults = await (from i in client.Me.Events
                                       where i.End >= DateTimeOffset.UtcNow
                                       select i).Take(10).ExecuteAsync();

            var events = eventsResults.CurrentPage.OrderBy(e => e.Start);

            return events;
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
