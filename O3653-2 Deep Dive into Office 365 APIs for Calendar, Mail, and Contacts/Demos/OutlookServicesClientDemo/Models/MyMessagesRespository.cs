using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.OutlookServices;
using Microsoft.Office365.OutlookServices.Extensions;
using System.IO;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace OutlookServicesClientDemo.Models {
  public class MyMessagesRespository {
    private static string CLIENT_ID = ConfigurationManager.AppSettings["ida:ClientID"];
    private static string CLIENT_SECRET = ConfigurationManager.AppSettings["ida:Password"];
    private static string TENANT_ID = ConfigurationManager.AppSettings["tenantId"];
    const string DISCOVERY_ENDPOINT = "https://api.office.com/discovery/v1.0/me/";
    const string DISCOVERY_RESOURCE = "https://api.office.com/discovery/";

    public async Task<List<MyMessage>> GetMessages() {

      var client = await EnsureClientCreated();

      IReadOnlyQueryableSet<IMessage> messagesQuery = from message in client.Me.Messages
                                                      orderby message.DateTimeSent descending
                                                      select message;

      IPagedCollection<IMessage> messagesResults = await (messagesQuery).ExecuteAsync();
      IReadOnlyList<IMessage> messages = messagesResults.CurrentPage;

      List<MyMessage> messageList = new List<MyMessage>();

      foreach (IMessage message in messages) {
        MyMessage myMessage = new MyMessage();
        myMessage.Id = message.Id;
        myMessage.Subject = message.Subject;
        myMessage.DateTimeReceived = message.DateTimeReceived;
        myMessage.FromName = message.From.EmailAddress.Name;
        myMessage.FromEmailAddress = message.From.EmailAddress.Address;
        myMessage.HasAttachments = message.HasAttachments;

        myMessage.ToRecipients = new List<string>();
        foreach (var toRecipient in message.ToRecipients) {
          myMessage.ToRecipients.Add(toRecipient.EmailAddress.Address);
        }

        messageList.Add(myMessage);
      }
      return messageList;
    }

    public async Task<MyMessage> GetMessage(string id) {
      var client = await EnsureClientCreated();
      var existingMessage = await client.Me.Messages.GetById(id).ExecuteAsync();

      MyMessage newMessage = new MyMessage();
      newMessage.Id = existingMessage.Id;
      newMessage.ConversationId = existingMessage.ConversationId;
      newMessage.Subject = existingMessage.Subject;
      newMessage.DateTimeSent = existingMessage.DateTimeSent;
      newMessage.DateTimeReceived = existingMessage.DateTimeReceived;
      newMessage.FromName = existingMessage.From.EmailAddress.Name;
      newMessage.FromEmailAddress = existingMessage.From.EmailAddress.Address;

      List<string> toRecipients = new List<string>();
      foreach (var toRecipient in existingMessage.ToRecipients) {
        toRecipients.Add(toRecipient.EmailAddress.Address);
      }
      newMessage.ToRecipients = toRecipients;

      newMessage.HasAttachments = existingMessage.HasAttachments;


      if (existingMessage.Body.Content != null) {
        newMessage.Body = existingMessage.Body.Content;
      }

      return newMessage;
    }

    public async Task DeleteMessage(string id) {
      var client = await EnsureClientCreated();
      var myMessage = await client.Me.Messages.GetById(id).ExecuteAsync();
      await myMessage.DeleteAsync();
    }

    public async Task SendMessage(MyMessage myMessage) {

      var client = await EnsureClientCreated();

      var newMessage = new Message();
      newMessage.Subject = myMessage.Subject;

      var email = new EmailAddress {
        Name = "John Doe",
        Address = myMessage.FromEmailAddress
      };

      newMessage.ToRecipients.Add(new Recipient { EmailAddress = email });
      newMessage.Body = new ItemBody {
        ContentType = BodyType.Text,
        Content = myMessage.Body
      };

      await client.Me.Messages.AddMessageAsync(newMessage);

      await newMessage.SendAsync();
    }

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
      CapabilityDiscoveryResult dcr = await discoveryClient.DiscoverCapabilityAsync("Mail");

      // create an OutlookServicesclient
      return new OutlookServicesClient(dcr.ServiceEndpointUri,
        async () => {
          var authResult =
            await
              authContext.AcquireTokenSilentAsync(dcr.ServiceResourceId, clientCredential, userIdentifier);
          return authResult.AccessToken;
        });
    }
  }
}