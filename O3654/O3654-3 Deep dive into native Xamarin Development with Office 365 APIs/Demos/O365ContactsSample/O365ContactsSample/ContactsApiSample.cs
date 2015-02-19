using Android.Content;
using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace O365ContactsSample
{
    public static class ContactsAPISample
    {
        const string ExchangeResourceId = "https://outlook.office365.com";
        const string ExchangeServiceRoot = "https://outlook.office365.com/ews/odata";

        public static async Task<IEnumerable<IContact>> GetContacts(Context context)
        {
            var client = await EnsureClientCreated(context);

            // Obtain first page of contacts
            var contactsResults = await (from i in client.Me.Contacts
                                         orderby i.DisplayName
                                         select i).ExecuteAsync();
            
            return contactsResults.CurrentPage;
        }
    
        public static async Task<ExchangeClient> EnsureClientCreated(Context context)
        {
            Authenticator authenticator = new Authenticator(context);
            var authInfo = await authenticator.AuthenticateAsync(ExchangeResourceId);

            return new ExchangeClient(new Uri(ExchangeServiceRoot), authInfo.GetAccessToken);
        }
    }
}
