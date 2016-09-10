using Microsoft.Graph;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Office365Mail.Util;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Office365Mail.Models
{
    public class MyMessagesRespository
    {
        private async Task<string> GetGraphAccessTokenAsync()
        {
            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

            var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureAdAuthority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(SettingsHelper.AzureAdGraphResourceURL, clientCredential, userIdentifier);
            return result.AccessToken;
        }

        private async Task<GraphServiceClient> GetGraphServiceAsync()
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var graphserviceClient = new GraphServiceClient(SettingsHelper.GraphResourceUrl,
                                          new DelegateAuthenticationProvider(
                                                        (requestMessage) =>
                                                        {
                                                            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                                                            return Task.FromResult(0);
                                                        }));
            return graphserviceClient;
        }

        public async Task<List<MyMessage>> GetMessages(int pageIndex, int pageSize)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();

                var requestMessages = await graphServiceClient.Me.Messages.Request().Top(pageSize).Skip(pageIndex * pageSize).GetAsync();

                var MessagesResults = requestMessages.CurrentPage.Select(x => new MyMessage
                {
                    Id = x.Id,
                    Subject = x.Subject,
                    DateTimeReceived = x.ReceivedDateTime,
                    FromName = x.From != null ? x.From.EmailAddress.Name : string.Empty,
                    FromEmailAddress = x.From != null ? x.From.EmailAddress.Address : string.Empty,
                    ToName = x.ToRecipients != null && x.ToRecipients.Count() > 0 ? x.ToRecipients.ElementAt(0).EmailAddress.Name : string.Empty,
                    ToEmailAddress = x.ToRecipients != null && x.ToRecipients.Count() > 0 ? x.ToRecipients.ElementAt(0).EmailAddress.Address : string.Empty
                }).ToList();

                return MessagesResults;
            }
            catch
            {
                throw;
            }
        }
        public async Task<MyMessage> GetMessage(string id)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();

                var requestMessage = await graphServiceClient.Me.Messages[id].Request().GetAsync();

                var messageResult = new MyMessage
                {
                    Id = requestMessage.Id,
                    Subject = requestMessage.Subject,
                    Body = requestMessage.Body.Content,
                    DateTimeReceived = requestMessage.ReceivedDateTime,
                    DateTimeSent = requestMessage.SentDateTime,
                    FromName = requestMessage.From != null ? requestMessage.From.EmailAddress.Name : string.Empty,
                    FromEmailAddress = requestMessage.From != null ? requestMessage.From.EmailAddress.Address : string.Empty,
                    ToName = requestMessage.ToRecipients != null && requestMessage.ToRecipients.Count() > 0 ?
                        requestMessage.ToRecipients.ElementAt(0).EmailAddress.Name :
                        string.Empty,
                    ToEmailAddress = requestMessage.ToRecipients != null && requestMessage.ToRecipients.Count() > 0 ?
                        requestMessage.ToRecipients.ElementAt(0).EmailAddress.Address :
                        string.Empty
                };

                return messageResult;
            }
            catch
            {
                throw;
            }
        }
        public async Task DeleteMessage(string id)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();

                await graphServiceClient.Me.Messages[id].Request().DeleteAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task SendMessage(MyMessage myMessage)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();

                var to = new Recipient
                {
                    EmailAddress = new EmailAddress
                    {
                        Name = myMessage.ToName,
                        Address = myMessage.ToEmailAddress
                    }
                };

                var Message = new Message
                {
                    Subject = myMessage.Subject,
                    Body = new ItemBody
                    {
                        Content = myMessage.Body,
                        ContentType = BodyType.Text
                    },
                    ToRecipients = new List<Recipient> { to }
                };
                await graphServiceClient.Me.SendMail(Message).Request().PostAsync();
            }
            catch
            {
                throw;
            }
        }
    }
}