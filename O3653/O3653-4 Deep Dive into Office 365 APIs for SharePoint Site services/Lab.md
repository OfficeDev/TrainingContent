# Office 365 APIs for SharePoint Sites
In this lab, you will use the Office 365 APIs for SharePoint Sites as part of an ASP.NET MVC5 application to manage a Tasks list.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
1. You must have the Office 365 API Tools version 1.2.41027.2 installed in Visual Studio 2013.
1. You must have a task list named "Tasks" in the root site of SharePoint Online.

## Exercise 1: Create an ASP.NET MVC5 Application
In this exercise, you will create the ASP.NET MVC5 application and register it with Azure active Directory.

1. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  1. In Visual Studio select **File/New/Project**.
  1. In the **New Project** dialog:
    1. Select **Templates/Visual C#/Web**.
    1. Click **ASP.NET Web Application**.
    1. Name the new project **TasksWeb**.
    1. Click **OK**.

       ![](Images/01.png?raw=true "Figure 1")

  1. In the **New ASP.NET Project** dialog:
    1. Click **MVC**.
    1. Click **Change Authentication**.
    1. Select **No Authentication**.
    1. Click **OK**.
       
       ![](Images/02.png)
    
    1. Click **OK**.

       ![](Images/03.png)

1. Update the web project to use SSL by default:
  1. In the **Solution Explorer** tool window, select the project and look at the **Properties** tool window. 
  1. Change the property **SSL Enabled** to **TRUE**.
  1. Copy the **SSL URL** property to the clipboard for use in the next step.
  1. Save your changes.

    ![](Images/SslEnabled.png)
    > It is important to do this now because in the next step when you create the application in Azure AD, you want the reply URL to use HTTPS. If you did not do this now, you would have to manually make the changes the Visual Studio wizard is going to do for you in creating the app.
    
1. Configure the project to always go to the homepage of the web application when debugging:
  1. In the **Solution Explorer** tool window & select **Properties**.
  1. Select the **Web** tab in the left margin.
  1. Find the section **Start Action**.
  1. Click the radio button **Start URL** and enter the SSL URL of the web project that you copied from the previous step.

1. Connect the SharePoint Sites service:
  1. In the **Solution Explorer**, right click the **TasksWeb** project and select **Add/Connected Service**.
  1. In the **Services Manager** dialog:
    1. Click **Register Your App**.
    1. When prompted, login with your **Organizational Account**.
    1. Click **Users and Groups**.
      1. Click **Permissions**.      
      1. Check **Enable sign-on and read users' profiles**.
      1. Click **Apply**.
    1. Click **Sites**.
      1. Click **Permissions**.
      1. Check **Create or Delete Items and Lists in All Site Collections**.
      1. Check **Edit or Delete Items in All Site Collections**.
      1. Check **Read Items in All Site Collections**.
      1. Click **Apply**.
     
       ![](Images/04.png)

    1. Click **OK**.
    
       ![](Images/05.png)

## Exercise 2: Configure Web Application to use Azure AD and OWIN
In this exercise you will take the ASP.NET MVC web application you created in the previous exercise and configure it to use Azure AD & OpenID Connect for user & app authentication. You will do this by utilizing the OWIN framework. Once authenticated, you can use the access token returned by Azure AD to access the Office 365 APIs.

