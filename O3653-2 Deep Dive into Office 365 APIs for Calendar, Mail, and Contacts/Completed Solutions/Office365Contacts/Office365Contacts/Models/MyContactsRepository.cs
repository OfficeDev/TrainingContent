using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Office365.OAuth;
using Microsoft.Office365.Exchange;
using System.IO;
using System.Threading.Tasks;

namespace Office365Contacts.Models {
    public class MyContactsRepository {
        public async Task<int> GetContactCount() {
            var client = await EnsureClientCreated();
            var contactsResults = await client.Me.Contacts.ExecuteAsync();
            return contactsResults.CurrentPage.Count;
        }
 
        public async Task<List<MyContact>> GetContacts(int pageIndex, int pageSize) {

            var client = await EnsureClientCreated();
            var contactsResults = await client.Me.Contacts.ExecuteAsync();

            var myContactsList = new List<MyContact>();

            foreach (var contact in contactsResults.CurrentPage.OrderBy(e => e.Surname).Skip(pageIndex * pageSize).Take(pageSize)) {
                myContactsList.Add(new MyContact {
                    Id = contact.Id,
                    GivenName = contact.GivenName,
                    Surname = contact.Surname,
                    CompanyName = contact.CompanyName,
                    EmailAddress1 = contact.EmailAddress1,
                    BusinessPhone1 = contact.BusinessPhone1,
                    HomePhone1 = contact.HomePhone1
                });
            }
            return myContactsList;
        }

        public async Task DeleteContact(string id) {
            var client = await EnsureClientCreated();
            var contact = await client.Me.Contacts.GetById(id).ExecuteAsync();
            await contact.DeleteAsync();
        }

        public async Task AddContact(MyContact myContact) {
            var client = await EnsureClientCreated();
            var newContact = new Microsoft.Office365.Exchange.Contact {
                GivenName = myContact.GivenName,
                Surname = myContact.Surname,
                CompanyName = myContact.CompanyName,
                EmailAddress1 = myContact.EmailAddress1,
                BusinessPhone1 = myContact.BusinessPhone1,
                HomePhone1 = myContact.HomePhone1
            };
            await client.Me.Contacts.AddContactAsync(newContact);
        }


        private async Task<ExchangeClient> EnsureClientCreated() {

            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null) {
                disco = await DiscoveryContext.CreateAsync();
                SaveInCache("DiscoveryContext", disco);
            }

            string ServiceResourceId = "https://outlook.office365.com";
            Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

            var dcr = await disco.DiscoverResourceAsync(ServiceResourceId);

            SaveInCache("LastLoggedInUser", dcr.UserId);

            return new ExchangeClient(ServiceEndpointUri, async () => {
                return (await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                    new SessionCache().Read("RefreshToken"),
                    new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(
                        disco.AppIdentity.ClientId,
                        disco.AppIdentity.ClientSecret),
                        ServiceResourceId)).AccessToken;
            });

        }

        private void SaveInCache(string name, object value) {
            System.Web.HttpContext.Current.Session[name] = value;
        }

        private object GetFromCache(string name) {
            return System.Web.HttpContext.Current.Session[name];
        }

        private void RemoveFromCache(string name) {
            System.Web.HttpContext.Current.Session.Remove(name);
        }

    }
}