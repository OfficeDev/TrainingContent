using Android.Content;
using Android.Graphics;
using Microsoft.Office365.ActiveDirectory;
using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace O365ContactsSample {
  
  public static class Office365Service {
  
    static AadGraphClient _adClient;
    static ExchangeClient _exchangeClient;
    static string _strUserId;

    const string ExchangeResourceId = "https://outlook.office365.com";
    const string ExchangeServiceRoot = "https://outlook.office365.com/ews/odata";
    const string AdServiceResourceId = "https://graph.windows.net/";

    public static async Task EnsureClientCreated(Context context) {
      
      Authenticator authenticator = new Authenticator(context);
      var authInfo = await authenticator.AuthenticateAsync(ExchangeResourceId);
      
      _strUserId = authInfo.IdToken.UPN;
      _exchangeClient = new ExchangeClient(new Uri(ExchangeServiceRoot), authInfo.GetAccessToken);
      
      var adAuthInfo = await authInfo.ReauthenticateAsync(AdServiceResourceId);
      _adClient = new AadGraphClient(new Uri("https://graph.windows.net/" + authInfo.IdToken.TenantId), 
                                     adAuthInfo.GetAccessToken);
    }

    public static void SignOut(Context context) {
      new Authenticator(context).ClearCache();
    }


    public static async Task<IEnumerable<Microsoft.Office365.Exchange.IContact>> GetContacts() {
      var contactsResults = await _exchangeClient.Me.Contacts.OrderBy(c => c.DisplayName).ExecuteAsync();
      return contactsResults.CurrentPage;
    }

    public static async Task<Microsoft.Office365.Exchange.IContact> GetContact(string strContactId) {
      var contact = await _exchangeClient.Me.Contacts.Where(c => c.Id == strContactId).ExecuteSingleAsync();
      return contact;
    }

    public static async Task<List<MyContact>> GetMyContacts() {
      List<MyContact> _myContactItems = new List<MyContact>();
      var contacts = await GetContacts();
      if (contacts != null) {
        foreach (var contact in contacts) {
          _myContactItems.Add(new MyContact() {
            Id = contact.Id,
            Name = contact.DisplayName,
            Email = contact.EmailAddress1
          });
        }
      }
      return _myContactItems;
    }


    public static async Task<byte[]> GetContactPicture(string strContactId) {
      byte[] bytesContactPhoto = new byte[0];
      var contact = await _exchangeClient.Me.Contacts[strContactId].ExecuteAsync();
      var attachmentResult = await ((Microsoft.Office365.Exchange.IContactFetcher)contact).Attachments.ExecuteAsync();
      var attachments = attachmentResult.CurrentPage.ToArray();
      var contactPhotoAttachment = attachments.OfType<IFileAttachment>().FirstOrDefault(a => a.IsContactPhoto);
      if (contactPhotoAttachment != null) {
        bytesContactPhoto = contactPhotoAttachment.ContentBytes;
      }
      return bytesContactPhoto;
    }

    public static async Task<Bitmap> GetUserProfilePicture(MyContact contact) {
      Bitmap bitmap = null;
      var users = await _adClient
                                .DirectoryObjects.OfType<Microsoft.Office365.ActiveDirectory.IUser>()
                                .Where(i => i.Mail == contact.Email)
                                .ExecuteAsync();
      foreach (var user in users.CurrentPage) {
        if (user != null && user.ThumbnailPhoto != null) {
          using (var stream = (await user.ThumbnailPhoto.DownloadAsync()).Stream) {
            bitmap = await BitmapFactory.DecodeStreamAsync(stream);
            return bitmap;
          }
        }
      }
      return bitmap;
    }

    public static async Task<Microsoft.Office365.ActiveDirectory.IUser> GetUser(string strUserMail) {
      var user = await _adClient
                              .DirectoryObjects.OfType<Microsoft.Office365.ActiveDirectory.IUser>()
                              .Where(i => i.Mail == strUserMail)
                              .ExecuteSingleAsync();
      return user;
    }

  }
}
