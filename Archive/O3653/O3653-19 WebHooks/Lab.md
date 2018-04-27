# Get notified when data changes through Microsoft Graph Webhooks

## What You'll Learn
In this lab, you'll create an ASP.NET MVC application that subscribes for Microsoft Graph webhooks and receives change notifications. You'll use the Microsoft Graph API to create a subscription, and you'll create a public endpoint that receives change notifications. 

## Overview 
A webhooks subscription allows a client app to receive notifications about mail, events, and contacts from the Microsoft Graph. Microsoft Graph implements a poke-pull model: it sends notifications when changes are made to messages, events, contacts, or files, and then you query the Microsoft Graph for the details you need. 

## Get an Office 365 developer environment
To complete the exercises below, you will require an Office 365 developer environment. Use the Office 365 tenant that you have been provided with for Microsoft Ignite.

## Exercise 1: Create a new project that uses Azure Active Directory v2 authentication

### Create the project in Visual Studio  2017
1. In this exercise, you will create the ASP.NET MVC5 application and register it with Azure active Directory.

2. Launch **Visual Studio 2017** as administrator.

3. In Visual Studio, click **File/New/Project**.

4. In the **New Project** dialog.

5. Select **Templates/Visual C#/Web**.

6. Select **ASP.NET Web Application**. Give the project the name **GraphWebhooks** and Click **OK**.

7. In the **New ASP.NET Project** dialog

8. Click **MVC**.

9. Click **Change Authentication**

10. Select **Work And School Accounts**.

11. Select **Cloud - Single Organization**

12. Input **Domain** of your O365 tenancy

13. Check **Read directory data** under Directory Access Permissions

14. Click **OK**.

    ![Screenshot of the previous step](images/03.png)

    ![Screenshot of the previous step](images/02.png)

    15. Ensure the web project uses SSL by default:

    16. In the **Solution Explorer** tool window, select the project and look at the **Properties** tool window. 

    17. Ensure **SSL Enabled** is set to **TRUE**.

    18. Copy the **SSL URL** property to the clipboard for use in the next step.

        ![Screenshot of the previous step](images/SslEnabled.png)

        > It is important to do this now because in the next step when you create the application in Azure AD, you want the reply URL to use HTTPS. If you did not do this now, you would have to manually make the changes the Visual Studio wizard is going to do for you in creating the app.

    19. At this point you can test the authentication flow for your application.

    20. In Visual Studio, press **F5**. The browser will automatically launch taking you to the HTTPS start page for the web application.

    21. To sign in, click the **Sign In** link in the upper-right corner.

    22. Login using your **Organizational Account**.

    23. Upon a successful login, since this will be the first time you have logged into this app, Azure AD will present you with the common consent dialog that looks similar to the following image:

    ![Screenshot of the previous step](images/ConsentDialog.png)

    24. Click **Accept** to approve the app's permission request on your data in Office 365.

    You will then be redirected back to your web application. However notice in the upper right corner, it now shows your email address & the **Sign Out** link.

    Congratulations... at this point your app is configured with Azure AD and leverages OpenID Connect and OWIN to facilitate the authentication process!

    25. Open the **Web.config** file and find the **appSettings** element. This is where you will need to add your appId and app secret you will generate in the next step.
    26. Launch the Application Registration Portal by navigating your web browser and going to **apps.dev.microsoft.com**. to register a new application.
    27. Sign into the portal using your Office 365 username and password.
    28. Click **Add an App** and type **GraphWebhooks** for the application name.
    29. Copy the **Application Id** and paste it into the value for **ida:AppId** in your project **web.config** file.
    30. Under **Application Secrets** click **Generate New Password** to create a new client secret for your app.
    31. Copy the displayed app password and paste it into the value for **ida:AppSecret** in your project **web.config** file.
    32. Modify the **ida:AppScopes** value to include the required `Mail.Read,User.Read`  scopes.

    ```
    <configuration>
      <appSettings>
        <!-- ... -->
        <add key="ida:AppId" value="paste application id here" />
        <add key="ida:AppSecret" value="paste application password here" />
        <!-- ... -->
        <!-- Specify scopes in this value. Multiple values should be comma separated. -->
        <add key="ida:AppScopes" value="Mail.Read,User.Read" />
      </appSettings>
      <!-- ... -->
    </configuration>
    ```

    33. Add a redirect URL to enable testing on your localhost.
    34. Right-click **GraphWebhooks** and click **Properties** to open the project properties.
    35. Click **Web** in the left navigation.
    36. Copy the **Project Url** value.
    37. Back on the Application Registration Portal page, click **Add Platform>Web**.
    38. Paste the value of **Project Url** into the **Redirect URIs** field.
    39. Scroll to the bottom of the page and click **Save**.
    40. Press **F5** to compile and launch your new application in the default browser.

