using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Text;
using System.Drawing;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Configuration;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Microsoft.Graph;


namespace Office365Group.Models
{
    public class GroupRespository
    {
        public static string GraphResourceUrl = "https://graph.microsoft.com/V1.0";

        public static async Task<GraphServiceClient> GetGraphServiceAsync()
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var graphserviceClient = new GraphServiceClient(GraphResourceUrl,
                                          new DelegateAuthenticationProvider(
                                                        (requestMessage) =>
                                                        {
                                                            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                                                            return Task.FromResult(0);
                                                        }));
            return graphserviceClient;
        }
        public static async Task<string> GetGraphAccessTokenAsync()
        {
            string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
            string appKey = ConfigurationManager.AppSettings["ida:ClientSecret"];
            string redirectUri = ConfigurationManager.AppSettings["ida:PostLogoutRedirectUri"];
            string[] scopes = {
                "https://graph.microsoft.com/Directory.Read.All",
                "https://graph.microsoft.com/Group.ReadWrite.All"
            };

            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            ConfidentialClientApplication cca = new ConfidentialClientApplication(clientId, redirectUri, new ClientCredential(appKey), new MSALTokenCache(signInUserId));
            var result = await cca.AcquireTokenSilentAsync(scopes);
            return result.Token;
        }


        private static string FormatBytes(long bytes)
        {
            string[] Suffix = { "B", "KB", "MB", "GB", "TB" };
            int i;
            double dblSByte = bytes;
            for (i = 0; i < Suffix.Length && bytes >= 1024; i++, bytes /= 1024)
            {
                dblSByte = bytes / 1024.0;
            }

            return String.Format("{0:0.##} {1}", dblSByte, Suffix[i]);
        }


