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
            return null;
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
        public async Task<List<GroupModel>> SearchGoupByName(string groupName)
        {
            return null;
        }

        public async Task<List<ConversationModel>> GetGroupConversations(string id)
        {
            return null;
        }

        public async Task<List<ThreadModel>> GetGroupThreads(string id)
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
        public async Task<List<FileModel>> GetGroupFiles(string groupId)
        {
            return null;
        }
    }
}