## Exercise 2: Set up the ngrok proxy and notification URL data

### Install SignalR and the Microsoft Graph .NET Client Library

1. This exercise is based on the project located in the  **\\O3653\O3653-19 WebHooks\Starter Project** folder. Open the project with Visual Studio 2017. 

   Notice: update web.config and add values for below items.  These values can be found on Exercise 1's web.config.

   ```
   <add key="ida:ClientId" value="" />
   <add key="ida:ClientSecret" value="" />
   <add key="ida:Domain" value="" />
   <add key="ida:TenantId" value="" />
   <add key="ida:AppId" value="" />
   <add key="ida:AppSecret" value="" />
   <add key="ida:PostLogoutRedirectUri" value="" />
   ```

   In Visual Studio, right-click **GraphWebhooks**> **Properties** to open the project properties. Click **Web** in the left navigation. Make sure **Project URL** is the same as Exercise 1.

2. Open **Tools** > **NuGet Package Manager** > **Package Manager Console**. Make sure the package source is set to *nuget.org*, and run the following commands.  

   ```   
   Install-Package Microsoft.Graph
   Install-Package Microsoft.AspNet.SignalR
   ```

 These commands install AspNet.SignalR which notifies the client to refresh its view, and the Microsoft Graph .NET Client Library (SDK) for communicating with the Microsoft Graph. This app uses the SDK to get Outlook messages.

### Configure the app to use RuntimeTokenCache

  This application uses SignalR, which doesn't support ASP.NET session state. So you'll reconfigure the template's AuthHelper to use an **HttpRuntime** cache instead of the **SessionTokenCache** that's provided in the starter template. 

1. Open **Startup.cs** in the root directory of the project.

2. Replace the **OnAuthorizationCodeReceived** method with the following code.

  ```c#
  private async Task OnAuthorizationCodeReceived(AuthorizationCodeReceivedNotification notification)
  {

      // Get the user's object id (used to name the token cache)
      ClaimsPrincipal principal = new ClaimsPrincipal(notification.AuthenticationTicket.Identity);
      string userObjId = AuthHelper.GetUserId(principal);

      // Create a token cache
      RuntimeTokenCache tokenCache = new RuntimeTokenCache(userObjId);

      // Exchange the auth code for a token
      AuthHelper authHelper = new AuthHelper(tokenCache);

      var response = await authHelper.GetTokensFromAuthority("authorization_code", notification.Code,
          notification.Request.Uri.ToString());
  }
  ```

3. Right-click the **TokenStorage** folder and choose **Add** > **Class**.

4. Name the class *RuntimeTokenCache* and click **Add**.

5. Replace the contents of the class with the following code.

  ```c#
  using System;
  using System.Web;
  using Newtonsoft.Json;
  using GraphWebhooks.Auth;

  namespace GraphWebhooks.TokenStorage
  {
      public class RuntimeTokenEntry
      {
          [JsonProperty("access_token")]
          public string AccessToken;
          [JsonProperty("refresh_token")]
          public string RefreshToken;
          [JsonProperty("expires_on")]
          public DateTime ExpiresOn;
      }

      public class RuntimeTokenCache
      {
          private static readonly object FileLock = new object();
          private readonly string CacheId = string.Empty;
          private string UserObjectId = string.Empty;
          public RuntimeTokenEntry Tokens { get; private set; }

          public RuntimeTokenCache(string userId)
          {
              UserObjectId = userId;
              CacheId = UserObjectId + "_TokenCache";

              Load();
          }

          public void Load()
          {
              lock (FileLock)
              {
                  string jsonCache = (string)HttpRuntime.Cache.Get(CacheId);
                  if (!string.IsNullOrEmpty(jsonCache))
                  {
                      Tokens = JsonConvert.DeserializeObject<RuntimeTokenEntry>(jsonCache);
                  }
              }
          }

          public void Persist()
          {
              lock (FileLock)
              {
                  if (null != Tokens)
                  {
                      HttpRuntime.Cache.Insert(CacheId, JsonConvert.SerializeObject(Tokens));
                  }
              }
          }

          public void Clear()
          {
              lock (FileLock)
              {
                  HttpRuntime.Cache.Remove(CacheId);
              }
          }

          public void UpdateTokens(TokenRequestSuccessResponse tokenResponse)
          {
              double expireSeconds = double.Parse(tokenResponse.ExpiresIn);
              expireSeconds += -300;

              Tokens = new RuntimeTokenEntry()
              {
                  AccessToken = tokenResponse.AccessToken,
                  RefreshToken = tokenResponse.RefreshToken,
                  ExpiresOn = DateTime.UtcNow.AddSeconds(expireSeconds)
              };

              Persist();
          }
      }
  }
  ```

