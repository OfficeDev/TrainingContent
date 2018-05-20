using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using Microsoft.Graph;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace OfficeOAuth
{
    public class CalendarAPISample
    {
        public static async Task<IOrderedEnumerable<Event>> GetCalendarEvents(string authCode)
        {
            var client = await EnsureClientCreated(authCode);
            var eventsResults = await client.Me.Events.Request(new Option[] { new QueryOption("$top", "10") }).GetAsync();
            return eventsResults.OrderBy(e => e.Start.DateTime);
        }

        public static async Task<GraphServiceClient> EnsureClientCreated(string authCode)
        {
            var graphToken = await GetAccessTokenByAuthenticationCodeAsync(authCode);
            var authenticationProvider = new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", graphToken);
                    return Task.FromResult(0);
                });
            return new GraphServiceClient(authenticationProvider);
        }

        public static async Task<String> GetAccessTokenByAuthenticationCodeAsync(string authCode)
        {
            var authResult = await new AuthenticationContext(SettingsHelper.Authority)
                .AcquireTokenByAuthorizationCodeAsync(authCode,
                new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority)),
                new ClientCredential(SettingsHelper.ClientID, SettingsHelper.ClientSecret));
            return authResult.AccessToken;
        }
    }
}