using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace XamarinLab.Helper
{
    class AuthenticationHelper
    {
        public static string userToken = null;
        public static DateTimeOffset expiration;
        /// <summary>
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
            return userToken;
        }
    }
}
