using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web;
using ClientCredsAddin.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using Microsoft.Graph;
using System.Net.Http.Headers;

namespace ClientCredsAddin.Utils
{
    public class AuthHelper
    {
        public static JwtToken OpenIdToken(string idToken)
        {
            string encodedOpenIdToken = idToken;
            string decodedOpenIdToken = Base64UrlDecodeJwtTokenPayload(encodedOpenIdToken);

            return JsonConvert.DeserializeObject<JwtToken>(decodedOpenIdToken);
        }

        private static string Base64UrlDecodeJwtTokenPayload(string base64UrlEncodedJwtToken)
        {
            string payload = base64UrlEncodedJwtToken.Split('.')[1];

            return Base64UrlEncoder.Decode(payload);
        }

        public async Task<string> GetAppOnlyAccessToken(string resource)
        {
            string authority = SettingsHelper.AzureADAuthority;
            var authContext = new Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext(authority, false);

            // get certificate & password
            string certFile = HttpContext.Current.Server.MapPath(SettingsHelper.CertPfxFilePath);
            string certPassword = SettingsHelper.CertPfxFilePassword;
            var cert = new X509Certificate2(certFile, certPassword, X509KeyStorageFlags.MachineKeySet);
            var clientAssertionCert = new ClientAssertionCertificate(SettingsHelper.ClientId, cert);

            // authenticate
            var authResult = await authContext.AcquireTokenAsync(resource, clientAssertionCert);

            return authResult.AccessToken;
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