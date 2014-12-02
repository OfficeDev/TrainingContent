using SPContactsList.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;
using SPContactsList.Data;

namespace SPContactsList.Utils {

  public class EFADALTokenCache : TokenCache {
    private SpContactsListContext db = new SpContactsListContext();
    string User;
    PerWebUserCache Cache;

    // constructor
    public EFADALTokenCache(string user) {
      // associate the cache to the current user of the web app
      User = user;

      this.AfterAccess = AfterAccessNotification;
      this.BeforeAccess = BeforeAccessNotification;
      this.BeforeWrite = BeforeWriteNotification;

      // look up the entry in the DB
      Cache = db.PerUserCacheList.FirstOrDefault(c => c.webUserUniqueId == User);
      // place the entry in memory
      this.Deserialize((Cache == null) ? null : Cache.cacheBits);
    }

    // clean up the DB
    public override void Clear() {
      base.Clear();
      foreach (var cacheEntry in db.PerUserCacheList)
        db.PerUserCacheList.Remove(cacheEntry);
      db.SaveChanges();
    }

    // Notification raised before ADAL accesses the cache.
    // This is your chance to update the in-memory copy from the DB, if the in-memory version is stale
    void BeforeAccessNotification(TokenCacheNotificationArgs args) {
      if (Cache == null) {
        // first time access
        Cache = db.PerUserCacheList.FirstOrDefault(c => c.webUserUniqueId == User);
      } else {   // retrieve last write from the DB
        var status = from e in db.PerUserCacheList
                     where (e.webUserUniqueId == User)
                     select new {
                       LastWrite = e.LastWrite
                     };
        // if the in-memory copy is older than the persistent copy
        if (status.First().LastWrite > Cache.LastWrite)
        //// read from from storage, update in-memory copy 
        {
          Cache = db.PerUserCacheList.FirstOrDefault(c => c.webUserUniqueId == User);
        }
      }


      this.Deserialize((Cache == null) ? null : Cache.cacheBits);
    }
    // Notification raised after ADAL accessed the cache.
    // If the HasStateChanged flag is set, ADAL changed the content of the cache
    void AfterAccessNotification(TokenCacheNotificationArgs args) {
      // if state changed
      if (this.HasStateChanged) {
        Cache = new PerWebUserCache {
          webUserUniqueId = User,
          cacheBits = this.Serialize(),
          LastWrite = DateTime.Now
        };
        //// update the DB and the lastwrite                
        db.Entry(Cache).State = Cache.EntryId == 0 ? EntityState.Added : EntityState.Modified;
        db.SaveChanges();
        this.HasStateChanged = false;
      }
    }
    void BeforeWriteNotification(TokenCacheNotificationArgs args) {
      // if you want to ensure that no concurrent write take place, use this notification to place a lock on the entry
    }
  }

}