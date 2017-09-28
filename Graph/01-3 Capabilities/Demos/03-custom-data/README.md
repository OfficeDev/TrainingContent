# Microsoft Graph Capabilities – 400 Level
----------------
In this lab, you will walk through capabilities of the Microsoft Graph to build applications to understand the capabilities of Microsoft Graph. 

## Prerequisites

This lab uses Visual Studio 2017. It also requires an Office 365 subscription and a user with administrative privileges. 

## 3. Adding custom data to resources in Microsoft Graph

This lab will walk you through working with custom data for resources using Microsoft Graph. 

### Pre-requisistes
This lab requires an Office 365 administrative user.

### Register the application
Visit the [Application Retgistration Portal](https://apps.dev.microsoft.com) and register a new application. Add a **Native** application platform. Add **delegated** permissions for **Directory.AccessAsUser.All** and **Group.ReadWrite.All**. Click **Save**.

![](../../Images/13.png)

### Create the application
In Visual Studio 2017, **create** a new project using the **Console App (.NET Framework)** project template. **Right-click** the project node and choose **Manage NuGet packages**. Search for **Microsoft.Identity.Client** and choose **Install**.

**Update** the `app.config` file and add an `appSettings` section with the following structure:
````xml
  <appSettings>
    <add key="ida:clientId" value=""/>      
  </appSettings>
````
**Update** the `ida:clientId` setting with the client ID of the application you previously registered. 

**Replace** the contents of `Program.cs` with the following:

````csharp
using System.Configuration;
using System.Threading.Tasks;

namespace CustomData
{
    class Program
    {
        static void Main(string[] args)
        {
            RunAsync(args).GetAwaiter().GetResult();
        }

        static async Task RunAsync(string[] args)
        {

            var clientId = ConfigurationManager.AppSettings["ida:clientId"];

            var openExtensionsDemo = new OpenExtensionsDemo();
            await openExtensionsDemo.RunAsync(clientId);

            var schemaExtensionDemo = new SchemaExtensionsDemo();
            await schemaExtensionDemo.RunAsync(clientId);
            
        }
    }
}
````
The first demonstration will use open extensions with Microsoft Graph. 

**Add** a new class named `OpenExtensionsDemo.cs`.  **Replace** the contents with the following:

````csharp
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
            request.Content = new StringContent("{'@odata.type':'microsoft.graph.openTypeExtension','extensionName':'com.contoso.roamingSettings','theme':'dark','color':'purple','lang':'Japanese'}", Encoding.UTF8, "application/json");
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
            request.Content = new StringContent("{'theme':'light','color':'blue','lang':'English'}", Encoding.UTF8, "application/json");
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
````

The second demonstration will use schema extensions with Microsoft Graph.

**Add** a new class named `SchemaExtensionsDemo.cs`. **Replace** its contents with the following:

````csharp
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
            request.Content = new StringContent("{'id':'courses','description':'Graph Learn training courses extensions','targetTypes':['Group'],'properties':[{'name':'courseId','type':'Integer'},{'name':'courseName','type':'String'},{'name':'courseType','type':'String'} ]}", Encoding.UTF8, "application/json");

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
            request.Content = new StringContent("{'displayName':'New Managers 2017','description':'New Managers training course 2017','groupTypes':['Unified'],'mailEnabled':true, 'mailNickName':'newManagers" + Guid.NewGuid().ToString().Substring(8) + "','securityEnabled':false,'" + schemaId + "':{'courseId':123,'courseName':'New Managers','courseType':'Online'}}", Encoding.UTF8, "application/json");

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
            request.Content = new StringContent("{'" + schemaId + "':{'courseId':'123','courseName':'New Managers','courseType':'Online'}}", Encoding.UTF8, "application/json");

            var response = await client.SendAsync(request);
            response.WriteCodeAndReasonToConsole();            
            Console.WriteLine();
        }

        async Task GetGroupAndExtensionDataAsync(HttpClient client, string schemaId)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "groups?$filter=" + schemaId + "/courseId eq '123'&$select=displayName,id,description," + schemaId);
            
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

````

Both classes use an extension method to write the HTTP status code and reason to console output.

**Add** a new class named `HttpResponseMessageExtension`.  **Replace** its contents with the following:

````csharp
using System;
using System.Net.Http;

namespace CustomData
{
    public static class HttpResponseMessageExtension
    {
        public static void WriteCodeAndReasonToConsole(this HttpResponseMessage response)
        {


            var defaultBGColor = Console.BackgroundColor;
            var defaultFGColor = Console.ForegroundColor;

            if (response.IsSuccessStatusCode)
            {
                Console.ForegroundColor = ConsoleColor.Black;
                Console.BackgroundColor = ConsoleColor.Green;
                Console.Write(response.StatusCode);
            }

            if (!response.IsSuccessStatusCode)
            {
                Console.ForegroundColor = ConsoleColor.White;
                Console.BackgroundColor = ConsoleColor.Red;
                Console.Write(response.StatusCode);
                Console.WriteLine(" - " + response.ReasonPhrase);
            }
            Console.BackgroundColor = defaultBGColor;
            Console.ForegroundColor = defaultFGColor;
            Console.WriteLine();
        }
        
    }
}
````

### Run the application
Run the application. 

You are prompted to log in and grant consent to read and write the current user's profile. After granting consent, the application will continue. 

The application is making REST calls to the Microsoft Graph to demonstrate the capabilities of using open extensions. The console output will show green highlighted text for successful calls, and red highlighted text if calls do not succeed.

![](../../Images/14.png)

You are prompted to log in a second time. This is on purpose, to demonstrate the difference in permissions that these two approaches require. Notice that you are again prompted for consent, this time to read and write groups and to access the directory as the user.  Grant permissions, and the application will continue.

The application is now making REST calls to the Microsoft Graph to demonstrate the capabilities of using schema extensions. Just as before, the console output will show green highlighted text for successful calls, and red highlighted text if calls do not succeed.

![](../../Images/15.png)

> Note that there is a `Thread.Sleep` call between each operation. This is required to avoid a race condition with resources as they are being created. 