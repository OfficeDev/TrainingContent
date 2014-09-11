using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExchangeClientDemo {
    public static class ContactsAPISample {
        const string ServiceResourceId = "https://outlook.office365.com";
        static readonly Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

        public static async Task<IEnumerable<IContact>> GetContacts() {
            var client = await EnsureClientCreated();

            // Obtain first page of contacts
            var contactsResults = await (from i in client.Me.Contacts
                                         orderby i.DisplayName
                                         select i).ExecuteAsync();

            return contactsResults.CurrentPage;
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
