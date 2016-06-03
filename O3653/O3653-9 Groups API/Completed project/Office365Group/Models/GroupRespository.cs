using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Graph;


namespace Office365Group.Models
{
    public class GroupRespository
    {
        public static string GraphResourceUrl = "https://graph.microsoft.com/V1.0";
        public static string TenantId = ConfigurationManager.AppSettings["ida:TenantId"];

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
            var AzureAdGraphResourceURL = "https://graph.microsoft.com/";
            var Authority = ConfigurationManager.AppSettings["ida:AADInstance"] + ConfigurationManager.AppSettings["ida:TenantId"];
            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            var clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ida:ClientId"], ConfigurationManager.AppSettings["ida:ClientSecret"]);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);
            AuthenticationContext authContext = new AuthenticationContext(Authority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(AzureAdGraphResourceURL, clientCredential, userIdentifier);
            return result.AccessToken;
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
            var groups = await graphServiceClient.Groups.Request().Filter("securityEnabled eq false").Select("id,displayName").GetAsync();
            var allGroup = groups.CurrentPage.Select(x => new GroupModel() { Id = x.Id, displayName = x.DisplayName }).ToList();
            return allGroup;
        }

        public async Task<List<GroupModel>> GetJoinedGroups()
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var groups = await graphServiceClient.Me.MemberOf.Request().GetAsync();
            var allGroup = groups.CurrentPage.Where(x => x.ODataType == "#microsoft.graph.group")
                           .Select(x => new GroupModel() { Id = x.Id, displayName = (x as Group).DisplayName }).ToList();
            return allGroup;
        }
        public async Task<List<GroupModel>> SearchGroupByName(string groupName)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var groups = await graphServiceClient.Groups.Request().Filter(string.Format("startswith(displayName,'{0}')", groupName))
                               .Select("id,displayName").GetAsync();
            var allGroup = groups.CurrentPage.Select(x => new GroupModel() { Id = x.Id, displayName = x.DisplayName }).ToList();
            return allGroup;
        }

        public async Task<List<ConversationModel>> GetGroupConversations(string id)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = await graphServiceClient.Groups[id].Conversations.Request().
                              Select("id,topic,preview,lastDeliveredDateTime").GetAsync();
            var retConversations = request.CurrentPage.Select(x => new ConversationModel
            {
                Id = x.Id,
                topic = x.Topic,
                preview = x.Preview,
                lastDeliveredDateTime = x.LastDeliveredDateTime
            }).ToList();
            return retConversations;
        }

        public async Task<List<ThreadModel>> GetGroupThreads(string id)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = await graphServiceClient.Groups[id].Threads.Request().
                              Select("id,topic,preview,lastDeliveredDateTime").GetAsync();
            var retThreads = request.CurrentPage.Select(x => new ThreadModel
            {
                Id = x.Id,
                topic = x.Topic,
                preview = x.Preview,
                lastDeliveredDateTime = x.LastDeliveredDateTime
            }).ToList();
            return retThreads;
        }
        public async Task<List<PostModel>> GetGroupThreadPosts(string groupId, string threadId)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = await graphServiceClient.Groups[groupId].Threads[threadId].Posts.Request().
                              Select("body,from,sender").GetAsync();
            var retPosts = request.CurrentPage.Select(x => new PostModel
            {
               content = x.Body.Content,
               fromEmailAddress = x.From.EmailAddress.Address,
               senderEmailAddress = x.Sender.EmailAddress.Address
            }).ToList();
            return retPosts;
        }

        public async Task<List<EventModel>> GetGroupEvents(string groupId)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = await graphServiceClient.Groups[groupId].Events.Request().
                              Select("subject,bodyPreview,start,end,webLink").GetAsync();
            var retEvents = request.CurrentPage.Select(x => new EventModel
            {
                subject = x.Subject,
                bodyPreview = x.BodyPreview,
                webLink = x.WebLink,
                start = DateTime.SpecifyKind(DateTime.Parse(x.Start.DateTime), x.Start.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                end = DateTime.SpecifyKind(DateTime.Parse(x.End.DateTime), x.End.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local)

            }).ToList();
            return retEvents;
        }
        public async Task<List<FileModel>> GetGroupFiles(string groupId)
        {
            var graphServiceClient = await GetGraphServiceAsync();
            var request = await graphServiceClient.Groups[groupId].Drive.Root.Children.Request().Select("name,webUrl,lastModifiedDateTime,size").GetAsync();
            var retFiles = request.CurrentPage.Select(x => new FileModel
            {
                name = x.Name,
                webLink = x.WebUrl,
                lastModifiedDateTime = x.LastModifiedDateTime,
                size = FormatBytes((long)x.Size)
            }).ToList();
            return retFiles;
        }
    }
}