6. Open **AccountController.cs** in the Controllers folder.

7. Replace the **SignOut** action with the following code.

  ```c#
  public void SignOut()
  {
      if (Request.IsAuthenticated)
      {
          // Get the user's token cache and clear it
          string userObjId = AuthHelper.GetUserId(ClaimsPrincipal.Current);

          RuntimeTokenCache tokenCache = new RuntimeTokenCache(userObjId);
          tokenCache.Clear();
      }
      // Send an OpenID Connect sign-out request. 
      HttpContext.GetOwinContext().Authentication.SignOut(
          CookieAuthenticationDefaults.AuthenticationType);
      Response.Redirect("/");
  }
  ```

8. Open **HomeController.cs** in the Controllers folder.

9. Replace the **Graph** action with the following code.

  ```c#
  [Authorize]
  public async Task<ActionResult> Graph()
  {
      string userObjId = AuthHelper.GetUserId(ClaimsPrincipal.Current);

      RuntimeTokenCache tokenCache = new RuntimeTokenCache(userObjId);

      AuthHelper authHelper = new AuthHelper(tokenCache);

      ViewBag.AccessToken = await authHelper.GetUserAccessToken(Url.Action("Index", "Home", null, Request.Url.Scheme));
      if (null == ViewBag.AccessToken)
      {
          return new EmptyResult();
      }

      return View();
  }
  ```

10. Press F5 to compile and launch your new application in the default browser.
11. When the Graph and AAD v2 Auth Endpoint Starter page appears, sign in with your Office 365 account.

12. Review the permissions the application is requesting, and click **Accept**.

Exercise 2 with web sign in is complete!


## 
You must expose a public HTTPS endpoint to create a subscription and receive notifications from Microsoft Graph. While testing, you can use ngrok to temporarily allow messages from Microsoft Graph to tunnel to a port on your local computer. This makes it easier to test and debug webhooks. To learn more about using ngrok, see the ngrok website at https://ngrok.com/.

1. Download ngrok at `https://ngrok.com/download` for Windows.  

2. Unzip the package and run ngrok.exe.

3. In Visual Studio, open the Web.config file in the root directory of the project. Insert the following key in the **appSettings** section.

   ```xml
    <add key="ida:NotificationUrl" value="ENTER_YOUR_PROXY_URL/notification/listen" />
   ```

4. In Solution Explorer, select the **GraphWebhooks** project.

5. Copy the **URL** port number from the **Properties** window.  If the **Properties** window isn't showing, choose **View** > **Properties Window**. 

 ![URL port number in the Properties window](images/PortNumber.png)

6. Replace the two *<port-number>* placeholder values in the following command with the port number you copied, and then run the command in the ngrok console.

   ```
   ngrok http <port-number> -host-header=localhost:<port-number>
   ```

   For example:

   ```
   ngrok http 21942 -host-header=localhost:21942
   ```

   ![Running the command in ngrok](images/ngrok1.PNG)

7. Copy the HTTPS URL that's shown in the console. 

 ![The HTTPS URL in the ngrok console](images/ngrok2.PNG)