1. Obtain and store the Azure AD tenant ID in the `web.config`.
  1. Browse to the [Azure Management Portal](https://manage.windowsazure.com) and sign in with your **Organizational Account**.
  1. In the left-hand navigation, click **Active Directory**.
  1. Select the directory you share with your Office 365 subscription.
  1. Select the application you created for this lab. This is the name of the application in the **App Properties** dialog when you were adding the **Connected Service** in the last exercise.
  1. Select the **Quick Start** page for the in the top navigation... that's the left-most menu item that looks like a lightning bolt in a cloud:

    ![](Images/AppQuickStart.png)
 
  1. On the Quick Start page, expand the **Get Started** / **Enable Users to Sign On**. Locate the field **Federation Metadata Document URL**. Within that field value you will see a GUID immediately after the `login.windows.net` part of the URL. Copy just the GUID value to the clipboard.

    ![](Images/TenantId.png)

  1. Open the `web.config` file in the project.
  1. Add the following node to the `<appSettings>` section, setting the value equal to the **directory tenant ID** you acquired in the previous step:

    ````xml
    <add key="ida:AadTenantId" value="######-####-####-####-############"/>
    ````

1. Add your Office 365 tenant name to the `web.config`:
  1. Open the `web.config` file in the project.
  1. Add the following node to the `<appSettings>` section, setting the value equal to the ID of your Office 365 account:

    ````xml
    <add key="ida:O365TenantId" value="######"/>
    ````

    > For example, if the root of your Office 365 tenant is `https://contoso.sharepoint.com`, you would enter **contoso** in this setting.

1. Now you need a few NuGet packages to enable OWIN OpenID Connect authentication & to create a secure token cache (using Entity Framework) in the application:
  1. Open the Package Manager Console: **View/Other Windows/Package Manager Console**.
  1. Enter each line below in the console, one at a time, pressing **ENTER** after each one. NuGet will install the package and all dependent packages:

    ````powershell
    PM> Install-Package -Id EntityFramework
    PM> Install-Package -Id Microsoft.IdentityModel.Clients.ActiveDirectory
    PM> Install-Package -Id Microsoft.Owin.Host.SystemWeb
    PM> Install-Package -Id Microsoft.Owin.Security.Cookies
    PM> Install-Package -Id Microsoft.Owin.Security.OpenIdConnect
    ````

1. Add a new model that will be used by our persistent token cache:
  1. Right-click **Models** folder in the project and select **Add/Class**.
  1. Name the class **PerWebUserCache.cs**.
  1. When the file has been created, add the following code to the class:

    ````c#
    [Key]
    public int EntryId { get; set; }
    public string webUserUniqueId { get; set; }
    public byte[] cacheBits { get; set; }
    public DateTime LastWrite { get; set; }
    ````

  1. At the top of the file, add the following `using` statement:

    ````c#
    using System.ComponentModel.DataAnnotations;
    ````

1. Add a new persistent data store that will be used for the token cache:
  1. Right-click the project and select **Add/New Folder**.
  1. Name the folder **Data**.
  1. Locate the [Lab Files](Lab Files) folder provided with this lab & find two files: `TasksWebContext.cs` & `TasksWebInitializer.cs`. Copy these two files to the **Data** folder you just created.

1. Add a token cache that leverages Entity Framework to store the user specific tokens in persistent storage:
  1. Right-click the project and select **Add/New Folder**.
  2. Name the folder **Utils**.
  1. Locate the [Lab Files](Lab Files) folder provided with this lab & find the file `EDADALTokenCache.cs`. Copy that file to the **Utils** folder.
  
    > Take a moment to examine this file. It uses the `DbContext` you added in the previous step to implement a `TokenCache` which you will use in a moment. This will store the token received from a successful authentication in a persistent store.

1. Add a helper class that will be used to harvest settings out of the `web.config` and create the necessary strings that will be used for authentication:
  1. Locate the [Lab Files](Lab Files) folder provided with this lab & find the file `SettingsHelper.cs`. Copy that file to the **Utils** folder.

1. Configure the app to run startup code when the OWIN libraries startup:
  1. Right-click the project and select **Add/Class**.
  1. Name the class **Startup.cs**.
  1. Add the following `using` statements after the existing `using` statements:

    ````c#
    using Owin;
    using Microsoft.Owin;
    ````

  1. Add the following assembly directive to call the `Startup.Configuration()` method when OWIN starts up. Note that you will only point to the class:

    ````c#
    [assembly:OwinStartup(typeof(TasksWeb.Startup))]
    ````

  1. Update the signature of the `Startup` class to be a partial class as you will create another in the next step. Do this by adding the `partial` keyword after the `public` statement so it looks like the following:

    ````c#
    public partial class Startup {}
    ````

  1. Add the following `Confguration()` to the `Startup` class. This calls a method you will create in a moment:

    ````c#
    public void Configuration(IAppBuilder app)
    {
      ConfigureAuth(app);
    }
    ````

  1. Save your changes.
1. Create an authentication process when a user hits the website:
  1. Right-click the **App_Start** folder and select **Add/Class**.
  1. Name the class **Startup.Auth.cs**.
  1. When the file opens make the following two changes:
    1. Modify the namespace to just be `TasksWeb`.
    1. Modify the class declaration to be a `partial` class named `Startup` so it looks like the following:

      ````c#
      public partial class Startup {}
      ````

  1. Add the following `using` statements after the existing `using` statements:

    ````c#
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.Cookies;
    using Microsoft.Owin.Security.OpenIdConnect;
    using Owin;
    using System.Configuration;
    using System.Threading.Tasks;
    using TasksWeb.Utils;
    ````

  1. Add the following method to the `Startup` class:

    ````c#
    public void ConfigureAuth(IAppBuilder app) {}
    ````

  1. Configure the authentication type and settings for the app:

    ````c#
    app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
    app.UseCookieAuthentication(new CookieAuthenticationOptions());
    ````

  1. Now configure the OWIN authentication process, force the user to go through the login process and collect the result returned from Azure AD:

    ````c#
    app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions {
      ClientId = SettingsHelper.ClientId,
      Authority = SettingsHelper.AzureADAuthority,
      Notifications = new OpenIdConnectAuthenticationNotifications() {
        // when an auth code is received...
        AuthorizationCodeReceived = (context) => {
          // get the OpenID Connect code passed from Azure AD on successful auth
          string code = context.Code;

          // create the app credentials & get reference to the user
          ClientCredential creds = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
          string userObjectId = context.AuthenticationTicket.Identity.FindFirst(System.IdentityModel.Claims.ClaimTypes.NameIdentifier).Value;

          // use the OpenID Connect code to obtain access token & refresh token...
          //  save those in a persistent store...
          EFADALTokenCache sampleCache = new EFADALTokenCache(userObjectId);
          AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, sampleCache);

          // obtain access token for the AzureAD graph
          Uri redirectUri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));
          AuthenticationResult authResult = authContext.AcquireTokenByAuthorizationCode(code, redirectUri, creds, SettingsHelper.AzureAdGraphResourceId);

          // successful auth
          return Task.FromResult(0);
        },
        AuthenticationFailed = (context) =>
        {
          context.HandleResponse();
          return Task.FromResult(0);
        }
      },
      TokenValidationParameters = new System.IdentityModel.Tokens.TokenValidationParameters
      {
        ValidateIssuer = false
      }
    });
    ````

  1. Save your changes.
