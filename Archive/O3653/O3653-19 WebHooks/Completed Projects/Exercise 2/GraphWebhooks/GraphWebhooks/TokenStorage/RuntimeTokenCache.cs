using System;
using System.Web;
using Newtonsoft.Json;
using GraphWebhooks.Auth;

namespace GraphWebhooks.TokenStorage
{
    public class RuntimeTokenEntry
    {
        [JsonProperty("access_token")]
        public string AccessToken;
        [JsonProperty("refresh_token")]
        public string RefreshToken;
        [JsonProperty("expires_on")]
        public DateTime ExpiresOn;
    }

    public class RuntimeTokenCache
    {
        private static readonly object FileLock = new object();
        private readonly string CacheId = string.Empty;
        private string UserObjectId = string.Empty;
        public RuntimeTokenEntry Tokens { get; private set; }

        public RuntimeTokenCache(string userId)
        {
            UserObjectId = userId;
            CacheId = UserObjectId + "_TokenCache";

            Load();
        }

        public void Load()
        {
            lock (FileLock)
            {
                string jsonCache = (string)HttpRuntime.Cache.Get(CacheId);
                if (!string.IsNullOrEmpty(jsonCache))
                {
                    Tokens = JsonConvert.DeserializeObject<RuntimeTokenEntry>(jsonCache);
                }
            }
        }

        public void Persist()
        {
            lock (FileLock)
            {
                if (null != Tokens)
                {
                    HttpRuntime.Cache.Insert(CacheId, JsonConvert.SerializeObject(Tokens));
                }
            }
        }

        public void Clear()
        {
            lock (FileLock)
            {
                HttpRuntime.Cache.Remove(CacheId);
            }
        }

        public void UpdateTokens(TokenRequestSuccessResponse tokenResponse)
        {
            double expireSeconds = double.Parse(tokenResponse.ExpiresIn);
            expireSeconds += -300;

            Tokens = new RuntimeTokenEntry()
            {
                AccessToken = tokenResponse.AccessToken,
                RefreshToken = tokenResponse.RefreshToken,
                ExpiresOn = DateTime.UtcNow.AddSeconds(expireSeconds)
            };

            Persist();
        }
    }
}