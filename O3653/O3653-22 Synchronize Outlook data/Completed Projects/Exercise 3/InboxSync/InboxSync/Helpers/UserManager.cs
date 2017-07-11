using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using InboxSync.Models;
using InboxSync.Services;

namespace InboxSync.Helpers
{
    public class UserManager
    {
        public static async Task<User> AddOrUpdateCurrentUser()
        {
            string email = ClaimsPrincipal.Current.FindFirst("preferred_username")?.Value;
            var users = await DocumentDBRepository<User>.GetItemsAsync(u => u.Email.Equals(email));
            var user = users.FirstOrDefault();

            if (null != user)
            {
                var result = await DocumentDBRepository<User>.UpdateItemAsync(user.Id, user);
            }
            else
            {
                user = new User()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = email
                };
                await DocumentDBRepository<User>.CreateItemAsync(user);
            }

            return user;
        }
        public static async Task<long> GetUsersMessageCount(string userId)
        {
            var messageCollection = await DocumentDBRepository<Message>.GetItemsAsync(message => message.Owner.Equals(userId));

            return messageCollection.Count();
        }
        public static async Task<List<Message>> GetUsersMessages(string userId, int pageSize, int pageNum)
        {
            var messageCollection = await DocumentDBRepository<Message>.GetItemsAsync(message => message.Owner.Equals(userId));
            return messageCollection.OrderByDescending(x => x.ReceivedDateTime).Skip((pageNum - 1) * pageSize).Take(pageSize).ToList<Message>();
        }

        public static async Task SyncUsersInbox(User user)
        {
            GraphService graphService = new GraphService();
            var graphMessages = await graphService.SyncInbox();
            await ParseSyncItems(user.Id, graphMessages);
        }

        private static async Task ParseSyncItems(string userId, List<Microsoft.Graph.Message> syncItems)
        {
            List<Message> newDocumentDBMessages = new List<Message>();

            foreach (Microsoft.Graph.Message syncItem in syncItems)
            {
                var messageCollection = await DocumentDBRepository<Message>.GetItemsAsync(message => message.OutlookId.Equals(syncItem.Id));
                var existingMsg = messageCollection.FirstOrDefault();
                if (null != existingMsg)
                {
                    bool update = (syncItem.IsRead != existingMsg.IsRead);
                    if (update)
                    {
                        existingMsg.IsRead = (bool)syncItem.IsRead;
                        var updateResult = await DocumentDBRepository<Message>.UpdateItemAsync(existingMsg.Id, existingMsg);
                    }
                }
                else
                {
                    Message newMessage = new Message()
                    {
                        Id = Guid.NewGuid().ToString(),
                        BodyPreview = syncItem.BodyPreview,

                        From = new FromField
                        {
                            EmailAddress = new EmailAddress()
                            {
                                Name = syncItem.From.EmailAddress.Name,
                                Address = syncItem.From.EmailAddress.Address
                            }
                        },
                        IsRead = (bool)syncItem.IsRead,
                        OutlookId = syncItem.Id,
                        Owner = userId,
                        ReceivedDateTime = syncItem.ReceivedDateTime == null ? DateTime.Now : ((DateTimeOffset)syncItem.ReceivedDateTime).DateTime,
                        Subject = syncItem.Subject
                    };

                    newDocumentDBMessages.Add(newMessage);
                }
            }

            if (newDocumentDBMessages.Count > 0)
            {
                foreach (Message newdocumentmessage in newDocumentDBMessages)
                {
                    await DocumentDBRepository<Message>.CreateItemAsync(newdocumentmessage);
                }
            }
        }

    }
}