1. With the authentication process wired up into the OWIN startup process, now implement a login controller to provide sign in & sign out functionality:
  1. Right-click the **Controllers** folder and select **Add/Controller**.
    1. In the **Add Scaffold** dialog, select **MVC 5 Controller - Empty**.
    1. Click **Add**.
    1. When prompted for a name, enter **AccountController**.
    1. Click **Add**.
  1. Within the **AccountController** file, add the following `using` statements to the top of the file:
  
    ````c#
    using TasksWeb.Utils;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.Cookies;
    using Microsoft.Owin.Security.OpenIdConnect;
    using System.Security.Claims;
    ````

  1. Delete the default `Index()` method from the `AcountController` class.
  1. Add a new function to provide a sign in route. This will simply initiate a login challenge using the OWIN framework that will take the user to the Azure AD login page. When this runs, if the user has not already given the app consent to access their Office 365 data, they will be prompted to grant the app consent at this time.

    ````c#
    public void SignIn() {
      if (!Request.IsAuthenticated) {
        HttpContext.GetOwinContext().Authentication.Challenge(new AuthenticationProperties { RedirectUri = "/" }, OpenIdConnectAuthenticationDefaults.AuthenticationType);
      }
    }
    ````

  1. Add a new function to provide a sign out route. This will log the user out of the site & clear the local cache of tokes: 

    ````c#
    public void SignOut() {
      // Remove all cache entries for this user and send an OpenID Connect sign-out request.
      string usrObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;
      AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(usrObjectId));
      authContext.TokenCache.Clear();

      HttpContext.GetOwinContext().Authentication.SignOut(
          OpenIdConnectAuthenticationDefaults.AuthenticationType, CookieAuthenticationDefaults.AuthenticationType);
    }
    ````

  1. Add a pair of functions to handle requesting consent for the application.

    ````c#
    public ActionResult ConsentApp() {
      string strResource = Request.QueryString["resource"];
      string strRedirectController = Request.QueryString["redirect"];

      string authorizationRequest = String.Format(
          "{0}oauth2/authorize?response_type=code&client_id={1}&resource={2}&redirect_uri={3}",
              Uri.EscapeDataString(SettingsHelper.AzureADAuthority),
              Uri.EscapeDataString(SettingsHelper.ClientId),
              Uri.EscapeDataString(strResource),
              Uri.EscapeDataString(String.Format("{0}/{1}", this.Request.Url.GetLeftPart(UriPartial.Authority), strRedirectController))
              );

      return new RedirectResult(authorizationRequest);
    }

    public ActionResult AdminConsentApp() {
      string strResource = Request.QueryString["resource"];
      string strRedirectController = Request.QueryString["redirect"];

      string authorizationRequest = String.Format(
          "{0}oauth2/authorize?response_type=code&client_id={1}&resource={2}&redirect_uri={3}&prompt={4}",
              Uri.EscapeDataString(SettingsHelper.AzureADAuthority),
              Uri.EscapeDataString(SettingsHelper.ClientId),
              Uri.EscapeDataString(strResource),
              Uri.EscapeDataString(String.Format("{0}/{1}", this.Request.Url.GetLeftPart(UriPartial.Authority), strRedirectController)),
              Uri.EscapeDataString("admin_consent")
              );

      return new RedirectResult(authorizationRequest);
    }
    ````

  1. Add one more function to the `AccountController` class to refresh the session and reissue the OWIN authentication challenge:
      
    ````c#
    public void RefreshSession() {
      string strRedirectController = Request.QueryString["redirect"];

      HttpContext.GetOwinContext().Authentication.Challenge(new AuthenticationProperties { RedirectUri = String.Format("/{0}", strRedirectController) }, OpenIdConnectAuthenticationDefaults.AuthenticationType);
    }
    ````

  1. Now that the **AccountController** is setup, the last step is to implement the user interface components to provide sign in and sign out capabilities.
    1. Locate the **Views/Shared** folder in the project.
    1. Right-click the folder and select **Add/View**.
    1. Complete the **Add View** dialog as shown in the following picture, then click **Add**:
      
      ![](Images/LoginPartial.png)

    1. Add the following code to the **_LoginPartial.cshtml** file:

      ````asp
      @if (Request.IsAuthenticated) {
        <text>
          <ul class="nav navbar-nav navbar-right">
            <li class="navbar-text">
              Hello, @User.Identity.Name!
            </li>
            <li>
              @Html.ActionLink("Sign out", "SignOut", "Account")
            </li>
          </ul>
        </text>
      } else {
        <ul class="nav navbar-nav navbar-right">
          <li>@Html.ActionLink("Sign in", "SignIn", "Account", routeValues: null, htmlAttributes: new { id = "loginLink" })</li>
        </ul>
      }
      ````

    1. Open the **_Layout.cshtml** file found in the **Views/Shared** folder.
      1. Locate the part of the file that includes a few links at the top of the page... it should look similar to the following code:
      
        ````asp
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li>@Html.ActionLink("Home", "Index", "Home")</li>
            <li>@Html.ActionLink("About", "About", "Home")</li>
            <li>@Html.ActionLink("Contact", "Contact", "Home")</li>
          </ul>
        </div>
        ````

      1. Update that navigation to have a new link (the **Tasks** link added below) as well as a reference to the login control you just created:

        ````asp
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li>@Html.ActionLink("Home", "Index", "Home")</li>
            <li>@Html.ActionLink("About", "About", "Home")</li>
            <li>@Html.ActionLink("Contact", "Contact", "Home")</li>
            <li>@Html.ActionLink("Tasks", "Index", "SpTask")</li>
          </ul>
          @Html.Partial("_LoginPartial")
        </div>
        ````

        > The **Tasks** link will not work yet... you will add that in the next exercise.

