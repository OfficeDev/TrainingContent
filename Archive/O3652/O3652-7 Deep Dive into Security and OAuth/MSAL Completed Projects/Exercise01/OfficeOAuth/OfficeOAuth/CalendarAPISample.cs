using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using Microsoft.Graph;
using Microsoft.Identity.Client;

namespace OfficeOAuth
{
    public class CalendarAPISample
    {
        public static async Task<IOrderedEnumerable<Event>> GetCalendarEvents(string authCode, string webUrl)
        {
            var client = await EnsureClientCreated(authCode, webUrl);
            var eventsResults = await client.Me.Events.Request(new Option[] { new QueryOption("$top", "10") }).GetAsync();
            return eventsResults.OrderBy(e => e.Start.DateTime);
        }

        public static async Task<GraphServiceClient> EnsureClientCreated(string authCode, string webUrl)
        {
            var graphToken = await GetAccessTokenByAuthenticationCodeAsync(authCode, webUrl);
            var authenticationProvider = new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", graphToken);
                    return Task.FromResult(0);
                });
            return new GraphServiceClient(authenticationProvider);
        }

        public static async Task<String> GetAccessTokenByAuthenticationCodeAsync(string authCode, string webUrl)
        {
            ConfidentialClientApplication cca = new ConfidentialClientApplication(SettingsHelper.AppId, webUrl,
                new ClientCredential(SettingsHelper.AppPassword), null);

            string[] scopes = { "Calendars.Read" };
            var authResult = await cca.AcquireTokenByAuthorizationCodeAsync(scopes, authCode);
            return authResult.Token;
        }
    }
}