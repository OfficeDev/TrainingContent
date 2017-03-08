using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Microsoft.Graph;
using System.Net.Http.Headers;

namespace XamarinLab.Helper
{
    class AuthenticationHelper
    {
        public static string userToken = null;
        public static DateTimeOffset expiration;
        private static GraphServiceClient graphClient = null;
        /// <summary>
        /// 
        /// Signs the user out of the service.
        /// </summary>
        public static void SignOut()
        {
            foreach (var user in App.PCA.Users)
            {
                user.SignOut();
            }
        }

        /// <summary>
        /// Signs the user out of the service.
        /// </summary>
        public static async Task<string> SignIn()
        {
            AuthenticationResult authResult = await App.PCA.AcquireTokenAsync(App.Scopes);
            userToken = authResult.Token;
            expiration = authResult.ExpiresOn;
            return authResult.Token;
        }

        /// <summary>
        /// Get Token for User.
        /// </summary>
        /// <returns>Token for user.</returns>
        public static async Task<string> GetTokenForUserAsync()
        {
            if (userToken == null || expiration <= DateTimeOffset.UtcNow.AddMinutes(5))
            {
                await SignIn();
            }

            return userToken;
        }

        public static GraphServiceClient GetGraphServiceClient()
        {
            if (graphClient == null)
            {
                // Create Microsoft Graph client.
                try
                {
                    graphClient = new GraphServiceClient(
                        "https://graph.microsoft.com/v1.0",
                        new DelegateAuthenticationProvider(
                            async (requestMessage) =>
                            {
                                var token = await GetTokenForUserAsync();
                                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);
                            }));
                    return graphClient;
                }

                catch (Exception ex)
                {
                }
            }

            return graphClient;
        }
    }
}
