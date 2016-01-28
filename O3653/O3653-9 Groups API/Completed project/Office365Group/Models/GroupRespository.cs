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
using Office365Group.Util;


namespace Office365Group.Models
{
    public class GroupRespository
    {
        private string GraphResourceUrl = "https://graph.microsoft.com/V1.0";
        private string GraphBetaResourceUrl = "https://graph.microsoft.com/beta";

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

        public static async Task<string> GetJsonAsync(string url)
        {
            string accessToken = await GetGraphAccessTokenAsync();
            using (HttpClient client = new HttpClient())
            {
                var accept = "application/json";
                client.DefaultRequestHeaders.Add("Accept", accept);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.GetAsync(url))
                {
                    if (response.IsSuccessStatusCode)
                        return await response.Content.ReadAsStringAsync();
                    return null;
                }
            }
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
            UserModel me = null;
            string restURL = string.Format("{0}/me", GraphResourceUrl);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString);
                me = new UserModel
                {
                    displayName = jsonresult["displayName"].IsNullOrEmpty() ? string.Empty : jsonresult["displayName"].ToString(),
                    givenName = jsonresult["givenName"].IsNullOrEmpty() ? string.Empty : jsonresult["givenName"].ToString(),
                    mail = jsonresult["mail"].IsNullOrEmpty() ? string.Empty : jsonresult["mail"].ToString(),
                    mobilePhone = jsonresult["mobilePhone"].IsNullOrEmpty() ? string.Empty : jsonresult["mobilePhone"].ToString(),
                };
            }
            return me;
        }

        public async Task<List<GroupModel>> GetMyOrganizationGroups()
        {
            var allGroup = new List<GroupModel>();
            string restURL = string.Format("{0}/myorganization/groups?$select=id,displayName", GraphResourceUrl);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString)["value"];
                foreach (var item in jsonresult)
                {
                    var group = new GroupModel
                    {
                        Id = item["id"].IsNullOrEmpty() ? string.Empty : item["id"].ToString(),
                        displayName = item["displayName"].IsNullOrEmpty() ? string.Empty : item["displayName"].ToString()
                    };
                    allGroup.Add(group);
                }
            }
            return allGroup;
        }

        public async Task<List<GroupModel>> GetJoinedGroups()
        {
            var allGroup = new List<GroupModel>();
            string restURL = string.Format("{0}/me/joinedGroups?$select=id,displayName", GraphBetaResourceUrl);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString)["value"];
                foreach (var item in jsonresult)
                {
                    var group = new GroupModel
                    {
                        Id = item["id"].IsNullOrEmpty() ? string.Empty : item["id"].ToString(),
                        displayName = item["displayName"].IsNullOrEmpty() ? string.Empty : item["displayName"].ToString()
                    };
                    allGroup.Add(group);
                }
            }
            return allGroup;
        }
        public async Task<List<GroupModel>> SearchGoupByName(string groupName)
        {
            var allGroup = new List<GroupModel>();
            string restURL = string.Format("{0}/myorganization/groups?$filter=startswith(displayName,'{1}')", GraphBetaResourceUrl, groupName);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString)["value"];
                foreach (var item in jsonresult)
                {
                    var group = new GroupModel
                    {
                        Id = item["id"].IsNullOrEmpty() ? string.Empty : item["id"].ToString(),
                        displayName = item["displayName"].IsNullOrEmpty() ? string.Empty : item["displayName"].ToString()
                    };
                    allGroup.Add(group);
                }
            }
            return allGroup;
        }

        public async Task<List<ConversationModel>> GetGroupConversations(string id)
        {
            var retconversations = new List<ConversationModel>();
            string restURL = string.Format("{0}/myorganization/groups/{1}/conversations?$select=id,topic,preview,lastDeliveredDateTime", GraphResourceUrl, id);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString)["value"];
                foreach (var item in jsonresult)
                {
                    var conversation = new ConversationModel
                    {
                        Id = item["id"].IsNullOrEmpty() ? string.Empty : item["id"].ToString(),
                        topic = item["topic"].IsNullOrEmpty() ? string.Empty : item["topic"].ToString(),
                        preview = item["preview"].IsNullOrEmpty() ? string.Empty : item["preview"].ToString(),
                        lastDeliveredDateTime = item["lastDeliveredDateTime"].IsNullOrEmpty() ? new DateTime() : DateTime.Parse(item["lastDeliveredDateTime"].ToString())
                    };
                    retconversations.Add(conversation);
                }
            }
            return retconversations;
        }

        public async Task<List<ThreadModel>> GetGroupThreads(string id)
        {
            var retthreads = new List<ThreadModel>();
            string restURL = string.Format("{0}/myorganization/groups/{1}/threads?$select=id,topic,preview,lastDeliveredDateTime", GraphResourceUrl, id);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString)["value"];
                foreach (var item in jsonresult)
                {
                    var thread = new ThreadModel
                    {
                        Id = item["id"].IsNullOrEmpty() ? string.Empty : item["id"].ToString(),
                        topic = item["topic"].IsNullOrEmpty() ? string.Empty : item["topic"].ToString(),
                        preview = item["preview"].IsNullOrEmpty() ? string.Empty : item["preview"].ToString(),
                        lastDeliveredDateTime = item["lastDeliveredDateTime"].IsNullOrEmpty() ? new DateTime() : DateTime.Parse(item["lastDeliveredDateTime"].ToString())
                    };
                    retthreads.Add(thread);
                }
            }
            return retthreads;
        }
        public async Task<List<PostModel>> GetGroupThreadPosts(string groupId, string threadId)
        {
            var retPosts = new List<PostModel>();
            string restURL = string.Format("{0}/myorganization/groups/{1}/threads/{2}/posts?$select=body,from,sender", GraphResourceUrl, groupId, threadId);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString)["value"];
                foreach (var item in jsonresult)
                {
                    var post = new PostModel();
                    if (!item["body"].IsNullOrEmpty())
                    {
                        post.content = item["body"]["content"].IsNullOrEmpty() ? string.Empty : item["body"]["content"].ToString();
                    }
                    if (!item["from"].IsNullOrEmpty() && !item["from"]["emailAddress"].IsNullOrEmpty())
                    {
                        post.fromEmailAddress = item["from"]["emailAddress"]["address"].IsNullOrEmpty() ? string.Empty : item["from"]["emailAddress"]["address"].ToString();
                    }
                    if (!item["sender"].IsNullOrEmpty() && !item["sender"]["emailAddress"].IsNullOrEmpty())
                    {
                        post.senderEmailAddress = item["sender"]["emailAddress"]["address"].IsNullOrEmpty() ? string.Empty : item["sender"]["emailAddress"]["address"].ToString();
                    }
                    retPosts.Add(post);
                }
            }
            return retPosts;
        }

        public async Task<List<EventModel>> GetGroupEvents(string groupId)
        {
            var retEvents = new List<EventModel>();
            string restURL = string.Format("{0}/groups/{1}/events?$select=subject,bodyPreview,start,end,webLink", GraphResourceUrl, groupId);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString)["value"];
                foreach (var item in jsonresult)
                {
                    var Event = new EventModel();
                    Event.subject = item["subject"].IsNullOrEmpty() ? string.Empty : item["subject"].ToString();
                    Event.bodyPreview = item["bodyPreview"].IsNullOrEmpty() ? string.Empty : item["bodyPreview"].ToString();
                    Event.webLink = item["webLink"].IsNullOrEmpty() ? string.Empty : item["webLink"].ToString();
                    if (!item["start"].IsNullOrEmpty())
                    {
                        var datetimekind = DateTimeKind.Local;
                        if (item["start"]["timeZone"].ToString() == "UTC")
                        {
                            datetimekind = DateTimeKind.Utc;
                        }
                        Event.start = DateTime.SpecifyKind(DateTime.Parse(item["start"]["dateTime"].ToString()), datetimekind);
                    }
                    if (!item["end"].IsNullOrEmpty())
                    {
                        var datetimekind = DateTimeKind.Local;
                        if (item["end"]["timeZone"].ToString() == "UTC")
                        {
                            datetimekind = DateTimeKind.Utc;
                        }
                        Event.end = DateTime.SpecifyKind(DateTime.Parse(item["end"]["dateTime"].ToString()), datetimekind);
                    }
                    retEvents.Add(Event);
                }
            }
            return retEvents;
        }
        public async Task<List<FileModel>> GetGroupFiles(string groupId)
        {
            var retFiles = new List<FileModel>();
            string restURL = string.Format("{0}/groups/{1}/drive/root/children?$select=name,webUrl,lastModifiedDateTime,size", GraphResourceUrl, groupId);
            string responseString = await GetJsonAsync(restURL);
            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString)["value"];
                foreach (var item in jsonresult)
                {
                    var file = new FileModel();
                    file.name = item["name"].IsNullOrEmpty() ? string.Empty : item["name"].ToString();
                    file.webLink = item["webUrl"].IsNullOrEmpty() ? string.Empty : item["webUrl"].ToString();
                    file.lastModifiedDateTime = item["lastModifiedDateTime"].IsNullOrEmpty() ? new DateTime() : DateTime.Parse(item["lastModifiedDateTime"].ToString());
                    file.size = FormatBytes(Convert.ToInt64(item["size"].ToString()));
                    retFiles.Add(file);
                }
            }
            return retFiles;
        }
    }
}