8. In the Web.config file, replace the *ENTER_YOUR_PROXY_URL* placeholder value for the **ida:NotificationUrl** key with the HTTPS URL you just copied. It will look something like this.

   ```xml
    <add key="ida:NotificationUrl" value="https://74c48253.ngrok.io/notification/listen" />
   ```

   > **NOTE:** Keep the console open while testing. If you close it, the tunnel also closes and you'll need to generate a new URL and update the sample.


## Exercise 3: Add Subscription support

### Create the Subscription model

In this step you'll create a model that represents a Subscription object. 

1. Right-click the **Models** folder and choose **Add** > **Class**. 

2. Name the model **Subscription.cs** and click **Add**.

3. Replace the contents with the following code. This code also includes a view model to display subscription properties in the UI.

   ```c#
    using System;
    using Newtonsoft.Json;

    namespace GraphWebhooks.Models
    {
        // A webhooks subscription.
        public class Subscription
        {
            // The type of change in the subscribed resource that raises a notification.
            [JsonProperty(PropertyName = "changeType")]
            public string ChangeType { get; set; }

            // The string that MS Graph should send with each notification. Maximum length is 255 characters. 
            // To verify that the notification is from MS Graph, compare the value received with the notification to the value you sent with the subscription request.
            [JsonProperty(PropertyName = "clientState")]
            public string ClientState { get; set; }

            // The URL of the endpoint that receives the subscription response and notifications. Requires https.
            [JsonProperty(PropertyName = "notificationUrl")]
            public string NotificationUrl { get; set; }

            // The resource to monitor for changes.
            [JsonProperty(PropertyName = "resource")]
            public string Resource { get; set; }

            // The amount of time in UTC format when the webhook subscription expires, based on the subscription creation time.
            // The maximum time varies for the resource subscribed to. This sample sets it to the 4230 minute maximum for messages.
            // See http://graph.microsoft.io/en-us/docs/api-reference/v1.0/resources/subscription for maximum values for resources.
            [JsonProperty(PropertyName = "expirationDateTime")]
            public DateTimeOffset? ExpirationDateTime { get; set; }

            // The unique identifier for the webhook subscription.
            [JsonProperty(PropertyName = "id")]
            public string Id { get; set; }
        }

        // The data that displays in the Subscription view.
        public class SubscriptionViewModel
        {
            public Subscription Subscription { get; set; }
        }
    }
   ```

### Create the Subscription controller
In this step you'll create a controller that will send a **POST /subscriptions** request to Microsoft Graph on behalf of the signed in user. This app creates a subscription for the *me/mailFolders('Inbox')/messages* resource for the *created* change type. See [Create subscription](http://graph.microsoft.io/en-us/docs/api-reference/v1.0/api/subscription_post_subscriptions) for other supported resources and change types. 

1. Right-click the **Controllers** folder and choose **Add** > **New Scaffolded Item**. 

2. In the **Add Scaffold** dialog, select **MVC 5 Controller - Empty** and click **Add**.

3. Name the controller **SubscriptionController** and click **Add**.

4. Use the following **using** statements:

   ```c#
   using System;
   using System.Web;
   using System.Web.Mvc;
   using GraphWebhooks.Models;
   using Newtonsoft.Json;
   using System.Configuration;
   using System.Net.Http;
   using System.Net.Http.Headers;
   using System.Threading.Tasks;
   using GraphWebhooks.Auth;
   using System.Security.Claims;
   using GraphWebhooks.TokenStorage;
   ```

