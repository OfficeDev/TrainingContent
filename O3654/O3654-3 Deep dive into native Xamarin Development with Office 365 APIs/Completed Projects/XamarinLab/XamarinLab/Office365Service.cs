using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Android.Content;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.Exchange;
using XamarinLab.Model;

namespace XamarinLab {

  public static class Office365Service {

    static ExchangeClient exchangeClient;
    static string userId;

    const string ExchangeResourceId = "https://outlook.office365.com";
    const string ExchangeServiceRoot = "https://outlook.office365.com/ews/odata";

    public static async Task EnsureClientCreated(Context context) {
      Authenticator authenticator = new Authenticator(context);
      var authInfo = await authenticator.AuthenticateAsync(ExchangeResourceId);
      userId = authInfo.IdToken.UPN;
      exchangeClient = new ExchangeClient(new Uri(ExchangeServiceRoot), authInfo.GetAccessToken);
    }

    public static void SignOut(Context context) {
      new Authenticator(context).ClearCache();
    }

    public static async Task<IEnumerable<IContact>> GetContacts() {
      var contactsResults = await exchangeClient.Me.Contacts.OrderBy(c => c.Surname).ExecuteAsync();
      return contactsResults.CurrentPage;
    }

    public static async Task<IContact> GetContact(string contactId) {
      var contact = await exchangeClient.Me.Contacts.Where(c => c.Id == contactId).ExecuteSingleAsync();
      return contact;
    }

    public static async Task<List<MyContact>> GetMyContacts() {
      List<MyContact> contactItems = new List<MyContact>();
      var contacts = await GetContacts();
      if (contacts != null) {
        foreach (var contact in contacts) {
          contactItems.Add(new MyContact() {
            Id = contact.Id,
            Name = contact.DisplayName,
            Email = contact.EmailAddress1
          });
        }
      }
      return contactItems;
    }
  }
}