1. Lastly, because this web application will use the antiforgery token, you need to make sure the unique ID used by the token is a value in the user claim. This should be explicitly set so you don't assume the default one is there.
  1. Open the `global.asax.cs` file in your project.
  1. Add the following two statements to the end of the existing `using` statements:
    
    ````c#
    using System.Web.Helpers;
    using System.IdentityModel.Claims;
    ````

  1. Next, add the following line to the end of the `Application_Start()` method:
  
    ````c#
    AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;
    ````

1. At this point you can test the authentication flow for your application.
  1. In Visual Studio, press **F5**. The browser will automatically launch taking you to the HTTPS start page for the web application.
  1. To sign in, click the **Sign In** link the upper-right corner.
  1. Login using your **Organizational Account**.
  1. Upon a successful login, since this will be the first time you have logged into this app, Azure AD will present you with the common consent dialog that looks similar to the following image:

    ![](Images/ConsentDialog.png)

  1. Click **OK** to approve the app's permission request on your data in Office 365.
  1. You will then be redirected back to your web application. However notice in the upper right corner, it now shows your email address & the **Sign Out** link.

Congratulations... at this point your app is configured with Azure AD and leverages OpenID Connect and OWIN to facilitate the authentication process!

## Exercise 3: Use Azure AD Access Token to call SharePoint REST API
In this exercise, you will create a repository object for wrapping CRUD operations associated with the Tasks list and use the repository to read the list.

