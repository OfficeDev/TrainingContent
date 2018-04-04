# Microsoft Graph: Building Microsoft Graph Applications - 200 Level
----------------
In this demo, you will through building applications that connect with the Microsoft Graph using multiple technologies. 

## Prerequisites
This lab uses Visual Studio 2017.

- [Lab Manual](./Lab.md)

## Build a .NET console application using Microsoft Graph

This lab will walk you through creating a .NET console application from scratch using .NET Framework 4.6.2, the Microsoft Graph SDK, and the Microsoft Authentication Library (MSAL).

### Register the application

Visit the [Application Registration Portal](https://apps.dev.microsoft.com/) to register the application. 

Click the **Add an app** button.

![](../../Images/01.png)

On the next page, provide an application name and provide your email address.

![](../../Images/02.png)

Once the application is created, an Application Id is provided on the screen.  **Copy this ID**, you will use it as the Client ID within the console application's app.config file.

![](../../Images/03.png)

Click the **Add Platform** button. A popup is presented, choose **Native Application**.

![](../../Images/03b.png)

Finally, add permission for the application to call the Microsoft Graph using delegated permissions. Click the **Add** button under the "Delegated Permissions" section to add the **User.Read** and **User.ReadBasic.All** permissions.

![](../../Images/03d.png)

Confirm that the permissions were added to the correct section.

![](../../Images/03e.png)

Once completed, be sure to scroll to the bottom of the page and **save** all changes.

![](../../Images/03f.png)

### Create the project in Visual Studio 2017

In Visual Studio 2017, create a new **Console Application** project targeting .NET Framework 4.6.2.

![](../../Images/04.png)

Click Tools / NuGet Package Manager / **Package Manager Console**. In the console window, run the following commands:

````powershell
Install-Package "Microsoft.Graph"
Install-Package "Microsoft.Identity.Client" -pre
Install-Package "System.Configuration.ConfigurationManager"
````

Edit the `app.config` file, and add the following immediately before the `<configuration>` element.

````xml
<appSettings>
    <add key="clientId" value="a943d247-89a1-4a21-9a62-c9714056c456"/>
</appSettings>
````

Make sure to **replace** the value with the **Application ID** value provided from the Application Registration Portal.

### Add AuthenticationHelper.cs

Add a class to the project named **AuthenticationHelper.cs**. This class will be responsible for authenticating using the Microsoft Authentication Library (MSAL), which is the Microsoft.Identity.Client package that we installed.

Replace the using statement at the top of the file.

````csharp
using Microsoft.Graph;
using Microsoft.Identity.Client;
using System;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
````

Replace the class declaration with the following.

````csharp
public class AuthenticationHelper
{
    // The Client ID is used by the application to uniquely identify itself to the v2.0 authentication endpoint.
    static string clientId = ConfigurationManager.AppSettings["clientId"].ToString();
    public static string[] Scopes = { "User.Read" };

    public static PublicClientApplication IdentityClientApp = new PublicClientApplication(clientId);

    public static string TokenForUser = null;
    public static DateTimeOffset Expiration;

    private static GraphServiceClient graphClient = null;

    // Get an access token for the given context and resourceId. An attempt is first made to 
    // acquire the token silently. If that fails, then we try to acquire the token by prompting the user.
    public static GraphServiceClient GetAuthenticatedClient()
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
                Debug.WriteLine("Could not create a graph client: " + ex.Message);
            }
        }

        return graphClient;
    }


    /// <summary>
    /// Get Token for User.
    /// </summary>
    /// <returns>Token for user.</returns>
    public static async Task<string> GetTokenForUserAsync()
    {
        AuthenticationResult authResult;
        try
        {
            authResult = await IdentityClientApp.AcquireTokenSilentAsync(Scopes, IdentityClientApp.Users.First());
            TokenForUser = authResult.AccessToken;
        }

        catch (Exception)
        {
            if (TokenForUser == null || Expiration <= DateTimeOffset.UtcNow.AddMinutes(5))
            {
                authResult = await IdentityClientApp.AcquireTokenAsync(Scopes);

                TokenForUser = authResult.AccessToken;
                Expiration = authResult.ExpiresOn;
            }
        }

        return TokenForUser;
    }

    /// <summary>
    /// Signs the user out of the service.
    /// </summary>
    public static void SignOut()
    {
        foreach (var user in IdentityClientApp.Users)
        {
            IdentityClientApp.Remove(user);
        }
        graphClient = null;
        TokenForUser = null;

    }

}
````

