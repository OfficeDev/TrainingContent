using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Identity.Client;
using System.Net;
using AzureSyncFunction.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Configuration;

namespace AzureSyncFunction
{
    public static class UserSync
    {
        private static string tenantId = ConfigurationManager.AppSettings["tenantId"];
        private static string authorityFormat = ConfigurationManager.AppSettings["authorityFormat"];

        private static string msGraphScope = "https://graph.microsoft.com/.default";
        private static string msGraphQuery = "https://graph.microsoft.com/v1.0/users";

        private static ConcurrentDictionary<string, List<MsGraphUser>> usersByTenant = new ConcurrentDictionary<string, List<MsGraphUser>>();

        [FunctionName("UserSync")]
        public static void Run([TimerTrigger("*/30 * * * * *")]TimerInfo myTimer, TraceWriter log)
        {
            log.Info($"C# Timer trigger function executed at: {DateTime.Now}");
            try
            {
                ConfidentialClientApplication daemonClient = new ConfidentialClientApplication(ConfigurationManager.AppSettings["clientId"],
                    String.Format(authorityFormat, tenantId),
                    ConfigurationManager.AppSettings["replyUri"],
                    new ClientCredential(ConfigurationManager.AppSettings["clientSecret"]),
                    null, new TokenCache());

                AuthenticationResult authResult = daemonClient.AcquireTokenForClientAsync(new string[] { msGraphScope }).GetAwaiter().GetResult();

                // Query for list of users in the tenant
                HttpClient client = new HttpClient();
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, msGraphQuery);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authResult.AccessToken);
                HttpResponseMessage response = client.SendAsync(request).GetAwaiter().GetResult();

                // If the token we used was insufficient to make the query, drop the token from the cache.
                // The Users page of the website will show a message to the user instructing them to grant
                // permissions to the app (see User/Index.cshtml).
                if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    // BUG: Here, we should clear MSAL's app token cache to ensure that on a subsequent call
                    // to SyncController, MSAL does not return the same access token that resulted in this 403.
                    // By clearing the cache, MSAL will be forced to retrieve a new access token from AAD, 
                    // which will contain the most up-to-date set of permissions granted to the app. Since MSAL
                    // currently does not provide a way to clear the app token cache, we have commented this line
                    // out. Thankfully, since this app uses the default in-memory app token cache, the app still
                    // works correctly, since the in-memory cache is not persistent across calls to SyncController
                    // anyway. If you build a persistent app token cache for MSAL, you should make sure to clear 
                    // it at this point in the code.
                    //
                    //daemonClient.AppTokenCache.Clear(Startup.clientId);
                    log.Error("Unable to issue query: Received " + response.StatusCode + " in Run method");
                }

                if (!response.IsSuccessStatusCode)
                {
                    log.Error("Unable to issue query: Received " + response.StatusCode + " in Run method");
                }

                // Record users in the data store (note that this only records the first page of users)
                string json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                MsGraphUserListResponse users = JsonConvert.DeserializeObject<MsGraphUserListResponse>(json);
                usersByTenant[tenantId] = users.value;
                log.Info("Successfully synchronized " + users.value.Count + " users!");

            }
            catch (Exception oops)
            {
                log.Error(oops.Message, oops, "AzureSyncFunction.UserSync.Run");                
            }
        }
    }
}
