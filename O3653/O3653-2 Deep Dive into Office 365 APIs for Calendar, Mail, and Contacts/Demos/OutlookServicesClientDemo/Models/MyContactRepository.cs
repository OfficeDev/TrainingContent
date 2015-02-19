using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Microsoft.Ajax.Utilities;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.OutlookServices;
using System.IO;
using System.Threading.Tasks;
using OutlookServicesClientDemo.Utils;

using System.Security.Claims;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;

namespace OutlookServicesClientDemo.Models {
  public class MyContactRepository {
    private async Task<OutlookServicesClient> EnsureClientCreated() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

      // discover contact endpoint
      var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      // create auth context
      AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(signInUserId));

      // create O365 discovery client 
      DiscoveryClient discovery = new DiscoveryClient(new Uri(SettingsHelper.O365DiscoveryServiceEndpoint),
        async () => {
          var authResult = await authContext.AcquireTokenSilentAsync(SettingsHelper.O365DiscoveryResourceId, clientCredential, userIdentifier);

          return authResult.AccessToken;
        });

      // query discovery service for endpoint for 'calendar' endpoint
      CapabilityDiscoveryResult dcr = await discovery.DiscoverCapabilityAsync("Contacts");

      // create an OutlookServicesclient
      return new OutlookServicesClient(dcr.ServiceEndpointUri,
        async () => {
          var authResult =
            await
              authContext.AcquireTokenSilentAsync(dcr.ServiceResourceId, clientCredential, userIdentifier);
          return authResult.AccessToken;
        });
    }

    public async Task<int> GetContactCount() {
      var client = await EnsureClientCreated();
      var contactResults = await client.Me.Contacts.ExecuteAsync();
      return contactResults.CurrentPage.Count();
    }

    public async Task<List<MyContact>> GetContacts(int pageIndex, int pageSize) {
      // acquire a O365 client to retrieve contacts
      OutlookServicesClient client = await EnsureClientCreated();

      // get contacts, sort by their last name and only one page of content
      var contactsResults = await client.Me.Contacts.ExecuteAsync();
      var contacts = contactsResults.CurrentPage
                                      .OrderBy(e => e.Surname)
                                      .Skip(pageIndex * pageSize)
                                      .Take(pageSize);

      // convert response from Office 365 API > internal class
      var myContactsList = new List<MyContact>();
      foreach (var contact in contacts) {
        myContactsList.Add(new MyContact {
          Id = contact.Id,
          GivenName = contact.GivenName,
          Surname = contact.Surname,
          CompanyName = contact.CompanyName,
          EmailAddress = contact.EmailAddresses[0] != null ? contact.EmailAddresses[0].Address : string.Empty,
          BusinessPhone = contact.BusinessPhones[0] ?? string.Empty,
          HomePhone = contact.HomePhones[0] ?? string.Empty
        });
      }

      // return collection oc contacts
      return myContactsList;
    }

    public async Task<MyContact> GetContact(string id) {
      var client = await EnsureClientCreated();
      var contact = await client.Me.Contacts.GetById(id).ExecuteAsync();
      return new MyContact {
        Id = contact.Id,
        GivenName = contact.GivenName,
        Surname = contact.Surname,
        CompanyName = contact.CompanyName,
        EmailAddress = contact.EmailAddresses[0] != null ? contact.EmailAddresses[0].Address : string.Empty,
        BusinessPhone = contact.BusinessPhones[0] ?? string.Empty,
        HomePhone = contact.HomePhones[0] ?? string.Empty
      };
    }

    public async Task DeleteContact(string id) {
      // acquire a O365 client to retrieve contacts
      var client = await EnsureClientCreated();

      // get the contact to be deleted
      var contact = await client.Me.Contacts.GetById(id).ExecuteAsync();

      // delete the contact
      await contact.DeleteAsync();
    }

    public async Task DeleteAllContacts()
    {
      var client = await EnsureClientCreated();
      var contacts = await client.Me.Contacts.ExecuteAsync();
      foreach (var contact in contacts.CurrentPage)
      {
        await contact.DeleteAsync();
      }
    }

    public async Task AddContact(MyContact myContact) {
      // acquire a O365 client to retrieve contacts
      var client = await EnsureClientCreated();

      // create new contact record
      var newContact = new Microsoft.Office365.OutlookServices.Contact {
        GivenName = myContact.GivenName,
        Surname = myContact.Surname,
        CompanyName = myContact.CompanyName
      };

      // add email address
      newContact.EmailAddresses.Add(new EmailAddress() {
        Address = myContact.EmailAddress,
        Name = myContact.EmailAddress
      });

      // add phone numbers to collections
      newContact.HomePhones.Add(myContact.HomePhone);
      newContact.BusinessPhones.Add(myContact.BusinessPhone);

      // create the contact in O365
      await client.Me.Contacts.AddContactAsync(newContact);
    }

    public async Task UpdateContact(MyContact myContact) {
      var client = await EnsureClientCreated();
      var contactToUpdate = await client.Me.Contacts.GetById(myContact.Id).ExecuteAsync();
      contactToUpdate.GivenName = myContact.GivenName;
      contactToUpdate.Surname = myContact.Surname;
      contactToUpdate.CompanyName = myContact.CompanyName;

      if (!string.IsNullOrEmpty(myContact.EmailAddress)) {
        contactToUpdate.EmailAddresses[0].Address = myContact.EmailAddress;
        contactToUpdate.EmailAddresses[0].Name = myContact.EmailAddress;
      }

      contactToUpdate.BusinessPhones[0] = !string.IsNullOrEmpty(myContact.BusinessPhone)
        ? myContact.BusinessPhone
        : null;

      contactToUpdate.HomePhones[0] = !string.IsNullOrEmpty(myContact.HomePhone)
        ? myContact.HomePhone
        : null;

      await contactToUpdate.UpdateAsync(true);
      await client.Context.SaveChangesAsync();
    }

    public async Task AddSampleData() {
      foreach (var contact in ContactFactory.GetContactList(30))
      {
        await AddContact(contact);
      }
    }
  }
}