        public async Task<UserModel> GetMe()
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var me = await graphServiceClient.Me.Request().GetAsync();
            UserModel myModel = new UserModel()
            {
                Id = me.Id,
                displayName = me.DisplayName,
                givenName = me.GivenName,
                mail = me.Mail,
                mobilePhone = me.MobilePhone
            };
            return myModel;
        }

        public async Task<List<GroupModel>> GetMyOrganizationGroups()
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups.Request().Filter("securityEnabled eq false").Select("id,displayName");
            var allGroups = new List<GroupModel>();
            do
            {
                var groups = await request.GetAsync();
                allGroups.AddRange(groups.CurrentPage.Select(x => new GroupModel() { Id = x.Id, displayName = x.DisplayName }).ToList());
                request = groups.NextPageRequest;
            } while (request != null);
            return allGroups;
        }

        public async Task<List<GroupModel>> GetJoinedGroups()
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Me.MemberOf.Request();
            var allGroups = new List<GroupModel>();
            do
            {
                var groups = await request.GetAsync();
                allGroups.AddRange(groups.CurrentPage.Where(x => x.ODataType == "#microsoft.graph.group").Select(x => new GroupModel() { Id = x.Id, displayName = (x as Group).DisplayName }).ToList());
                request = groups.NextPageRequest;
            } while (request != null);
            return allGroups;
        }
        public async Task<List<GroupModel>> SearchGroupByName(string groupName)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups.Request().Filter(string.Format("startswith(displayName,'{0}')", groupName)).Select("id,displayName");
            var allGroups = new List<GroupModel>();
            do
            {
                var groups = await request.GetAsync();
                allGroups.AddRange(groups.CurrentPage.Select(x => new GroupModel() { Id = x.Id, displayName = x.DisplayName }).ToList());
                request = groups.NextPageRequest;
            } while (request != null);

            return allGroups;
        }

        public async Task<List<UserModel>> GetGroupMembers(string id)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups[id].Members.Request();
            var allMembers = new List<UserModel>();
            do
            {
                var members = await request.GetAsync();
                allMembers.AddRange(members.CurrentPage.Where(x => x.ODataType == "#microsoft.graph.user").Select(x => x as Microsoft.Graph.User).Select(x => new UserModel
                {
                    Id = x.Id,
                    displayName = x.DisplayName,
                    givenName = x.GivenName,
                    mail = x.Mail,
                    mobilePhone = x.MobilePhone
                }).ToList());
                request = members.NextPageRequest;
            } while (request != null);
            return allMembers;
        }

        public async Task<Microsoft.Graph.User> AddGroupMember(string groupId, string newMemberEmail)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var user = await graphServiceClient.Users[newMemberEmail].Request().GetAsync();
            if (user != null)
            {
                await graphServiceClient.Groups[groupId].Members.References.Request().AddAsync(user);
            }
            return user;
        }

        public async Task<List<ConversationModel>> GetGroupConversations(string id)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups[id].Conversations.Request().Select("id,topic,preview,lastDeliveredDateTime");
            var allConversations = new List<ConversationModel>();
            do
            {
                var conversations = await request.GetAsync();
                allConversations.AddRange(conversations.CurrentPage.Select(x => new ConversationModel
                {
                    Id = x.Id,
                    topic = x.Topic,
                    preview = x.Preview,
                    lastDeliveredDateTime = x.LastDeliveredDateTime
                }).ToList());
                request = conversations.NextPageRequest;
            } while (request != null);
            return allConversations;
        }

        public async Task<Conversation> AddGroupConversation(string groupId, string topic, string message)
        {
            // Build the conversation
            Conversation conversation = new Conversation()
            {
                Topic = topic,
                // Conversations have threads
                Threads = new ConversationThreadsCollectionPage()
            };
            conversation.Threads.Add(new ConversationThread()
            {
                // Threads contain posts
                Posts = new ConversationThreadPostsCollectionPage()
            });
            conversation.Threads[0].Posts.Add(new Post()
            {
                // Posts contain the actual content
                Body = new ItemBody() { Content = message, ContentType = BodyType.Text }
            });

            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups[groupId].Conversations.Request();
            return await request.AddAsync(conversation);
        }

        public async Task<List<ThreadModel>> GetGroupThreads(string id)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups[id].Threads.Request().Select("id,topic,preview,lastDeliveredDateTime");
            var allThreads = new List<ThreadModel>();
            do
            {
                var threads = await request.GetAsync();
                allThreads.AddRange(threads.CurrentPage.Select(x => new ThreadModel
                {
                    Id = x.Id,
                    topic = x.Topic,
                    preview = x.Preview,
                    lastDeliveredDateTime = x.LastDeliveredDateTime
                }).ToList());
                request = threads.NextPageRequest;
            } while (request != null);
            return allThreads;
        }

        public async Task<ConversationThread> AddGroupThread(string groupId, string topic, string message)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var thread = new ConversationThread()
            {
                Topic = topic,
                // Threads contain posts
                Posts = new ConversationThreadPostsCollectionPage()
            };
            thread.Posts.Add(new Post()
            {
                Body = new ItemBody() { Content = message, ContentType = BodyType.Text }
            });
            return await graphServiceClient.Groups[groupId].Threads.Request().AddAsync(thread);
        }

        public async Task<List<PostModel>> GetGroupThreadPosts(string groupId, string threadId)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups[groupId].Threads[threadId].Posts.Request().Select("body,from,sender");
            var allPosts = new List<PostModel>();
            do
            {
                var posts = await request.GetAsync();
                allPosts.AddRange(posts.CurrentPage.Select(x => new PostModel
                {
                    content = x.Body.Content,
                    fromEmailAddress = x.From.EmailAddress.Address,
                    senderEmailAddress = x.Sender.EmailAddress.Address
                }).ToList());
                request = posts.NextPageRequest;
            } while (request != null);
            return allPosts;
        }

        public async Task<List<EventModel>> GetGroupEvents(string groupId)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups[groupId].Events.Request().Select("subject,bodyPreview,start,end,webLink");
            var allEvents = new List<EventModel>();
            do
            {
                var events = await request.GetAsync();
                allEvents.AddRange(events.CurrentPage.Select(x => new EventModel
                {
                    subject = x.Subject,
                    bodyPreview = x.BodyPreview,
                    webLink = x.WebLink,
                    start = DateTime.SpecifyKind(DateTime.Parse(x.Start.DateTime), x.Start.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                    end = DateTime.SpecifyKind(DateTime.Parse(x.End.DateTime), x.End.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local)
                }).ToList());
                request = events.NextPageRequest;
            } while (request != null);
            return allEvents;
        }

        public async Task<Event> AddGroupEvent(string groupId, string subject, string start, string end, string location)
        {

            var graphServiceClient = await GetGraphServiceAsync();
            return await graphServiceClient.Groups[groupId].Events.Request().AddAsync(new Event()
            {
                Subject = subject,
                Start = new DateTimeTimeZone() { DateTime = start, TimeZone = "UTC" },
                End = new DateTimeTimeZone() { DateTime = end, TimeZone = "UTC" },
                Location = new Location() { DisplayName = location }
            });
        }

        public async Task<List<FileModel>> GetGroupFiles(string groupId)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups[groupId].Drive.Root.Children.Request().Select("name,webUrl,lastModifiedDateTime,size");
            var allFiles = new List<FileModel>();
            do
            {
                var files = await request.GetAsync();
                allFiles.AddRange(files.CurrentPage.Select(x => new FileModel
                {
                    name = x.Name,
                    webLink = x.WebUrl,
                    lastModifiedDateTime = x.LastModifiedDateTime,
                    size = FormatBytes((long)x.Size)
                }).ToList());
                request = files.NextPageRequest;
            } while (request != null);
            return allFiles;
        }

        public async Task<DriveItem> AddGroupFile(string groupId, string fileName, Stream stream)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            return await graphServiceClient.Groups[groupId].Drive.Root.Children[fileName].Content.Request().PutAsync<DriveItem>(stream);
        }

        public async Task<Stream> GetGroupPhoto(string groupId)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            return await graphServiceClient.Groups[groupId].Photo.Content.Request().GetAsync();
        }

        public async Task<string> CreateGroup(string groupName, string groupAlias)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = graphServiceClient.Groups.Request();

            // Initialize a new group
            Group newGroup = new Group()
            {
                DisplayName = groupName,
                // The group's email will be set as <groupAlias>@<yourdomain>
                MailNickname = groupAlias,
                MailEnabled = true,
                SecurityEnabled = false,
                GroupTypes = new List<string>() { "Unified" }
            };

            Group createdGroup = await request.AddAsync(newGroup);
            return createdGroup.Id;
        }
    }
}