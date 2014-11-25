using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Office365.OAuth;
using Microsoft.Office365.Exchange;
using Microsoft.Office365.Exchange.Extensions;
using System.IO;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace ExchangeClientDemo.Models {
	public class MyMessagesRespository {

		public async Task<List<MyMessage>> GetMessages() {

			var client = await EnsureClientCreated();

			IReadOnlyQueryableSet<IMessage> messagesQuery = from message in client.Me.Inbox.Messages
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
				myMessage.From = message.From.Name;
				myMessage.HasAttachments = message.HasAttachments;

				myMessage.ToRecipients = new List<string>();
				foreach (var toRecipient in message.ToRecipients) {
					myMessage.ToRecipients.Add(toRecipient.Name);
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
			newMessage.From = existingMessage.From.Name;

			List<string> toRecipients = new List<string>();
			foreach (var toRecipient in existingMessage.ToRecipients) {
				toRecipients.Add(toRecipient.Name);
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

		public async Task SendMessage(ExchangeClientDemo.Models.MyMessage myMessage) {

			var client = await EnsureClientCreated();

			var newMessage = new Microsoft.Office365.Exchange.Message();
			newMessage.Subject = myMessage.Subject;
			newMessage.ToRecipients.Add( new Recipient {	Address = myMessage.From,	Name = "Teddy P"});
			newMessage.Body = new ItemBody {
				ContentType = BodyType.Text,
				Content = myMessage.Body
			};

			await client.Me.Messages.AddMessageAsync(newMessage);

			//await newMessage.SendAsync();

		}

    private async Task<ExchangeClient> EnsureClientCreated() {
      
      // get or create DiscoveryContext
      DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;
      if (disco == null) {
        disco = await DiscoveryContext.CreateAsync();
        SaveInCache("DiscoveryContext", disco);
      }

      // obtain ResourceDiscoveryResult for Exchange
      string ServiceResourceId = "https://outlook.office365.com";
      ResourceDiscoveryResult dcr = await disco.DiscoverResourceAsync(ServiceResourceId);
      SaveInCache("LastLoggedInUser", dcr.UserId);
      string clientId = disco.AppIdentity.ClientId;
      string clientSecret = disco.AppIdentity.ClientSecret;
      Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");
          
      // create ExchangeClient object with callback function for obtaining access token
      ExchangeClient exchangeClient = new ExchangeClient(ServiceEndpointUri, async () => {        
        AuthenticationContext authContext = disco.AuthenticationContext;
        ClientCredential creds = new ClientCredential(clientId, clientSecret);
        UserIdentifier userId = new UserIdentifier(dcr.UserId, UserIdentifierType.UniqueId);
        // execute call across network to acquire access token
        AuthenticationResult authResult = 
          await authContext.AcquireTokenSilentAsync(ServiceResourceId, creds, userId);       
        // return access token to caller as string value
        return authResult.AccessToken;
      });

      // return new ExchangeClient to caller
      return exchangeClient;
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