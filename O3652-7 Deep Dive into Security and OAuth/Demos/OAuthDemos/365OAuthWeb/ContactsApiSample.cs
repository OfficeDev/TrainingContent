using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _365OAuthWeb
{
    public static class ContactsAPISample
    {
        const string ExchangeResourceId = "https://outlook.office365.com";
        const string ExchangeServiceRoot = "https://outlook.office365.com/ews/odata";

        public static async Task<IEnumerable<IContact>> GetContacts()
        {
            var client = await EnsureClientCreated();

            // Obtain first page of contacts
            var contactsResults = await (from i in client.Me.Contacts
                                         where i.Surname.StartsWith("H")
                                         select i).ExecuteAsync();
            
            return contactsResults.CurrentPage;
        }
    
        private static async Task<ExchangeClient> EnsureClientCreated()
        {
            Authenticator authenticator = new Authenticator();
            var authInfo = await authenticator.AuthenticateAsync(ExchangeResourceId);

            return new ExchangeClient(new Uri(ExchangeServiceRoot), authInfo.GetAccessToken);
        }
        public static void SignOut(Uri postLogoutRedirect)
        {
            new Authenticator().Logout(postLogoutRedirect);
        }
    }
}
