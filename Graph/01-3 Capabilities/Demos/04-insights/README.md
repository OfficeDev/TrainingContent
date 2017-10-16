# Microsoft Graph Capabilities – 400 Level
----------------
In this demo, you will walk through capabilities of the Microsoft Graph to build applications to understand the capabilities of Microsoft Graph. 

## Prerequisites

This demo uses Visual Studio 2017. It also requires an Office 365 subscription and a user with administrative privileges.

## 4. Developing insights with Microsoft Graph
This demo will show how to use the Insights resource with Microsoft Graph.


### Register the application

Visit the [Application Registration Portal](https://apps.dev.microsoft.com). **Register** a new Converged application, and copy the generated application ID for later use as the Client ID.  **Configure** the application:

- Add a new secret by clicking the **Generate new password** button and copy the secret to use later as the Client Secret.
- Click the **Add Platform** button. A popup is presented, choose **Web Application**.
- Add a Redirect URL to use while debugging locally (the default setting for the Visual Studio project is `https://localhost:44326/`, if you use something else you need to change this value for your app registration). 
- Click **Save** to save all changes.

### Clone the starting application
The application will use OpenId Connect with the v2.0 endpoint as a starting point. To start, you will clone the project from GitHub. From your shell or command line:

````shell
git clone https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect-v2.git
````

**Open** the project with Visual Studio 2017. 

**Edit** the `web.config` file with your app's coordinates. 
- Find the appSettings key `ida:ClientId` and provide the Application ID from your app registration. 
- Find the appSettings key `ida:ClientSecret` and provide the value from the secret generated in the previous step.

The Insights resource requires the Sites.Read.All delegated permission. **Edit** the `App_Start/Startup.Auth.cs` file and edit the scope parameter to include the `Sites.Read.All` permission scope in the space-delimited list.

````csharp
Scope = "openid email profile offline_access Mail.Read Sites.Read.All",
````

The application will de-serialize JSON data returned from Microsoft Graph into strongly-typed classes.  **Right-click** the `Models` folder and add a new class `Insights.cs`. **Replace** the contents of `Insights.cs` with the following:

````csharp
using Newtonsoft.Json;
using System;
using System.Collections.Generic;



public class ResourceVisualization
{

    [JsonProperty("title")]
    public string title { get; set; }

    [JsonProperty("type")]
    public string type { get; set; }

    [JsonProperty("mediaType")]
    public string mediaType { get; set; }

    [JsonProperty("previewImageUrl")]
    public string previewImageUrl { get; set; }

    [JsonProperty("previewText")]
    public string previewText { get; set; }

    [JsonProperty("containerWebUrl")]
    public string containerWebUrl { get; set; }

    [JsonProperty("containerDisplayName")]
    public string containerDisplayName { get; set; }

    [JsonProperty("containerType")]
    public string containerType { get; set; }
}

public class ResourceReference
{

    [JsonProperty("webUrl")]
    public string webUrl { get; set; }

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("type")]
    public string type { get; set; }
}

public class TrendingInsights
{

    [JsonProperty("@odata.context")]
    public string context { get; set; }

    [JsonProperty("value")]
    public IList<TrendingValue> value { get; set; }
}

public class TrendingValue
{

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("weight")]
    public double weight { get; set; }

    [JsonProperty("resourceVisualization")]
    public ResourceVisualization resourceVisualization { get; set; }

    [JsonProperty("resourceReference")]
    public ResourceReference resourceReference { get; set; }
}

public class SharedInsights
{

    [JsonProperty("@odata.context")]
    public string context { get; set; }

    [JsonProperty("value")]
    public IList<SharedValue> value { get; set; }
}

public class SharedValue
{

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("lastShared")]
    public LastShared lastShared { get; set; }

    [JsonProperty("resourceVisualization")]
    public ResourceVisualization resourceVisualization { get; set; }

    [JsonProperty("resourceReference")]
    public ResourceReference resourceReference { get; set; }
}

public class SharedBy
{