1. In the **Solution Explorer**, right click the **Models** folder and select **Add/Class**.
1. In the **Add New Item** dialog, name the new class **SpTask.cs**.
1. Click **Add**.
1. **Add** the following properties to hold data for an individual task.

  ````c#
  public string Id { get; set; }
  public string Title { get; set; }
  public string Priority { get; set; }
  public string Status { get; set; }
  ````

1. In the **Solution Explorer**, right click the **Models** folder and select **Add/Class**.
1. In the **Add New Item** dialog, name the new class **SpTaskRepository.cs**.
1. Click **Add**.
1. **Add** the following references to the top of the `TaskRepository` class.

  ````c#
  using Microsoft.IdentityModel.Clients.ActiveDirectory;
  using Microsoft.Office365.Discovery;
  using Microsoft.Office365.SharePoint;
  using Newtonsoft.Json;
  using System.IO;
  using System.Net.Http;
  using System.Net.Http.Headers;
  using System.Security.Claims;
  using System.Text;
  using System.Threading.Tasks;
  using System.Xml.Linq;
  using TasksWeb.Utils;
  ````

1. **Add** the following code to return an access token you can use with the REST API.

  ````c#
  private async Task<string> GetAccessToken() {
    // fetch from stuff user claims
    var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
    var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

    // discover contact endpoint
    var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
    var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

    // create auth context
    AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(signInUserId));

    // authenticate
    var authResult = await authContext.AcquireTokenSilentAsync(SettingsHelper.SharePointServiceResourceId, clientCredential, userIdentifier);

    // obtain access token
    return authResult.AccessToken;
  }
  ````

