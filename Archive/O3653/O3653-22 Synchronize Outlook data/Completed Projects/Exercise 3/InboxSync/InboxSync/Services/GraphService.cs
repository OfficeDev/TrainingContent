using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using InboxSync.Helpers;

namespace InboxSync.Services
{
    public class GraphService
    {
        public async Task<List<Message>> SyncInbox()
        {
            GraphServiceClient graphClient = SDKHelper.GetAuthenticatedClient();
            List<Message> messagesCollection = new List<Message>();
            IMailFolderMessagesCollectionRequest nextRequest = null;
            do
            {
                IMailFolderMessagesCollectionPage messagesCollectionPage;
                if (nextRequest != null)
                {
                    messagesCollectionPage = await nextRequest.GetAsync();
                }
                else
                {
                    messagesCollectionPage = await graphClient.Me.MailFolders.Inbox.Messages.Request()
                                                              .Select("Subject,ReceivedDateTime,From,BodyPreview,IsRead")
                                                              .OrderBy("ReceivedDateTime+desc")
                                                              .Filter("ReceivedDateTime ge " + DateTime.Now.AddDays(-7).ToString("yyyy-MM-ddTHH:mm:ssZ")).GetAsync();
                }
                messagesCollection.AddRange(messagesCollectionPage.CurrentPage);
                if (messagesCollectionPage.CurrentPage.Count == 0)
                {
                    nextRequest = null;
                }
                else
                {
                    nextRequest = messagesCollectionPage.NextPageRequest;
                }
            }
            while (nextRequest != null);
            return messagesCollection;
        }
    }
}