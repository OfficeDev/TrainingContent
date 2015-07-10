using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OutlookServices;
using Microsoft.Office365.OutlookServices.Extensions;
using System.IO;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Office365Mail.Utils;

namespace Office365Mail.Models {
  public class MyMessagesRespository {

    public bool MorePagesAvailable { get; private set; }

    public async Task<List<MyMessage>> GetMessages(int pageIndex, int pageSize) {

      var client = await EnsureClientCreated();

      var messageResults = await (from message in client.Me.Messages
                                  orderby message.DateTimeSent descending
                                  select message)
                                .Skip(pageIndex * pageSize)
                                .Take(pageSize)
                                .ExecuteAsync();

      MorePagesAvailable = messageResults.MorePagesAvailable;

      var messageList = new List<MyMessage>();

      foreach (IMessage message in messageResults.CurrentPage) {
        var myMessage = new MyMessage {
          Id = message.Id,
          Subject = message.Subject,
          DateTimeReceived = message.DateTimeReceived,
          FromName = message.From.EmailAddress.Name,
          FromEmailAddress = message.From.EmailAddress.Address,
          ToName = message.ToRecipients[0].EmailAddress.Name,
          ToEmailAddress= message.ToRecipients[0].EmailAddress.Address,
          HasAttachments = message.HasAttachments
        };

        messageList.Add(myMessage);
      }
      return messageList;
    }

    public async Task<MyMessage> GetMessage(string id) {
      var client = await EnsureClientCreated();
      var existingMessage = await client.Me.Messages.GetById(id).ExecuteAsync();

      var newMessage = new MyMessage {
        Id = existingMessage.Id,
        ConversationId = existingMessage.ConversationId,
        Subject = existingMessage.Subject,
        DateTimeSent = existingMessage.DateTimeSent,
        DateTimeReceived = existingMessage.DateTimeReceived,
        FromName = existingMessage.From.EmailAddress.Name,
        FromEmailAddress = existingMessage.From.EmailAddress.Address,
        Body = existingMessage.Body.Content ?? string.Empty,
        HasAttachments = existingMessage.HasAttachments,
        ToName = existingMessage.ToRecipients[0].EmailAddress.Name,
        ToEmailAddress = existingMessage.ToRecipients[0].EmailAddress.Address
      };

      return newMessage;
    }

    public async Task DeleteMessage(string id) {
      var client = await EnsureClientCreated();
      
      var myMessage = await client.Me.Messages.GetById(id).ExecuteAsync();
      
      await myMessage.DeleteAsync();
    }

    public async Task SendMessage(MyMessage myMessage) {

      var client = await EnsureClientCreated();

      var newMessage = new Message {Subject = myMessage.Subject};

      var email = new EmailAddress {
        Name = myMessage.ToName,
        Address = myMessage.ToEmailAddress
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
      CapabilityDiscoveryResult dcr = await discovery.DiscoverCapabilityAsync("Mail");

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