1. Before adding the code to submit & retrieve tasks to & from SharePoint, to make processing the responses easier, add a template class file that can be used to serialize & deserialize the responses.
  1. Locate the [Lab Files](Lab Files) folder provided with this lab & find the file **SpTaskJson.cs**. Copy that file to the **Utils** folder.
  1. Add this file to the **Models** folder.
1. **Add** the following code to read a page of Tasks.
 
  ````c#
  public async Task<List<SpTask>> GetTasks(int pageIndex, int pageSize) {
    StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
      .Append("/_api/web/lists/getbytitle('Tasks')/items")
      .Append("?$select=Id,Title,Status,Priority");

    HttpClient client = new HttpClient();
    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
    request.Headers.Add("ACCEPT", "application/json;odata=verbose");
    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());

    HttpResponseMessage response = await client.SendAsync(request);
    string responseString = await response.Content.ReadAsStringAsync();
    var spTaskJsonResponse = JsonConvert.DeserializeObject<SpTaskJsonCollection>(responseString);

    List<SpTask> tasks = new List<SpTask>();

    foreach (var spListitem in spTaskJsonResponse.Data.Results) {
      SpTask task = new SpTask {
        Id = spListitem.Id.ToString(),
        Title = spListitem.Title,
        Status = spListitem.Status,
        Priority = spListitem.Priority
      };
      tasks.Add(task);
    }

    return tasks.OrderBy(e => e.Title).Skip(pageIndex * pageSize).Take(pageSize).ToList();
  }
  ````

1. Add the following code to read a single Task item:

  ````c#
  public async Task<SpTask> GetTask(string Id) {
    StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
        .Append("/_api/web/lists/getbytitle('Tasks')/items")
        .Append("(" + Id + ")")
        .Append("?$select=Id,Title,Status,Priority");

    HttpClient client = new HttpClient();
    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
    request.Headers.Add("ACCEPT", "application/json;odata=verbose");
    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());

    HttpResponseMessage response = await client.SendAsync(request);
    string responseString = await response.Content.ReadAsStringAsync();
    var spTaskJsonResponse = JsonConvert.DeserializeObject<SpTaskJsonSingle>(responseString);

    SpTask task = new SpTask {
      Id = spTaskJsonResponse.Data.Id.ToString(),
      Title = spTaskJsonResponse.Data.Title,
      Status = spTaskJsonResponse.Data.Status,
      Priority = spTaskJsonResponse.Data.Priority
    };

    return task;
  }
  ````

1. Add the following code to create a task:

  ````c#
  public async Task CreateTask(SpTask task) {
    StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
        .Append("/_api/web/lists/getByTitle('Tasks')/items");

    var newTaskJson = new SpTaskJson {
      __metadata = new __Metadata { Type = "SP.Data.TasksListItem" },
      Title = task.Title,
      Status = task.Status,
      Priority = task.Priority
    };

    StringContent requestContent = new StringContent(JsonConvert.SerializeObject(
      newTaskJson,
      Formatting.None,
      new JsonSerializerSettings {
        NullValueHandling = NullValueHandling.Ignore
      }));
    requestContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

    HttpClient client = new HttpClient();
    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
    request.Headers.Add("ACCEPT", "application/json;odata=verbose");
    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
    request.Content = requestContent;

    await client.SendAsync(request);
  }
  ````

1. Add the following code to update a task:

  ````c#
  public async Task UpdateTask(SpTask task) {
    StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
      .Append("/_api/web/lists/getByTitle('Tasks')/items")
      .Append("(" + task.Id + ")");

    var newTaskJson = new SpTaskJson {
      __metadata = new __Metadata { Type = "SP.Data.TasksListItem" },
      Title = task.Title,
      Status = task.Status,
      Priority = task.Priority
    };

    StringContent requestContent = new StringContent(JsonConvert.SerializeObject(
      newTaskJson,
      Formatting.None,
      new JsonSerializerSettings {
        NullValueHandling = NullValueHandling.Ignore
      }));
    requestContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

    HttpClient client = new HttpClient();
    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
    request.Headers.Add("ACCEPT", "application/json;odata=verbose");
    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
    request.Content = requestContent;
    request.Headers.Add("IF-MATCH", "*");
    request.Headers.Add("X-HTTP-Method", "MERGE");

    await client.SendAsync(request);
  }
  ````