5. Add the **CreateSubscription** action. This builds the request, sends the request, and parses the response.

   ```c#
    // Create webhooks subscriptions.
    [Authorize]
    public async Task<ActionResult> CreateSubscription()
    {

        // Build the request.
        HttpClient client = new HttpClient();
        string subscriptionsEndpoint = "https://graph.microsoft.com/v1.0/subscriptions/";
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, subscriptionsEndpoint);

        var subscription = new Subscription
        {
            Resource = "me/mailFolders('Inbox')/messages",
            ChangeType = "created",
            NotificationUrl = ConfigurationManager.AppSettings["ida:NotificationUrl"],
            ClientState = Guid.NewGuid().ToString(),
            ExpirationDateTime = DateTime.UtcNow + new TimeSpan(0, 0, 4230, 0)
        };
        string contentString = JsonConvert.SerializeObject(subscription, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
        request.Content = new StringContent(contentString, System.Text.Encoding.UTF8, "application/json");

        // Get an access token and add it to the client.
        try
        {
            string userObjId = AuthHelper.GetUserId(ClaimsPrincipal.Current);
            AuthHelper authHelper = new AuthHelper(new RuntimeTokenCache(userObjId));
            string accessToken = await authHelper.GetUserAccessToken("/");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        catch (Exception ex)
        {
            return RedirectToAction("Index", "Error", new { message = ex.Message, debug = ex.StackTrace });
        }
        
        // Send the request and parse the response.
        HttpResponseMessage response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {

            // Parse the JSON response.
            string stringResult = await response.Content.ReadAsStringAsync();
            SubscriptionViewModel viewModel = new SubscriptionViewModel
            {
                Subscription = JsonConvert.DeserializeObject<Subscription>(stringResult)
            };

            // This app temporarily stores the current subscription ID, client state, and user object ID. 
            // These are required so the NotificationController, which is not authenticated, can retrieve an access token from the cache.
            // Production apps typically use some method of persistent storage.
            HttpRuntime.Cache.Insert("subscriptionId_" + viewModel.Subscription.Id,
                Tuple.Create(viewModel.Subscription.ClientState, AuthHelper.GetUserId(ClaimsPrincipal.Current)), null, DateTime.MaxValue, new TimeSpan(24, 0, 0), System.Web.Caching.CacheItemPriority.NotRemovable, null);

            // Save the latest subscription ID, so we can delete it later and filter the view on it.
            Session["SubscriptionId"] = viewModel.Subscription.Id;
            return View("Subscription", viewModel);
        }
        else
        {
            string debugString = await response.Content.ReadAsStringAsync();
            return RedirectToAction("Index", "Error", new { message = response.StatusCode, debug = debugString });
        }
    }
   ```

6. Add the **DeleteSubscription** action. This deletes the current subscription and signs the user out.

   ```
    // Delete the current webhooks subscription and sign the user out.
    [Authorize]
    public async Task<ActionResult> DeleteSubscription()
    {
        // Build the request.
        HttpClient client = new HttpClient();
        string serviceRootUrl = "https://graph.microsoft.com/v1.0/subscriptions/";

        string subscriptionId = (string)Session["SubscriptionId"];
        if (!string.IsNullOrEmpty(subscriptionId))
        {
            
            // Get an access token and add it to the client.
            try
            {
                string userObjId = AuthHelper.GetUserId(ClaimsPrincipal.Current);
                AuthHelper authHelper = new AuthHelper(new RuntimeTokenCache(userObjId));
                string accessToken = await authHelper.GetUserAccessToken("/");

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Error", new { message = ex.Message, debug = ex.StackTrace });
            }
            
            // Send the 'DELETE /subscriptions/id' request.
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, serviceRootUrl + subscriptionId);
            HttpResponseMessage response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                string debugString = await response.Content.ReadAsStringAsync();
                return RedirectToAction("Index", "Error", new { message = response.StatusCode, debug = debugString });
            }
        }
        return RedirectToAction("SignOut", "Account");
    }
   ```

### Create the Index and Subscription views
In this step you'll create a view for the app start page and a view that displays the properties of the subscription you create.

#### Create the Index view

1. Right-click the **Views\Subscription** folder and choose **Add** > **View**. 

2. Name the view **Index**. 

3. Select the **Empty (without model)** template, and then click **Add**.

4. Replace the contents with the following code.

   ​

       <h2>Microsoft Graph Webhooks</h2>

       <div>
           <p>You can subscribe to webhooks for specific resources (such as Outlook messages or events) to get notifications about changes to the resource.</p>
           <p>This sample creates a subscription for the <i>me/mailFolders('Inbox')/messages</i> resource and the <i>Created</i> change type. The request body looks like this:</p>
           <code>
               {<br />
               &nbsp;&nbsp;"resource": "me/mailFolders('Inbox')/messages",<br />
               &nbsp;&nbsp;"changeType": "created",<br />
               &nbsp;&nbsp;"notificationUrl": "https://your-notification-endpoint",<br />
               &nbsp;&nbsp;"clientState": "your-client-state",<br />
               &nbsp;&nbsp;"expirationDateTime": "2016-03-14T03:13:29.4232606+00:00"<br />
               }
           </code>
           <p>See the <a href="http://graph.microsoft.io/en-us/docs/api-reference/v1.0/api/subscription_post_subscriptions">docs</a> for other supported resources and change types.</p>
           <br />
           @using (Html.BeginForm("CreateSubscription", "Subscription"))
           {
               <button type="submit">Create subscription</button>
           }
       </div>
   **Create the Subscription view**


