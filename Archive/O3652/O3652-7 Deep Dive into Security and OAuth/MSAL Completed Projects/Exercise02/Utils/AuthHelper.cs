using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using ClientCredsAddin.Models;

namespace ClientCredsAddin.Utils
{
    public class AuthHelper
    {
        public async Task<string> GetAppOnlyAccessToken()
        {
             var clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ida:Password"]);

            // authenticate
            var authority = string.Format("https://login.microsoftonline.com/{0}/v2.0", SettingsHelper.AzureAdTenantId);
            var cca = new ConfidentialClientApplication(authority, SettingsHelper.ClientId, SettingsHelper.RedirectUri, clientCredential, null);
            string[] scopes = { "https://graph.microsoft.com/.default" };
            var authResult = await cca.AcquireTokenForClient(scopes, null);

            return authResult.Token;
        }

        public static GraphServiceClient GetGraphServiceClient(string token)
        {
            var authenticationProvider = new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    return Task.FromResult(0);
                });
            return new GraphServiceClient(authenticationProvider);
        }
    }
}