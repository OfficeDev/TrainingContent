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
            return null;
        }

        public static async Task<string> GetGraphAccessTokenAsync()
        {
            return null;
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
            return null;
        }

        public async Task<List<GroupModel>> GetMyOrganizationGroups()
        {
            return null;
        }

        public async Task<List<GroupModel>> GetJoinedGroups()
        {
            return null;
        }
        public async Task<List<GroupModel>> SearchGroupByName(string groupName)
        {
            return null;
        }

        public async Task<List<UserModel>> GetGroupMembers(string id)
        {
            return null;
        }

        public async Task<Microsoft.Graph.User> AddGroupMember(string groupId, string newMemberEmail)
        {
            return null;
        }

        public async Task<List<ConversationModel>> GetGroupConversations(string id)
        {
            return null;
        }

        public async Task<Conversation> AddGroupConversation(string groupId, string topic, string message)
        {
            return null;
        }

        public async Task<List<ThreadModel>> GetGroupThreads(string id)
        {
            return null;
        }

        public async Task<ConversationThread> AddGroupThread(string groupId, string topic, string message)
        {
            return null;
        }

        public async Task<List<PostModel>> GetGroupThreadPosts(string groupId, string threadId)
        {
            return null;
        }

        public async Task<List<EventModel>> GetGroupEvents(string groupId)
        {
            return null;
        }

        public async Task<Event> AddGroupEvent(string groupId, string subject, string start, string end, string location)
        {

            return null;
        }

        public async Task<List<FileModel>> GetGroupFiles(string groupId)
        {
            return null;
        }

        public async Task<DriveItem> AddGroupFile(string groupId, string fileName, Stream stream)
        {
            return null;
        }

        public async Task<Stream> GetGroupPhoto(string groupId)
        {
            return null;
        }

        public async Task<string> CreateGroup(string groupName, string groupAlias)
        {
            return null;
        }
    }
}