1. Right-click the **Views\Subscription** folder and choose **Add** > **View**. 

2. Name the view **Subscription**.

3. Select the **Empty** template, select the **SubscriptionViewModel (GraphWebhooks.Models)** model, and then click **Add**.

4. Replace the contents with the following code.

   ```

    @model GraphWebhooks.Models.SubscriptionViewModel

    @{
        ViewBag.Title = "Subscription";
    }

    <h2>Subscription</h2>
    <div>
        <table>
            <tr>
                <td>
                    @Html.LabelFor(m => m.Subscription.Resource, htmlAttributes: new { @class = "control-label col-md-2" })
                </td>
                <td>
                    @Model.Subscription.Resource
                </td>
            </tr>
            <tr>
                <td>
                    @Html.LabelFor(m => m.Subscription.ChangeType, htmlAttributes: new { @class = "control-label col-md-2" })
                </td>
                <td>
                    @Model.Subscription.ChangeType
                </td>
            </tr>
            <tr>
                <td>
                    @Html.LabelFor(m => m.Subscription.ClientState, htmlAttributes: new { @class = "control-label col-md-2" })
                </td>
                <td>
                    @Model.Subscription.ClientState
                </td>
            </tr>
            <tr>
                <td>
                    @Html.LabelFor(m => m.Subscription.Id, htmlAttributes: new { @class = "control-label col-md-2" })
                </td>
                <td>
                    @Model.Subscription.Id
                </td>
            </tr>
            <tr>
                <td>
                    @Html.LabelFor(m => m.Subscription.ExpirationDateTime, htmlAttributes: new { @class = "control-label col-md-2" })
                </td>
                <td>
                    @Model.Subscription.ExpirationDateTime
                </td>
            </tr>
        </table>
    </div>
    <br />
    <div>
        @using (Html.BeginForm("LoadView", "Notification"))
        {
            <button type="submit">Watch for notifications</button>
        }
    </div>
   ```

#### Configure routing

1. In the **App_Start** folder, open RouteConfig.cs and replace the Default route with the following:

   ```c#
    routes.MapRoute(
        name: "Default",
        url: "{controller}/{action}",
        defaults: new { controller = "Subscription", action = "Index" }
    );
   ```

## Exercise 4: Add Notification support

### Create the Notification model
In this step you'll create a model that represents a Notification object. 

1. Right-click the **Models** folder and choose **Add** > **Class**. 

2. Name the model **Notification.cs** and click **Add**.

3. Replace the contents with the following code. This also defines a class for the **ResourceData** object. 

  ```c# 
    using System;
    using Newtonsoft.Json;

    namespace GraphWebhooks.Models
    {
        // A change notification.
        public class Notification
        {
            // The type of change.
            [JsonProperty(PropertyName = "changeType")]
            public string ChangeType { get; set; }

            // The client state used to verify that the notification is from Microsoft Graph. Compare the value received with the notification to the value you sent with the subscription request.
            [JsonProperty(PropertyName = "clientState")]
            public string ClientState { get; set; }

            // The endpoint of the resource that changed. For example, a message uses the format ../Users/{user-id}/Messages/{message-id}
            [JsonProperty(PropertyName = "resource")]
            public string Resource { get; set; }

            // The UTC date and time when the webhooks subscription expires.
            [JsonProperty(PropertyName = "subscriptionExpirationDateTime")]
            public DateTimeOffset SubscriptionExpirationDateTime { get; set; }

            // The unique identifier for the webhooks subscription.
            [JsonProperty(PropertyName = "subscriptionId")]
            public string SubscriptionId { get; set; }

            // Properties of the changed resource.
            [JsonProperty(PropertyName = "resourceData")]
            public ResourceData ResourceData { get; set; }
        }

        public class ResourceData
        {

            // The ID of the resource.
            [JsonProperty(PropertyName = "id")]
            public string Id { get; set; }

            // The OData etag property.
            [JsonProperty(PropertyName = "@odata.etag")]
            public string ODataEtag { get; set; }

            // The OData ID of the resource. This is the same value as the resource property.
            [JsonProperty(PropertyName = "@odata.id")]
            public string ODataId { get; set; }

            // The OData type of the resource: "#Microsoft.Graph.Message", "#Microsoft.Graph.Event", or "#Microsoft.Graph.Contact".
            [JsonProperty(PropertyName = "@odata.type")]
            public string ODataType { get; set; }
        }
    }
  ```

