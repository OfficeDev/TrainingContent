using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.OutlookServices;
using System.IO;
using System.Threading.Tasks;
using Office365Contacts.Utils;

using System.Security.Claims;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;

namespace Office365Contacts.Models {
  public class MyContactRepository {
    private static string CLIENT_ID = ConfigurationManager.AppSettings["ida:ClientID"];
    private static string CLIENT_SECRET = ConfigurationManager.AppSettings["ida:Password"];
    private static string TENANT_ID = ConfigurationManager.AppSettings["tenantId"];
    const string DISCOVERY_ENDPOINT = "https://api.office.com/discovery/v1.0/me/";
    const string DISCOVERY_RESOURCE = "https://api.office.com/discovery/";

    private async Task<OutlookServicesClient> EnsureClientCreated() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId =
        ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;

      // create the authority by concatenating the URI added by O365 API tools in web.config 
      //  & user's tenant ID provided in the claims when the logged in
      var tenantAuthority = string.Format("{0}/{1}",
        ConfigurationManager.AppSettings["ida:AuthorizationUri"],
        TENANT_ID);

      // discover contact endpoint
      var clientCredential = new ClientCredential(CLIENT_ID, CLIENT_SECRET);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      // create auth context
      AuthenticationContext authContext = new AuthenticationContext(tenantAuthority, new Utils.NaiveSessionCache(signInUserId));

      // create O365 discovery client 
      DiscoveryClient discoveryClient = new DiscoveryClient(new Uri(DISCOVERY_ENDPOINT),
        async () => {
          var authResult = await authContext.AcquireTokenSilentAsync(DISCOVERY_RESOURCE, clientCredential, userIdentifier);

          return authResult.AccessToken;
        });

      // query discovery service for endpoint for 'calendar' endpoint
      CapabilityDiscoveryResult dcr = await discoveryClient.DiscoverCapabilityAsync("Contacts");

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
    public async Task DeleteContact(string id) {
      // acquire a O365 client to retrieve contacts
      var client = await EnsureClientCreated();

      // get the contact to be deleted
      var contact = await client.Me.Contacts.GetById(id).ExecuteAsync();

      // delete the contact
      await contact.DeleteAsync();
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
  }
}