    [JsonProperty("displayName")]
    public string displayName { get; set; }

    [JsonProperty("address")]
    public string address { get; set; }

    [JsonProperty("id")]
    public string id { get; set; }
}

public class SharingReference
{

    [JsonProperty("webUrl")]
    public string webUrl { get; set; }

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("type")]
    public string type { get; set; }
}

public class LastShared
{

    [JsonProperty("sharedDateTime")]
    public DateTime sharedDateTime { get; set; }

    [JsonProperty("sharingSubject")]
    public string sharingSubject { get; set; }

    [JsonProperty("sharingType")]
    public string sharingType { get; set; }

    [JsonProperty("sharedBy")]
    public SharedBy sharedBy { get; set; }

    [JsonProperty("sharingReference")]
    public SharingReference sharingReference { get; set; }
}

public class UsedInsights
{

    [JsonProperty("@odata.context")]
    public string context { get; set; }

    [JsonProperty("value")]
    public IList<LastUsedValue> value { get; set; }
}

public class LastUsedValue
{

    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("lastUsed")]
    public LastUsed lastUsed { get; set; }

    [JsonProperty("resourceVisualization")]
    public ResourceVisualization resourceVisualization { get; set; }

    [JsonProperty("resourceReference")]
    public ResourceReference resourceReference { get; set; }
}

public class LastUsed
{

    [JsonProperty("lastAccessedDateTime")]
    public DateTime lastAccessedDateTime { get; set; }

    [JsonProperty("lastModifiedDateTime")]
    public DateTime lastModifiedDateTime { get; set; }
}
````


**Right-click** the `Controllers` folder, choose **Add / Controller**, choose the **MVC 5 Controller - Empty** project item template, and name the new controller `InsightsController`. **Replace** the contents of `InsightsController.cs` with the following:

````csharp
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using WebApp_OpenIDConnect_DotNet.Models;

namespace WebApp.Controllers
{
    public class InsightsController : Controller
    {
        public static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        private static string appKey = ConfigurationManager.AppSettings["ida:ClientSecret"];
        private static string redirectUri = ConfigurationManager.AppSettings["ida:RedirectUri"];

        // GET: Insights        
        public async Task<ActionResult> Index()
        {
            return View();
            
        }

        [Authorize]
        public async Task<ActionResult> Shared()
        {
            var ret = new SharedInsights();

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "https://graph.microsoft.com/beta/me/insights/shared");