### Create the Notification controller
In this step you'll create a controller that exposes the notification endpoint and queries for changed messages. 

1. Right-click the **Controllers** folder and choose **Add** > **New Scaffolded Item**. 

2. In the **Add Scaffold** dialog, select **MVC 5 Controller - Empty** and click **Add**.

3. Name the controller **NotificationController** and click **Add**.

4. Replace the contents with the following code. This adds the **Listen** callback method you'll register for notifications.

   ```c#
    using System;
    using System.Web;
    using System.Web.Mvc;
    using GraphWebhooks.Models;
    using GraphWebhooks.SignalR;
    using Microsoft.Graph;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using GraphWebhooks.Auth;
    using GraphWebhooks.TokenStorage;

    namespace GraphWebhooks.Controllers
    {
        public class NotificationController : Controller
        {
            public ActionResult LoadView()
            {
                return View("Notification");
            }

            // The notificationUrl endpoint that's registered with the webhooks subscription.
            [HttpPost]
            public async Task<ActionResult> Listen()
            {

                // Validate the new subscription by sending the token back to MS Graph.
                // This response is required for each subscription.
                if (Request.QueryString["validationToken"] != null)
                {
                    var token = Request.QueryString["validationToken"];
                    return Content(token, "plain/text");
                }

                // Parse the received notifications.
                else
                {
                    try
                    {
                        var notifications = new Dictionary<string, Notification>();
                        using (var inputStream = new System.IO.StreamReader(Request.InputStream))
                        {
                            JObject jsonObject = JObject.Parse(inputStream.ReadToEnd());
                            if (jsonObject != null)
                            {

                                // Notifications are sent in a 'value' array.
                                JArray value = JArray.Parse(jsonObject["value"].ToString());
                                foreach (var notification in value)
                                {
                                    Notification current = JsonConvert.DeserializeObject<Notification>(notification.ToString());
                                    
                                    var subscriptionParams = (Tuple<string, string>)HttpRuntime.Cache.Get("subscriptionId_" + current.SubscriptionId);
                                    if (subscriptionParams != null)
                                    {
                                        // Verify the message is from Microsoft Graph.
                                        if (current.ClientState == subscriptionParams.Item1)
                                        {
                                            // Just keep the latest notification for each resource.
                                            // No point pulling data more than once.
                                            notifications[current.Resource] = current;
                                        }
                                    }
                                }
                                if (notifications.Count > 0)
                                {

                                    // Query for the changed messages. 
                                    await GetChangedMessagesAsync(notifications.Values);
                                }
                            }
                        }
                        return new HttpStatusCodeResult(202);
                    }
                    catch (Exception)
                    {

                        // TODO: Handle the exception.
                        // Return a 202 so the service doesn't resend the notification.
                        return new HttpStatusCodeResult(202);
                    }
                }
            }
        }  
    }
   ```