1. Add the following code to delete a task: 

  ````c#
  public async Task Delete(string Id) {
    StringBuilder requestUri = new StringBuilder(SettingsHelper.SharePointServiceEndpoint)
      .Append("/_api/web/lists/getByTitle('Tasks')/items")
      .Append("(" + Id + ")");

    HttpClient client = new HttpClient();
    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
    request.Headers.Add("ACCEPT", "application/json;odata=verbose");
    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
    request.Headers.Add("IF-MATCH", "*");
    HttpResponseMessage response = await client.SendAsync(request);
  }
  ````

## Exercise 4: Code the MVC Application
In this exercise, you will code the MVC application to allow navigating the tasks collection.

1. In the **Solution Explorer**, right click the **Models** folder and select **Add/Class**.
  1. In the **Add New Item** dialog, name the new class **SpTaskViewModel.cs**.
  1. Click **Add**.
1. Add the following method to hold data for the view.

  ````c#
  public int PageIndex { get; set; }
  public int PageSize { get; set; }
  public List<SpTask> SpTasks { get; set; }
  ````

1. Right-click the **Controllers** folder and select **Add/Controller**.
  1. In the **Add Scaffold** dialog, select **MVC 5 Controller - Empty** and click **Add**.
  1. In the **Add Controller** dialog, give the controller the name **SpTaskController** and click **Add**.
1. **Add** the following references to the top of the file.

  ````c#
  using System.Threading.Tasks;
  using TasksWeb.Models;
  ````

1. Add the following method to the controller to get a list of tasks and add them to the model. This will also handle deleting items if they are posted to this route.

  ````c#
  [Authorize]
  public async Task<ActionResult> Index(int? pageIndex, int? pageSize, string taskId) {
    SpTaskRepository repository = new SpTaskRepository();

    if (Request.HttpMethod == "POST" && taskId != null)
    {
      await repository.Delete(taskId);
      return Redirect("/");
    }

    SpTaskViewModel model = new SpTaskViewModel();

    if (pageIndex == null) {
      model.PageIndex = 0;
    } else {
      model.PageIndex = (int)pageIndex;
    }

    if (pageSize == null) {
      model.PageSize = 10;
    } else {
      model.PageSize = (int)pageSize;
    }

    model.SpTasks = await repository.GetTasks(model.PageIndex, model.PageSize);

    return View(model);
  }
  ````

1. Within the `SpTaskController` class, right click the `View()` at the end of the `Index()` method and select **Add View**.
  1. Within the **Add View** dialog, set the following values:
    1. View Name: **Index**.
    1. Template: **Empty (without model)**.
      
      > Leave all other fields blank & unchecked.
    
    1. Click **Add**.
