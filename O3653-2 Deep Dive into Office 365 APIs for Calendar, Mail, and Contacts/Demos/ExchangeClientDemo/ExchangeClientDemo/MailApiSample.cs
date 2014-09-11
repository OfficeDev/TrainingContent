using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExchangeClientDemo {
    public static class MailApiSample {
        const string ServiceResourceId = "https://outlook.office365.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

        public static async Task<IEnumerable<IMessage>> GetMessages() {
            var client = await EnsureClientCreated();


            var messageResults = await (from i in client.Me.Inbox.Messages
                                        orderby i.DateTimeSent descending
                                        select i).ExecuteAsync();

            return messageResults.CurrentPage;
        }

        public static async Task<ExchangeClient> EnsureClientCreated() {
            DiscoveryContext _discoveryContext = System.Web.HttpContext.Current.Session["DiscoveryContext"] as DiscoveryContext;

            if (_discoveryContext == null) {
                _discoveryContext = await DiscoveryContext.CreateAsync();
                System.Web.HttpContext.Current.Session["DiscoveryContext"] = _discoveryContext;

            }

            var dcr = await _discoveryContext.DiscoverResourceAsync(ServiceResourceId);

            System.Web.HttpContext.Current.Session["LastLoggedInUser"] = dcr.UserId;

            return new ExchangeClient(ServiceEndpointUri, async () => {
                return (await _discoveryContext.AuthenticationContext.AcquireTokenByRefreshTokenAsync(new SessionCache().Read("RefreshToken"), new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(_discoveryContext.AppIdentity.ClientId, _discoveryContext.AppIdentity.ClientSecret), ServiceResourceId)).AccessToken;
            });

        }

        public static Uri SignOut(string postLogoutRedirect) {
            DiscoveryContext _discoveryContext = System.Web.HttpContext.Current.Session["DiscoveryContext"] as DiscoveryContext;

            if (_discoveryContext == null) {
                _discoveryContext = new DiscoveryContext();
                System.Web.HttpContext.Current.Session["DiscoveryContext"] = _discoveryContext;
            }

            _discoveryContext.ClearCache();

            return _discoveryContext.GetLogoutUri<SessionCache>(postLogoutRedirect);
        }
    }
}
