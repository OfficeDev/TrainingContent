using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Office365.OAuth;
using Microsoft.Office365.Exchange;
using System.IO;
using System.Threading.Tasks;

namespace ExchangeClientDemo.Models {
    public class MyMessagesRespository {

        public async Task<List<MyMessage>> GetMessages() {

            var client = await EnsureClientCreated();

            var messagesResults = await (from i in client.Me.Inbox.Messages
                                        orderby i.DateTimeSent descending
                                        select i).ExecuteAsync();

            var messages = messagesResults.CurrentPage.OrderBy(e => e.DateTimeReceived);

            var messageList = new List<MyMessage>();

            foreach (var message in messages) {
                MyMessage myMessage = new MyMessage();
                myMessage.Id = message.Id;
                myMessage.ConversationId = message.ConversationId;                
                myMessage.Subject = message.Subject;
                myMessage.DateTimeReceived = message.DateTimeReceived;
                myMessage.From = message.From.Name;

                List<string> toRecipients = new List<string>();
                foreach (var toRecipient in message.ToRecipients) {
                    toRecipients.Add(toRecipient.Name);
                }
                myMessage.ToRecipients = toRecipients;

                myMessage.HasAttachments = message.HasAttachments;
                
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


            var newMessage = new Microsoft.Office365.Exchange.Message {
                Subject = myMessage.Subject,
                From = new Recipient() { Address = myMessage.From },
                ToRecipients = new List<Recipient>(){
                    new Recipient {
                        Address = myMessage.ToRecipients[0],
                        Name = "Teddy P"}
                },
                Body = new ItemBody() { Content = myMessage.Body },               
            };
            
            await newMessage.SendAsync();
            
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