### Get the current user's profile using the Graph SDK

The Microsoft Graph API makes it easy to interrogate the currently logged in user's profile. This sample uses our `AuthenticationHelper.cs` class to obtain an authenticated client before accessing the Me endpoint.
**Edit** the `Program.cs` class and replace the generated using statements with the following:

````csharp
using Microsoft.Graph;
using Newtonsoft.Json.Linq;
using System;
using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;
````

**Add** the following method that will get the currently logged in user's profile information.

````csharp
/// <summary>
/// Gets the currently logged in user's profile information
/// </summary>        
public static async Task<User> GetMeAsync()
{
    User currentUserObject = null;
    try
    {
        var graphClient = AuthenticationHelper.GetAuthenticatedClient();
        currentUserObject = await graphClient.Me.Request().GetAsync();    
                        
        Debug.WriteLine("Got user: " + currentUserObject.DisplayName);
        return currentUserObject;
    }

    catch (ServiceException e)
    {
        Debug.WriteLine("We could not get the current user: " + e.Error.Message);
        return null;
    }            
}
````

### Get the users related to the current user using a REST API

The Microsoft Graph API provides REST endpoints to access information and traverse relationships. One such endpoint is the me/people endpoint that provides information about people closely related to the current user. This method demonstrates accessing the underlying System.Net.HttpClient to add an access token in the Authorization header and to configure the URL for the request.

````csharp
/// <summary>
/// Get people near me.  Demonstrates using HttpClient to call the 
/// Graph API.
/// </summary>
/// <returns></returns>
static async Task<string> GetPeopleNearMe()
{
    try
    {
        //Get the Graph client
        var graphClient = AuthenticationHelper.GetAuthenticatedClient();
        //Authentication Helper will now have the user's token
        var token = AuthenticationHelper.TokenForUser;

        var request = new HttpRequestMessage(HttpMethod.Get, graphClient.BaseUrl + "/me/people");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var response = await graphClient.HttpProvider.SendAsync(request);
        var bodyContents = await response.Content.ReadAsStringAsync();

        Debug.WriteLine(bodyContents);
        return bodyContents;
    }

    catch (Exception e)
    {
        Debug.WriteLine("Could not get people: " + e.Message);
        return null;
    }
}
````

### Putting it all together

The methods we created use the async/await pattern. Create an async method named **RunAsync** with the following implementation:

````csharp
static async Task RunAsync()
{
    //Display information about the current user
    Console.WriteLine("Get My Profile");
    Console.WriteLine();

    var me = await GetMeAsync();

    Console.WriteLine(me.DisplayName);
    Console.WriteLine("User:{0}\t\tEmail:{1}", me.DisplayName, me.Mail);
    Console.WriteLine();

    //Display information about people near me
    Console.WriteLine("Get People Near Me");

    var peopleJson = await GetPeopleNearMe();
    dynamic people = JObject.Parse(peopleJson);
    if(null != people)
    {
        foreach(var p in people.value)
        {
            var personType = p.personType;
            Console.WriteLine("Object:{0}\t\t\t\tClass:{1}\t\tSubclass:{2}", p.displayName, personType["class"], personType.subclass);
        }
    }
}

````

Finally, update the Main method to call the `RunAsync()` method.

````csharp
static void Main(string[] args)
{
    RunAsync().GetAwaiter().GetResult();
    Console.ReadKey();
}
````

Run the application. You are prompted to log in.

![](../../Images/05.png)

After the application runs, you will see output similar to the output shown here.

![](../../Images/06.png)
