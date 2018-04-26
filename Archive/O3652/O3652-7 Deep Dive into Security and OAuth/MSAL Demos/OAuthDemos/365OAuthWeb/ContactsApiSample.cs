using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Configuration;
using Microsoft.Graph;
using Microsoft.Identity.Client;

namespace _365OAuthWeb
{
    public static class ContactsAPISample
    {

        public static async Task<IEnumerable<Contact>> GetContacts(string webUrl, string authCode)
        {
            var client = await EnsureClientCreated(webUrl, authCode);

            // Obtain first page of contacts
            var contactsResults = await client.Me.Contacts.Request().OrderBy("displayName").GetAsync();

            return contactsResults.CurrentPage;
        }

        public static async Task<GraphServiceClient> EnsureClientCreated(string webUrl, string authCode)
        {
            var clientId = ConfigurationManager.AppSettings["ida:ClientID"];
            var password = ConfigurationManager.AppSettings["ida:Password"];
            var confidentialClientApplication = new ConfidentialClientApplication(clientId, webUrl, new ClientCredential(password), null);
            var authResult = await confidentialClientApplication.AcquireTokenByAuthorizationCodeAsync(new string[] { "Contacts.Read" }, authCode);
            var graphToken = authResult.Token;
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
            return null;
        }
    }
}
