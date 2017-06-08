using System;
using System.Web;
using Newtonsoft.Json;
using OfficeGraphLab.Auth;

namespace OfficeGraphLab.TokenStorage
{
    public class SessionTokenEntry
    {
        [JsonProperty("access_token")]
        public string AccessToken;
        [JsonProperty("expires_on")]
        public DateTime ExpiresOn;
        [JsonProperty("refresh_token")]
        public string RefreshToken;
    }

    public class SessionTokenCache
    {
        private HttpContextBase context;
        private static readonly object FileLock = new object();
        private readonly string CacheId = string.Empty;
        private string UserObjectId = string.Empty;
        public SessionTokenEntry Tokens { get; private set; }

        public SessionTokenCache(string userId, HttpContextBase context)
        {
            this.context = context;
            this.UserObjectId = userId;
            this.CacheId = UserObjectId + "_TokenCache";

            Load();
        }

        public void Load()
        {
            lock (FileLock)
            {
                string jsonCache = (string)context.Session[CacheId];
                if (!string.IsNullOrEmpty(jsonCache))
                {
                    Tokens = JsonConvert.DeserializeObject<SessionTokenEntry>(jsonCache);
                }
            }
        }

        public void Persist()
        {
            lock (FileLock)
            {
                if (null != Tokens)
                {
                    context.Session[CacheId] = JsonConvert.SerializeObject(Tokens);
                }
            }
        }

        public void Clear()
        {
            lock (FileLock)
            {
                context.Session.Remove(CacheId);
            }
        }

        public void UpdateTokens(TokenRequestSuccessResponse tokenResponse)
        {
            double expireSeconds = double.Parse(tokenResponse.ExpiresIn);
            expireSeconds += -300;

            Tokens = new SessionTokenEntry()
            {
                AccessToken = tokenResponse.AccessToken,
                RefreshToken = tokenResponse.RefreshToken,
                ExpiresOn = DateTime.UtcNow.AddSeconds(expireSeconds)
            };

            Persist();
        }
    }
}