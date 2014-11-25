using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Office365.OAuth;
using Microsoft.Office365.Exchange;
using System.IO;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace ExchangeClientDemo.Models {
	public class MyContactsRepository {


		public async Task<int> GetContactCount() {
			var client = await EnsureClientCreated();
			var contactsResults = await client.Me.Contacts.ExecuteAsync();
			return contactsResults.CurrentPage.Count;
		}

		public async Task<List<MyContact>> GetContacts(int pageIndex, int pageSize) {

			var client = await EnsureClientCreated();

			var contactsResults = await client.Me.Contacts.Skip(pageIndex * pageSize).Take(pageSize).ExecuteAsync();

			var contactList = new List<MyContact>();

			foreach (var contact in contactsResults.CurrentPage) {
				contactList.Add(new MyContact {
					Id = contact.Id,
					GivenName = contact.GivenName,
					Surname = contact.Surname,
					CompanyName = contact.CompanyName,
					EmailAddress1 = contact.EmailAddress1,
					BusinessPhone1 = contact.BusinessPhone1,
					HomePhone1 = contact.HomePhone1
				});
			}
			return contactList;
		}

		public async Task<MyContact> GetContact(string id) {
			var client = await EnsureClientCreated();
			var contact = await client.Me.Contacts.GetById(id).ExecuteAsync();
			return new MyContact {
				Id = contact.Id,
				GivenName = contact.GivenName,
				Surname = contact.Surname,
				CompanyName = contact.CompanyName,
				EmailAddress1 = contact.EmailAddress1,
				BusinessPhone1 = contact.BusinessPhone1,
				HomePhone1 = contact.HomePhone1

			};
		}

		public async Task DeleteContact(string id) {
			var client = await EnsureClientCreated();
			var contact = await client.Me.Contacts.GetById(id).ExecuteAsync();
			await contact.DeleteAsync();
		}

		public async Task AddContact(ExchangeClientDemo.Models.MyContact contact) {
			var client = await EnsureClientCreated();
			var newContact = new Microsoft.Office365.Exchange.Contact {
				GivenName = contact.GivenName,
				Surname = contact.Surname,
				CompanyName = contact.CompanyName,
				EmailAddress1 = contact.EmailAddress1,
				BusinessPhone1 = contact.BusinessPhone1,
				HomePhone1 = contact.HomePhone1
			};
			await client.Me.Contacts.AddContactAsync(newContact);
		}

		public async Task UpdateContact(ExchangeClientDemo.Models.MyContact contact) {
			string id = contact.Id;

			var client = await EnsureClientCreated();
			var contactToUpdate = await client.Me.Contacts.GetById(id).ExecuteAsync();
			contactToUpdate.GivenName = contact.GivenName;
			contactToUpdate.Surname = contact.Surname;
			contactToUpdate.CompanyName = contact.CompanyName;
			contactToUpdate.EmailAddress1 = contact.EmailAddress1;
			contactToUpdate.BusinessPhone1 = contact.BusinessPhone1;
			contactToUpdate.HomePhone1 = contact.HomePhone1;

			await contactToUpdate.UpdateAsync(true);
			await client.Context.SaveChangesAsync();

		}

		public async Task DeleteAllContacts() {
			var client = await EnsureClientCreated();
			var contacts = await client.Me.Contacts.ExecuteAsync();
			foreach (var contact in contacts.CurrentPage) {
				await contact.DeleteAsync();
			}
		}

		public async Task AddSampleData() {
			var client = await EnsureClientCreated();

			foreach (var contact in ContactFactory.GetContactList(30)) {

				var newContact = new Microsoft.Office365.Exchange.Contact {
					GivenName = contact.GivenName,
					Surname = contact.Surname,
					CompanyName = contact.CompanyName,
					EmailAddress1 = contact.EmailAddress1,
					BusinessPhone1 = contact.BusinessPhone1,
					HomePhone1 = contact.HomePhone1
				};
				await client.Me.Contacts.AddContactAsync(newContact);
			}

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

      string clientId = disco.AppIdentity.ClientId;
      string clientSecret = disco.AppIdentity.ClientSecret;
      SaveInCache("LastLoggedInUser", dcr.UserId);


      ExchangeClient exClient = new ExchangeClient(ServiceEndpointUri, async () => {
        // set it up
        ClientCredential creds = new ClientCredential(clientId, clientSecret);
        UserIdentifier userId = new UserIdentifier(dcr.UserId, UserIdentifierType.UniqueId);
        AuthenticationContext authContext = disco.AuthenticationContext;
        // call across network
        AuthenticationResult authResult = await authContext.AcquireTokenSilentAsync(ServiceResourceId, creds, userId);
        // return access token
        return authResult.AccessToken;
      });

      return exClient;
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