1. **Replace** all of the code in the file with the following:

  ````asp
  @model TasksWeb.Models.SpTaskViewModel

  @{
    ViewBag.Title = "Tasks";
  }

  <h2>Tasks</h2>

  <div class="row" style="margin-top:50px;">
    <div class="col-sm-12">
      @{
        Dictionary<string, object> attributes4 = new Dictionary<string, object>();
        attributes4.Add("class", "btn btn-default");
        @Html.ActionLink("New Task", "Create", "SpTask", null, attributes4);
      }
    </div>
  </div>
  <div class="row" style="margin-top:50px;">
    <div class="col-sm-12">
      <div class="table-responsive">
        <table id="filesTable" class="table table-striped table-bordered">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            @foreach (var task in @Model.SpTasks) {
              <tr>
                <td>
                  @using (Html.BeginForm()) {
                    @Html.AntiForgeryToken()
                    <input type="hidden" id="taskId" name="taskId" value="@task.Id" />
                    <input type="submit" value="Delete" class="btn btn-warning" />
                  }
                </td>
                <td>
                  @{
                  Dictionary<string, object> attributes2 = new Dictionary<string, object>();
                  attributes2.Add("class", "btn btn-default");

                  RouteValueDictionary routeValues2 = new RouteValueDictionary();
                  routeValues2.Add("taskId", task.Id);
                  @Html.ActionLink("Details", "Details", "SpTask", routeValues2, attributes2);
                  }
                </td>
                <td>
                  @task.Title
                </td>
                <td>
                  @task.Status
                </td>
                <td>
                  @task.Priority
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div class="btn btn-group-sm">
        @{
          Dictionary<string, object> attributes3 = new Dictionary<string, object>();
          attributes3.Add("class", "btn btn-default");

          RouteValueDictionary routeValues3 = new RouteValueDictionary();
          routeValues3.Add("pageIndex", (Model.PageIndex == 0 ? 0 : Model.PageIndex - 1).ToString());
          routeValues3.Add("pageSize", Model.PageSize.ToString());
          @Html.ActionLink("Prev", "Index", "SpTask", routeValues3, attributes3);
        }
        @{
          RouteValueDictionary routeValues4 = new RouteValueDictionary();
          routeValues4.Add("pageIndex", (Model.PageIndex + 1).ToString());
          routeValues4.Add("pageSize", Model.PageSize.ToString());
          @Html.ActionLink("Next", "Index", "SpTask", routeValues4, attributes3);
        }
      </div>
    </div>
  </div>
  ````

1. Add the following method to the controller to get a specific task:

  ````c#
  [Authorize]
  public async Task<ActionResult> Details(string taskId) {
    SpTaskRepository repository = new SpTaskRepository();

    SpTask task = await repository.GetTask(taskId);

    return View(task);
  }
  ````

1. Within the `SpTaskController` class, right click the `View()` at the end of the `Details()` method and select **Add View**.
  1. Within the **Add View** dialog, set the following values:
    1. View Name: **Detail**.
    1. Template: **Details**.
    1. Model class: **SpTask (TasksWeb.Models)**.
    1. Click **Add**.

      ![](Images/AddDetailsView.png)

1. Add the following method to the controller to create a specific task:

  ````c#
  [Authorize]
  public async Task<ActionResult> Create(SpTask task)
  {
    SpTaskRepository repository = new SpTaskRepository();

    if (Request.HttpMethod == "POST")
    {
      await repository.CreateTask(task);
      return Redirect("/");
    }
    else
    {
      return View(task);
    }
  }
  ````

1. Within the `SpTaskController` class, right click the `View()` at the end of the `Create()` method and select **Add View**.
  1. Within the **Add View** dialog, set the following values:
    1. View Name: **Create**.
    1. Template: **Create**.
    1. Model class: **SpTask (TasksWeb.Models)**.
    1. Click **Add**.

      ![](Images/AddCreateView.png)

1. Add the following method to the controller to edit a specific task:

  ````c#
  [Authorize]
  public async Task<ActionResult> Edit(string Id, SpTask task)
  {
    SpTaskRepository repository = new SpTaskRepository();

    if (Request.HttpMethod == "POST")
    {
      await repository.UpdateTask(task);
      return Redirect("/");
    }
    else
    {
      task = await repository.GetTask(Id);
      return View(task);
    }
  }
  ````

1. Within the `SpTaskController` class, right click the `View()` at the end of the `Edit()` method and select **Add View**.
  1. Within the **Add View** dialog, set the following values:
    1. View Name: **Edit**.
    1. Template: **Edit**.
    1. Model class: **SpTask (TasksWeb.Models)**.
    1. Click **Add**.

      ![](Images/AddEditView.png)

1. Press **F5** to begin debugging.
1. Test the list, detail, paging, creation, edit and delete functionality of the application.

Congratulations! You have completed working with the SharePoint Site APIs.
