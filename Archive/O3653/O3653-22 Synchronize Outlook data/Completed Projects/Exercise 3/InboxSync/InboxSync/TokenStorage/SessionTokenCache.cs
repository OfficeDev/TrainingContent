using System.Web;
using Microsoft.Identity.Client;

namespace InboxSync.TokenStorage
{

    // Store the user's token information.
    public class SessionTokenCache : TokenCache
    {
        private HttpContextBase context;
        private static readonly object FileLock = new object();
        private readonly string CacheId = string.Empty;
        public string UserObjectId = string.Empty;

        public SessionTokenCache(string userId, HttpContextBase context)
        {
            this.context = context;
            this.UserObjectId = userId;
            this.CacheId = UserObjectId + "_TokenCache";

            AfterAccess = AfterAccessNotification;
            BeforeAccess = BeforeAccessNotification;
            Load();
        }

        public void Load()
        {
            lock (FileLock)
            {
                Deserialize((byte[])context.Session[CacheId]);
            }
        }

        public void Persist()
        {
            lock (FileLock)
            {

                // Reflect changes in the persistent store.
                var bytes = Serialize();
                var x = System.Text.Encoding.UTF8.GetString(bytes);
                context.Session[CacheId] = Serialize();

                // After the write operation takes place, restore the HasStateChanged bit to false.
                HasStateChanged = false;
            }
        }

        // Empties the persistent store.
        public override void Clear(string clientId)
        {
            base.Clear(clientId);
            context.Session.Remove(CacheId);
        }

        // Triggered right before MSAL needs to access the cache.
        // Reload the cache from the persistent store in case it changed since the last access.
        private void BeforeAccessNotification(TokenCacheNotificationArgs args)
        {
            Load();
        }

        // Triggered right after MSAL accessed the cache.
        private void AfterAccessNotification(TokenCacheNotificationArgs args)
        {
            // if the access operation resulted in a cache update
            if (HasStateChanged)
            {
                Persist();
            }
        }
    }
}