            // try to get token silently
            string signedInUserID = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            TokenCache userTokenCache = new MSALSessionCache(signedInUserID, this.HttpContext).GetMsalCacheInstance();
            ConfidentialClientApplication cca = new ConfidentialClientApplication(clientId, redirectUri, new ClientCredential(appKey), userTokenCache, null);
            if (cca.Users.Count() > 0)
            {
                string[] scopes = { "Sites.Read.All" };
                try
                {
                    AuthenticationResult result = await cca.AcquireTokenSilentAsync(scopes, cca.Users.First());

                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
                    HttpResponseMessage response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        ViewBag.AuthorizationRequest = null;
                        var responseBody = await response.Content.ReadAsStringAsync();
                        ret = JsonConvert.DeserializeObject<SharedInsights>(responseBody);
                    }
                }
                catch (MsalUiRequiredException)
                {
                    try
                    {// when failing, manufacture the URL and assign it
                        string authReqUrl = await WebApp.Utils.OAuth2RequestManager.GenerateAuthorizationRequestUrl(scopes, cca, this.HttpContext, Url);
                        ViewBag.AuthorizationRequest = authReqUrl;
                    }
                    catch (Exception ee)
                    {

                    }
                }
            }
            else { }
            return View(ret);
        }

        [Authorize]
        public async Task<ActionResult> Trending()
        {
            var ret = new TrendingInsights();
            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "https://graph.microsoft.com/beta/me/insights/trending");

            // try to get token silently
            string signedInUserID = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            TokenCache userTokenCache = new MSALSessionCache(signedInUserID, this.HttpContext).GetMsalCacheInstance();
            ConfidentialClientApplication cca = new ConfidentialClientApplication(clientId, redirectUri, new ClientCredential(appKey), userTokenCache, null);
            if (cca.Users.Count() > 0)
            {
                string[] scopes = { "Sites.Read.All" };
                try
                {
                    AuthenticationResult result = await cca.AcquireTokenSilentAsync(scopes, cca.Users.First());

                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
                    HttpResponseMessage response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseBody = await response.Content.ReadAsStringAsync();
                        ret = JsonConvert.DeserializeObject<TrendingInsights>(responseBody);
                        ViewBag.AuthorizationRequest = null;
                    }
                }
                catch (MsalUiRequiredException)
                {
                    try
                    {// when failing, manufacture the URL and assign it
                        string authReqUrl = await WebApp.Utils.OAuth2RequestManager.GenerateAuthorizationRequestUrl(scopes, cca, this.HttpContext, Url);
                        ViewBag.AuthorizationRequest = authReqUrl;
                    }
                    catch (Exception ee)
                    {

                    }
                }
            }
            else { }
            return View(ret);
        }

        [Authorize]
        public async Task<ActionResult> Used()
        {
            var ret = new UsedInsights();

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "https://graph.microsoft.com/beta/me/insights/used");

            // try to get token silently
            string signedInUserID = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            TokenCache userTokenCache = new MSALSessionCache(signedInUserID, this.HttpContext).GetMsalCacheInstance();
            ConfidentialClientApplication cca = new ConfidentialClientApplication(clientId, redirectUri, new ClientCredential(appKey), userTokenCache, null);
            if (cca.Users.Count() > 0)
            {
                string[] scopes = { "Sites.Read.All" };
                try
                {
                    AuthenticationResult result = await cca.AcquireTokenSilentAsync(scopes, cca.Users.First());

                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
                    HttpResponseMessage response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseBody = await response.Content.ReadAsStringAsync();
                        ret = JsonConvert.DeserializeObject<UsedInsights>(responseBody);

                        ViewBag.AuthorizationRequest = null;
                    }
                }
                catch (MsalUiRequiredException)
                {
                    try
                    {// when failing, manufacture the URL and assign it
                        string authReqUrl = await WebApp.Utils.OAuth2RequestManager.GenerateAuthorizationRequestUrl(scopes, cca, this.HttpContext, Url);
                        ViewBag.AuthorizationRequest = authReqUrl;
                    }
                    catch (Exception ee)
                    {

                    }
                }
            }
            else { }
            return View(ret);
        }


    }
}
````

Each controller method returns a different model to use with its view. **Right-click** the `Views / Insights` folder and choose **Add / View**. Add four empty views:
- `Index.cshtml`
- `Shared.cshtml`
- `Trending.cshtml`
- `Used.cshtml`

**Replace** the contents of ``Index.cshtml` with the following:

````html
@{
    ViewBag.Title = "Index";
}

<h2>Index</h2>

@Html.ActionLink("View trending", "Trending")

@Html.ActionLink("View shared", "Shared")

@Html.ActionLink("View used", "Used")

````

**Replace** the contents of `Shared.cshtml` with the following:
````html
@model SharedInsights

@{
    ViewBag.Title = "Shared";
}

<h2>Shared</h2>

<div>
    <h4>SharedInsights</h4>
    <hr />
    <dl class="dl-horizontal">
        <dt>
            @Html.DisplayNameFor(model => model.context)
        </dt>

        <dd>
            @Html.DisplayFor(model => model.context)
        </dd>

        @foreach (var item in Model.value)
        {

            <dt>
                @Html.DisplayNameFor(modelItem => item.id)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.id)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.lastShared.sharedBy)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastShared.sharedBy)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.lastShared.sharedDateTime)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastShared.sharedDateTime)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.lastShared.sharingSubject)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastShared.sharingSubject)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.lastShared.sharingType)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastShared.sharingType)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.lastShared.sharingReference.id)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastShared.sharingReference.id)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.lastShared.sharingReference.type)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastShared.sharingReference.type)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.lastShared.sharingReference.webUrl)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastShared.sharingReference.webUrl)
            </dd>

            <dt>
                @Html.DisplayNameFor(modelItem => item.lastShared.sharedBy)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastShared.sharedBy)
            </dd>
            @Html.Partial("_ResourceReference", item.resourceReference)
            @Html.Partial("_ResourceVisualization", item.resourceVisualization)
        }
    </dl>
</div>
<p>
    @Html.ActionLink("Back to List", "Index")
</p>

````

**Replace** the contents of ``Trending.cshtml` with the following:

````html
@model TrendingInsights

@{
    ViewBag.Title = "Trending";
}

<h2>Trending</h2>

<div>
    <h4>TrendingInsights</h4>
    <hr />
    <dl class="dl-horizontal">
        <dt>
            @Html.DisplayNameFor(model => model.context)
        </dt>

        <dd>
            @Html.DisplayFor(model => model.context)
        </dd>

        @foreach (var item in Model.value)
        {

            <dt>
                @Html.DisplayNameFor(modelItem => item.id)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.id)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.weight)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.weight)
            </dd>
            @Html.Partial("_ResourceReference", item.resourceReference)
            @Html.Partial("_ResourceVisualization", item.resourceVisualization)
        }

    </dl>
</div>
<p>
    @Html.ActionLink("Back to List", "Index")
</p>


````

**Replace** the contents of ``Used.cshtml` with the following:

````html
@model UsedInsights

@{
    ViewBag.Title = "Used";
}

<h2>Used</h2>

<div>
    <h4>UsedInsights</h4>
    <hr />
    <dl class="dl-horizontal">
        <dt>
            @Html.DisplayNameFor(model => model.context)
        </dt>

        <dd>
            @Html.DisplayFor(model => model.context)
        </dd>
@foreach (var item in Model.value)
{

    <dt>
        @Html.DisplayNameFor(modelItem => item.id)
    </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.id)
            </dd>
            <dt>
                @Html.DisplayNameFor(modelItem => item.lastUsed)
            </dt>
            <dd>
                @Html.DisplayFor(modelItem => item.lastUsed)
            </dd>

            @Html.Partial("_ResourceReference", item.resourceReference)
            @Html.Partial("_ResourceVisualization", item.resourceVisualization)
}
    </dl>
</div>
<p>    
    @Html.ActionLink("Back to List", "Index")
</p>


````

Each of these views uses two partial views, `_ResourceReference` and `_ResourceVisualization`. Partial views make it easy to encapsulate code that is common across multiple views. 

**Right-click** the `Views / Shared` folder and choose **Add / View**. Name the new view `_ResourceReference`, change the template to **Details**, and change the model class to **ResourceReference**. Check the **Create as partial view** checkbox and click **Add**.

![](../../Images/16.png)

**Repeat** these steps to add a partial view for `_ResourceVisualization`. Name the new view `_ResourceVisualization`, change the template to **Details**, and change the model class to **ResourceVisualization**. Check the **Create as partial view** checkbox and click **Add**.

Finally, update the top-level navigation for the web site. **Edit** the `Views / Shared / _Layout.cshtml` file and **add** a link to the new controller.

````html
<li>@Html.ActionLink("Read Mail", "ReadMail", "Home")</li>
<li>@Html.ActionLink("Send Mail", "SendMail", "Home")</li>
<li>@Html.ActionLink("Insights", "Index", "Insights")</li>
````

### Run the application
Run the application, then click on the **Sign in with Microsoft** link. You are prompted to sign in and to grant the application the requested permisssions. After consenting, the page is displayed. Click the **Insights** link at the top of the page, then choose the **Trending** link. The information is displayed.

![](../../Images/17.png)

Notice that the image for the previewImage is not displaying. This is because you must first log into your SharePoint site to see data. Open a new tab in the browser and navigate to your SharePoint site. Now, go back to the page and refresh, you will see the images appear.

![](../../Images/18.png)
