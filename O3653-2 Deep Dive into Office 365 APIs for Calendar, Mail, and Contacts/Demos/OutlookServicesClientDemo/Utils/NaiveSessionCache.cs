// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Threading;
using System.Web;

namespace OutlookServicesClientDemo.Utils {
  /// <summary>
  /// A basic token cache using current session
  /// ADAL will automatically save tokens in the cache whenever you obtain them.  
  /// More details here: http://www.cloudidentity.com/blog/2014/07/09/the-new-token-cache-in-adal-v2/
  /// !!! NOTE: DO NOT USE THIS IN PRODUCTION. A MORE PERSISTENT CACHE SUCH AS A DATABASE IS RECOMMENDED FOR PRODUCTION USE !!!!
  /// </summary>
  public class NaiveSessionCache : TokenCache {
    private static ReaderWriterLockSlim SessionLock = new ReaderWriterLockSlim(LockRecursionPolicy.NoRecursion);
    string UserObjectId = string.Empty;
    string CacheId = string.Empty;

    public NaiveSessionCache(string userId) {
      UserObjectId = userId;
      CacheId = UserObjectId + "_TokenCache";

      this.AfterAccess = AfterAccessNotification;
      this.BeforeAccess = BeforeAccessNotification;
      Load();
    }

    public void Load() {
      SessionLock.EnterReadLock();
      this.Deserialize((byte[])HttpContext.Current.Session[CacheId]);
      SessionLock.ExitReadLock();
    }

    public void Persist() {
      SessionLock.EnterWriteLock();

      // Optimistically set HasStateChanged to false. We need to do it early to avoid losing changes made by a concurrent thread.
      this.HasStateChanged = false;

      // Reflect changes in the persistent store
      HttpContext.Current.Session[CacheId] = this.Serialize();
      SessionLock.ExitWriteLock();
    }

    public override void DeleteItem(TokenCacheItem item) {
      base.DeleteItem(item);
      Persist();
    }

    // Empties the persistent store.
    public override void Clear() {
      base.Clear();
      System.Web.HttpContext.Current.Session.Remove(CacheId);
    }

    // Triggered right before ADAL needs to access the cache.
    // Reload the cache from the persistent store in case it changed since the last access.
    void BeforeAccessNotification(TokenCacheNotificationArgs args) {
      Load();
    }

    // Triggered right after ADAL accessed the cache.
    void AfterAccessNotification(TokenCacheNotificationArgs args) {
      // if the access operation resulted in a cache update
      if (this.HasStateChanged) {
        Persist();
      }
    }
  }
}
//*********************************************************  
//  
//O365 APIs Starter Project for ASPNET MVC, https://github.com/OfficeDev/Office-365-APIs-Starter-Project-for-ASPNETMVC
// 
//Copyright (c) Microsoft Corporation 
//All rights reserved.  
// 
//MIT License: 
// 
//Permission is hereby granted, free of charge, to any person obtaining 
//a copy of this software and associated documentation files (the 
//""Software""), to deal in the Software without restriction, including 
//without limitation the rights to use, copy, modify, merge, publish, 
//distribute, sublicense, and/or sell copies of the Software, and to 
//permit persons to whom the Software is furnished to do so, subject to 
//the following conditions: 
// 
//The above copyright notice and this permission notice shall be 
//included in all copies or substantial portions of the Software. 
// 
//THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND, 
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
//MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
//LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
//OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
//WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
//  
//********************************************************* 