using Microsoft.Identity.Client;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace CustomData
{
    class SchemaExtensionsDemo
    {
        public async Task RunAsync(string clientId)
        {

            //The following method would only be needed to have an administrator
            //log in an grant administrative consent. For this lab, you will
            //already be logged in as an administrator, tenant-wide admin consent
            //is not needed.

            //LaunchBrowserWaitForAdminConsent(clientId, tenant, redirectUri);

            PublicClientApplication pca = new PublicClientApplication(clientId);
            string[] scopes = { "Group.ReadWrite.All", "Directory.AccessAsUser.All" };
            var authResult = await pca.AcquireTokenAsync(scopes);
            var accessToken = authResult.AccessToken;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://graph.microsoft.com/v1.0/");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                //Use schema extensions
                await ViewAvailableExtensionsAsync(client);

                var schemaId = await RegisterSchemaExtensionAsync(client);

                //Need to wait for schema to finish creating before creating group, otherwise get error
                System.Threading.Thread.Sleep(30000);

                var groupId = await CreateGroupWithExtendedDataAsync(client, schemaId);

                System.Threading.Thread.Sleep(30000);

                await UpdateCustomDataInGroupAsync(client, groupId, schemaId);

                System.Threading.Thread.Sleep(5000);

                await GetGroupAndExtensionDataAsync(client, schemaId);

                System.Threading.Thread.Sleep(30000);

                await DeleteGroupAndExtensionAsync(client, schemaId, groupId);
            }

            

        }

        //void LaunchBrowserWaitForAdminConsent(string clientId)
        //{
        //    string tenant = ConfigurationManager.AppSettings["ida:tenant"];
        //    string redirectUri = ConfigurationManager.AppSettings["ida:redirectUri"];
        //    Process p = new Process();
        //    ProcessStartInfo si = new ProcessStartInfo();
        //    p.StartInfo = si;
        //    si.UseShellExecute = true;
        //    si.FileName = @"C:\Program Files (x86)\Internet Explorer\iexplore.exe";
        //    si.Arguments = string.Format("https://login.microsoftonline.com/{0}/adminconsent?client_id={1}&state=12345&redirect_uri={2}", tenant, clientId, redirectUri);
        //    p.Start();
        //    p.WaitForExit();
        //}

        async Task ViewAvailableExtensionsAsync(HttpClient client)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "schemaextensions");            
            
            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();
            Console.WriteLine(JValue.Parse(await response.Content.ReadAsStringAsync()).ToString(Newtonsoft.Json.Formatting.Indented));
            Console.WriteLine();
        }

        async Task<string> RegisterSchemaExtensionAsync(HttpClient client)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "schemaExtensions");
            request.Content = new StringContent(@"{
                  'id': 'courses',
                  'description': 'Graph Learn training courses extensions',
                  'targetTypes': [
                    'Group'
                  ],
                  'properties': [
                    {
                      'name': 'courseId',
                      'type': 'Integer'
                    },
                    {
                      'name': 'courseName',
                      'type': 'String'
                    },
                    {
                      'name': 'courseType',
                      'type': 'String'
                    }
                  ]
                }", Encoding.UTF8, "application/json");

            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();
            var responseBody = await response.Content.ReadAsStringAsync();

            JObject o = JObject.Parse(responseBody);
            Console.WriteLine(JValue.Parse(responseBody).ToString(Newtonsoft.Json.Formatting.Indented));
            Console.WriteLine();
            return (string)o["id"];
        }

        async Task<string> CreateGroupWithExtendedDataAsync(HttpClient client, string schemaId)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "groups");
            string json = @"{
                  'displayName': 'New Managers 2017',
                  'description': 'New Managers training course 2017',
                  'groupTypes': [
                    'Unified'
                  ],
                  'mailEnabled': true,
                  'mailNickName': 'newManagers" + Guid.NewGuid().ToString().Substring(8) + @"',
                  'securityEnabled': false,
                  '" + schemaId + @"': {
                    'courseId': 123,
                    'courseName': 'New Managers',
                    'courseType': 'Online'
                  }
                }";
            
            request.Content = new StringContent(json, 
                Encoding.UTF8, 
                "application/json");

            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();
            var responseBody = await response.Content.ReadAsStringAsync();

            JObject o = JObject.Parse(responseBody);
            Console.WriteLine(JValue.Parse(responseBody).ToString(Newtonsoft.Json.Formatting.Indented));
            Console.WriteLine();
            return (string)o["id"];
        }

        async Task UpdateCustomDataInGroupAsync(HttpClient client, string groupId, string schemaId)
        {
            var request = new HttpRequestMessage(new HttpMethod("PATCH"), "groups/" + groupId);
            string json = @"{
                  '" + schemaId + @"': {
                    'courseId': '123',
                    'courseName': 'New Managers',
                    'courseType': 'Online'
                  }
                }";
            request.Content = new StringContent(
                json, 
                Encoding.UTF8, 
                "application/json");

            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();            
            Console.WriteLine();
        }

        async Task GetGroupAndExtensionDataAsync(HttpClient client, string schemaId)
        {
            var request = new HttpRequestMessage(
                HttpMethod.Get, 
                "groups?$filter=" + schemaId + "/courseId eq '123'&$select=displayName,id,description," + schemaId);
            
            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();

            var responseBody = await response.Content.ReadAsStringAsync();

            JObject o = JObject.Parse(responseBody);

            Console.WriteLine(JValue.Parse(await response.Content.ReadAsStringAsync()).ToString(Newtonsoft.Json.Formatting.Indented));
            Console.WriteLine();
        }

        async Task DeleteGroupAndExtensionAsync(HttpClient client, string schemaId, string groupId)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete, "schemaextensions/" + schemaId);
            
            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();
            
            Console.WriteLine();

            request = new HttpRequestMessage(HttpMethod.Delete, "groups/" + groupId);

            response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();
            
            Console.WriteLine();
        }
    }
}
