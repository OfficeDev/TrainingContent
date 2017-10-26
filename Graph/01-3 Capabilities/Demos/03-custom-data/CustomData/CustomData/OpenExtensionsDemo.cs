using Microsoft.Identity.Client;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace CustomData
{
    class OpenExtensionsDemo
    {

        public async Task RunAsync(string clientId)
        {
            PublicClientApplication pca = new PublicClientApplication(clientId);
            string[] scopes = { "User.ReadWrite" };
            var authResult = await pca.AcquireTokenAsync(scopes);
            var accessToken = authResult.AccessToken;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://graph.microsoft.com/v1.0/");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                //Use open extensions
                await AddRoamingProfileInformationAsync(client);
                await RetrieveRoamingProfileInformationAsync(client);
                await UpdateRoamingProfileInformationAsync(client);
                await DeleteRoamingProfileInformationAsync(client);
            }
            
        }
        async Task AddRoamingProfileInformationAsync(HttpClient client)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "me/extensions");            
            request.Content = new StringContent(@"{
                  '@odata.type': 'microsoft.graph.openTypeExtension',
                  'extensionName': 'com.contoso.roamingSettings',
                  'theme': 'dark',
                  'color': 'purple',
                  'lang': 'Japanese'
                }", Encoding.UTF8, "application/json");
            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();
            Console.WriteLine(JValue.Parse(await response.Content.ReadAsStringAsync()).ToString(Newtonsoft.Json.Formatting.Indented));
            Console.WriteLine();
        }

        async Task RetrieveRoamingProfileInformationAsync(HttpClient client)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "me?$select=id,displayName,mail&$expand=extensions");
            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();
            Console.WriteLine(JValue.Parse(await response.Content.ReadAsStringAsync()).ToString(Newtonsoft.Json.Formatting.Indented));
            Console.WriteLine();
        }

        async Task UpdateRoamingProfileInformationAsync(HttpClient client)
        {
            var request = new HttpRequestMessage(new HttpMethod("PATCH"), "me/extensions/com.contoso.roamingSettings");
            request.Content = new StringContent(@"{
                    'theme': 'light',
                    'color': 'blue',
                    'lang': 'English'
                }", Encoding.UTF8, "application/json");
            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();

        }

         async Task DeleteRoamingProfileInformationAsync(HttpClient client)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete, "me/extensions/com.contoso.roamingSettings");
            var response = await client.SendAsync(request);

            response.WriteCodeAndReasonToConsole();
        }


    }
}