5. Add the **GetChangedMessagesAsync** method to the **NotificationController** class. This queries Microsoft Graph for the changed messages after receiving change notifications.

   > NOTE: This method uses the Microsoft Graph SDK to access Outlook messages. 

   ```c#
    // Get information about the changed messages and send to browser via SignalR
    // A production application would typically queue a background job for reliability.
    public async Task GetChangedMessagesAsync(IEnumerable<Notification> notifications)
    {
        List<Message> messages = new List<Message>();
        foreach (var notification in notifications)
        {
            if (notification.ResourceData.ODataType != "#Microsoft.Graph.Message") continue;

            // Get an access token and add it to the client.
            var subscriptionParams = (Tuple<string, string>)HttpRuntime.Cache.Get("subscriptionId_" + notification.SubscriptionId);
            string userObjId = subscriptionParams.Item2;
            AuthHelper authHelper = new AuthHelper(new RuntimeTokenCache(userObjId));

            string accessToken = await authHelper.GetUserAccessToken("/");
            var graphClient = new GraphServiceClient(new DelegateAuthenticationProvider(requestMessage =>
            {
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                return Task.FromResult(0);
            }));

            var request = new MessageRequest(graphClient.BaseUrl + "/" + notification.Resource, graphClient, null);
            try
            {
                messages.Add(await request.GetAsync());
            }
            catch (Exception)
            {
                continue;
            }

        }
        if (messages.Count > 0)
        {
            NotificationService notificationService = new NotificationService();
            notificationService.SendNotificationToClient(messages);
        }
    }
   ```

### Create the Notification view

In this step you'll create a view that displays some properties of the changed message. 

1. Right-click the **Views\Notification** folder and choose **Add** > **View**. 

2. Name the view **Notification**.

3. Select the **Empty (without model)** template, and then click **Add**.

4. Replace the entire contents of the file with the following code.

   ```html
   @model Microsoft.Graph.Message

   @{
       ViewBag.Title = "Notification";
   }

   @section Scripts {
       @Scripts.Render("~/Scripts/jquery.signalR-2.2.1.min.js")
       @Scripts.Render("~/signalr/hubs")

       <script>
           $(document).ready(function () {
               var connection = $.hubConnection();
               var hub = connection.createHubProxy("NotificationHub");
               hub.on("showNotification", function (messages) {
                   $.each(messages, function (index, value) {     // Iterate through the message collection
                       var message = value;                       // Get current message

                       var table = $("<table></table>");
                       var header = $("<th>Message " + (index + 1) + "</th>").appendTo(table);

                       for (prop in message) {                    // Iterate through message properties
                           var property = message[prop];
                           var row = $("<tr></tr>");

                           $("<td></td>").text(prop).appendTo(row);
                           $("<td></td>").text(property).appendTo(row);
                           table.append(row);
                       }
                       $("#message").append(table);
                       $("#message").append("<br />");
                   });
               });
               connection.start();
           });

       </script>
   }
   <h2>Messages</h2>
   <p>You'll get a notification when your user receives an email. The messages display below.</p>
   <br />
   <div id="message"></div>
   <div>
       @using (Html.BeginForm("DeleteSubscription", "Subscription"))
       {
           <button type="submit">Delete subscription and sign out</button>
       }
   </div>
   ```



This app uses SignalR to notify the client to refresh its view.

1. Right-click the GraphWebhooks project and create a folder named SignalR.

2. Right-click the SignalR folder and choose Add > Class.

3. Name the class NotificationHub and click OK. This sample doesn't add any functionality to the hub.

4. Right-click the SignalR folder and choose Add > Class.

5. Name the class NotificationService.cs and click Add.

6. Replace the contents with the following code.

   ​

        using System.Collections.Generic;
       using Microsoft.AspNet.SignalR;
       using Microsoft.Graph;
       
       namespace GraphWebhooks.SignalR
       {
           public class NotificationService : PersistentConnection
           {
               public void SendNotificationToClient(List<Message> messages)
               {
                   var hubContext = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
                   if (hubContext != null)
                   {
                       hubContext.Clients.All.showNotification(messages);
                   }
               }
           }
       }
   ​

   Open **Startup.cs** in the root directory of the project.

   Add the following line to the **Configuration** method.

   ​

```c#
app.MapSignalR();
```
Congratulations! In this lab you created an MVC application that subscribes for Microsoft Graph webhooks and receives change notifications! Now you can run the app.

## Run the application

1. Make sure that the ngrok console is still running, then press **F5** to begin debugging.

2. Sign in with your Office 365 account and consent to the requested permissions.

3. Click the **Create subscription** button. The **Subscription** page loads with information about the subscription.

4. Click the **Watch for notifications** button.

5. Send an email to your account. The **Notification** page displays information about the message.

6. Click the **Delete subscription and sign out** button. 

## Next Steps and Additional Resources:  
- See this training and more on http://dev.office.com/.
- Learn about and connect to the Microsoft Graph at https://graph.microsoft.io.
