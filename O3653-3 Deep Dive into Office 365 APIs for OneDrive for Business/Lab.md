# Office 365 APIs for OneDrive for Business
In this lab, you will use the Office 365 APIs for OneDrive for Business as part of an ASP.NET MVC5 application.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
1. You must have the Office 365 API Tools version 1.2.41027.2 installed in Visual Studio 2013.

## Exercise 1: Create an ASP.NET MVC5 Application
In this exercise, you will create the ASP.NET MVC5 application and register it with Azure active Directory.

1. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  1. In Visual Studio select **File/New/Project**.
  1. In the **New Project** dialog:
    1. Select **Templates/Visual C#/Web**.
    1. Click **ASP.NET Web Application**.
    1. Name the new project **OneDriveWeb**.
    1. Click **OK**.

       ![](Images/01.png?raw=true "Figure 1")

  1. In the **New ASP.NET Project** dialog:
    1. Click **MVC**.
    1. Click **Change Authentication**.
    1. Select **No Authentication**.
    1. Click **OK**.

       ![](Images/02.png?raw=true "Figure 2")

    1. Click **OK**.

       ![](Images/03.png?raw=true "Figure 3")

1. Connect the OneDrive for Business service:
  1. In the **Solution Explorer**, right click the **OneDriveWeb** project and select **Add/Connected Service**.
  1. In the **Services Manager** dialog:
    1. Click **Register Your App**.
    1. When prompted, login with your **Organizational Account**.
    1. Click **Users and Groups**.
      1. Click **Permissions**.      
      1. Check **Enable sign-on and read users' profiles**.
      1. Click **Apply**.

       ![](Images/UsersAndGroups.png)
    1. Click **My Files**.
      1. Click **Permissions**.
      1. Check **Edit or Delete User's Files**.
      1. Check **Read User's Files**.
      1. Click **Apply**.

         ![](Images/04.png?raw=true "Figure 4")
    1. Click **Sites**.
      1. Click **Permissions**.
      1. Check **Create or Delete items and lists in all site collections**.
      1. Check **Edit or Delete items in all site collections**.
      1. Check **Read items in all site collections**.
      1. Click **Apply**.

         ![](Images/05.png?raw=true "Figure 5")
    1. Click **OK**.

       ![](Images/06.png?raw=true "Figure 6")
1. Obtain and store the Azure AD tenant ID in the `web.config`.
  1. Browse to the [Azure Management Portal](https://manage.windowsazure.com) and sign in with your **Organizational Account**.
  2. In the left-hand navigation, click **Active Directory**.
  3. Select the directory you share with your Office 365 subscription.
  4. In the URL, find the first GUID and copy it to the clipboard. This is your **directory tenant ID**.
    > The URL will look like the following with the **BOLD** part being the GUID you are looking for: `https://manage.windowsazure.com/[..]#Workspaces/ActiveDirectoryExtension/Directory/[YOU WANT THIS GUID: ######-####-####-####-############]/users`
  5. Open the `web.config` file in the project.
  6. Add the following node to the `<appSettings>` section, setting the value equal to the **directory tenant ID** you acquired in the previous step:

    ````xml
    <add key="tenantId" value="######-####-####-####-############"/>
    ````

## Exercise 2: Configure the Project to use OWIN for Azure AD Authentication
1. Add the NuGet OWIN packages to enable OWIN OpenID Connect authentication on the application:
  1. Open the Package Manager Console: **View/Other Windows/Package Manager Console**.
  1. First restore all missing packages by clicking the **Restore** button in the top-right corner of the window.
  1. After that completes, enter each line below in the console, one at a time, pressing **ENTER** after each one. NuGet will install the package and all dependent packages:

    ````powershell
    PM> Install-Package -Id Microsoft.Owin.Host.SystemWeb
    PM> Install-Package -Id Microsoft.Owin.Security.Cookies
    PM> Install-Package -Id Microsoft.Owin.Security.OpenIdConnect
    ````

1. Add a temp token cache. Notice the comments in the code as this is not intended to be used in production as it is exactly what it's name implies: naive.
  1. Right-click the project and select **Add/New Folder**.
  1. Name the folder **Utils**.
  1. Right-click the **Utils** folder and select **Add/Class**.
  1. Name the class **NaiveSessionCache**.
  1. Replace the code in the **NaiveSessionCache.cs** file with the following code (this file is also found in the [Lab Files](Lab Files) folder):

    ````c#
    // Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using System.Threading;
    using System.Web;

    namespace OneDriveWeb.Utils {
      /// <summary>
      /// A basic token cache using current session
      /// ADAL will automatically save tokens in the cache whenever you obtain them.  
      /// More details here: http://www.cloudidentity.com/blog/2014/07/09/the-new-token-cache-in-adal-v2/
      /// !!! NOTE: DO NOT USE THIS IN PRODUCTION. A MORE PERSISTENT CACHE SUCH AS A DATABASE IS RECOMMENDED FOR PRODUCTION USE !!!!
      /// </summary>
      public class NaiveSessionCache : TokenCache {
        private static ReaderWriterLockSlim SessionLock = new ReaderWriterLockSlim(LockRecursionPolicy.NoRecursion);
        string UserObjectId = string.Empty;
        string CacheId = string.Empty;

        public NaiveSessionCache(string userId) {
          UserObjectId = userId;
          CacheId = UserObjectId + "_TokenCache";

          this.AfterAccess = AfterAccessNotification;
          this.BeforeAccess = BeforeAccessNotification;
          Load();
        }

        public void Load() {
          SessionLock.EnterReadLock();
          this.Deserialize((byte[])HttpContext.Current.Session[CacheId]);
          SessionLock.ExitReadLock();
        }

        public void Persist() {
          SessionLock.EnterWriteLock();

          // Optimistically set HasStateChanged to false. We need to do it early to avoid losing changes made by a concurrent thread.
          this.HasStateChanged = false;

          // Reflect changes in the persistent store
          HttpContext.Current.Session[CacheId] = this.Serialize();
          SessionLock.ExitWriteLock();
        }

        public override void DeleteItem(TokenCacheItem item) {
          base.DeleteItem(item);
          Persist();
        }

        // Empties the persistent store.
        public override void Clear() {
          base.Clear();
          System.Web.HttpContext.Current.Session.Remove(CacheId);
        }

        // Triggered right before ADAL needs to access the cache.
        // Reload the cache from the persistent store in case it changed since the last access.
        void BeforeAccessNotification(TokenCacheNotificationArgs args) {
          Load();
        }

        // Triggered right after ADAL accessed the cache.
        void AfterAccessNotification(TokenCacheNotificationArgs args) {
          // if the access operation resulted in a cache update
          if (this.HasStateChanged) {
            Persist();
          }
        }
      }
    }
    //*********************************************************  
    //  
    //O365 APIs Starter Project for ASPNET MVC, https://github.com/OfficeDev/Office-365-APIs-Starter-Project-for-ASPNETMVC
    // 
    //Copyright (c) Microsoft Corporation 
    //All rights reserved.  
    // 
    //MIT License: 
    // 
    //Permission is hereby granted, free of charge, to any person obtaining 
    //a copy of this software and associated documentation files (the 
    //""Software""), to deal in the Software without restriction, including 
    //without limitation the rights to use, copy, modify, merge, publish, 
    //distribute, sublicense, and/or sell copies of the Software, and to 
    //permit persons to whom the Software is furnished to do so, subject to 
    //the following conditions: 
    // 
    //The above copyright notice and this permission notice shall be 
    //included in all copies or substantial portions of the Software. 
    // 
    //THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND, 
    //EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
    //MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
    //NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
    //LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
    //OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
    //WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
    //  
    //********************************************************* 
    ````

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
    [assembly:OwinStartup(typeof(Exercise2.Startup))]
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
    1. Modify the namespace to just be `Exercise2`.
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
    ````

  1. Add the following variables and constants to the class for later use:

    ````c#
    private static string CLIENT_ID = ConfigurationManager.AppSettings["ida:ClientID"];
    private static string CLIENT_SECRET = ConfigurationManager.AppSettings["ida:Password"];
    private static string TENANT_ID = ConfigurationManager.AppSettings["tenantId"];
    private static string GRAPH_RESOURCE_ID = "https://graph.windows.net";
    ````

  1. Add the following method to the `Startup` class:

    ````c#
    public void ConfigureAuth(IAppBuilder app) {}
    ````

  1. Create a variable to store the tenant authority for later use when logging in:

    ````c#
    // create the authority for user login by concatenating the 
    //  URI added by O365 API tools in web.config 
    //  & user's tenant ID provided in the claims when the logged in
    var tenantAuthority = string.Format("{0}/{1}",
      ConfigurationManager.AppSettings["ida:AuthorizationUri"],
      TENANT_ID);
    ````

  1. Configure the authentication type and settings for the app:

    ````c#
    app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
    app.UseCookieAuthentication(new CookieAuthenticationOptions());
    ````

  1. Now configure the OWIN authentication process, force the user to go through the login process and collect the result returned from Azure AD:

    ````c#
    app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions {
      ClientId = CLIENT_ID,
      Authority = tenantAuthority,
      Notifications = new OpenIdConnectAuthenticationNotifications() {
        // when an auth code is received...
        AuthorizationCodeReceived = (context) => {
          // get the OpenID Connect code passed from Azure AD on successful auth
          string code = context.Code;

          // create the app credentials & get reference to the user
          ClientCredential creds = new ClientCredential(CLIENT_ID, CLIENT_SECRET);
          string userObjectId = context.AuthenticationTicket.Identity.FindFirst(System.IdentityModel.Claims.ClaimTypes.NameIdentifier).Value;

          // use the OpenID Connect code to obtain access token & refresh token...
          //  save those in a persistent store... for now, use the simplistic NaiveSessionCache
          //  NOTE: read up on the links in the NaieveSessionCache... should not be used in production
          Utils.NaiveSessionCache sampleCache = new Utils.NaiveSessionCache(userObjectId);
          AuthenticationContext authContext = new AuthenticationContext(tenantAuthority, sampleCache);

          // obtain access token for the AzureAD graph
          Uri redirectUri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));
          AuthenticationResult authResult = authContext.AcquireTokenByAuthorizationCode(
            code, redirectUri, creds, GRAPH_RESOURCE_ID);

          // successful auth
          return Task.FromResult(0);
        }

      }
    });
    ````

  1. Save your changes.

## Exercise 3: Code the Files API
In this exercise, you will create a repository object for wrapping CRUD operations associated with the Files API.

1. In the **Solution Explorer**, locate the **Models** folder in the **OneDriveWeb** project.
2. Right-click the **Models** folder and select **Add/Class**.
1. In the **Add New Item** dialog, name the new class **FileRepository.cs**.
1. Click **Add**.
  ![](Images/07.png?raw=true "Figure 7")

1. **Add** the following references to the top of the `FileRepository` class.

  ````c#
  using Microsoft.IdentityModel.Clients.ActiveDirectory;
  using Microsoft.Office365.Discovery;
  using Microsoft.Office365.OAuth;
  using Microsoft.Office365.SharePoint;
  using Microsoft.Office365.SharePoint.CoreServices;
  using Microsoft.Office365.SharePoint.FileServices;
  using OneDriveWeb.Utils;
  using System.Configuration;
  using System.Security.Claims;
  using System.Threading.Tasks;
  ````

1. **Add** the following `using` statements to the top of the `FileRepository` class.

  ````c#
  private static string CLIENT_ID = ConfigurationManager.AppSettings["ida:ClientID"];
  private static string CLIENT_SECRET = ConfigurationManager.AppSettings["ida:Password"];
  private static string TENANT_ID = ConfigurationManager.AppSettings["tenantId"];
  const string DISCOVERY_ENDPOINT = "https://api.office.com/discovery/v1.0/me/";
  const string DISCOVERY_RESOURCE = "https://api.office.com/discovery/";
  ````

1. **Add** a method named `EnsureClientCreated()` to the `FileRepository` class with the following implementation to create and return an **SharePointClient** object.
    
  ````c#
  private async Task<SharePointClient> EnsureClientCreated() {
    // fetch from stuff user claims
    var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
    var userObjectId =
      ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;

    // create the authority by concatenating the URI added by O365 API tools in web.config 
    //  & user's tenant ID provided in the claims when the logged in
    var tenantAuthority = string.Format("{0}/{1}",
      ConfigurationManager.AppSettings["ida:AuthorizationUri"],
      TENANT_ID);

    // discover contact endpoint
    var clientCredential = new ClientCredential(CLIENT_ID, CLIENT_SECRET);
    var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

    // create auth context
    AuthenticationContext authContext = new AuthenticationContext(tenantAuthority, new Utils.NaiveSessionCache(signInUserId));

    // create O365 discovery client 
    DiscoveryClient discoveryClient = new DiscoveryClient(new Uri(DISCOVERY_ENDPOINT),
      async () => {
        var authResult = await authContext.AcquireTokenSilentAsync(DISCOVERY_RESOURCE, clientCredential, userIdentifier);

        return authResult.AccessToken;
      });

    // query discovery service for endpoint for 'calendar' endpoint
    CapabilityDiscoveryResult dcr = await discoveryClient.DiscoverCapabilityAsync("MyFiles");

    // create an OutlookServicesclient
    return new SharePointClient(dcr.ServiceEndpointUri,
      async () => {
        var authResult =
          await
            authContext.AcquireTokenSilentAsync(dcr.ServiceResourceId, clientCredential, userIdentifier);
        return authResult.AccessToken;
      });
  }
  ````

1. **Add** the following code to read a page of files.

  ````c#
  public async Task<IEnumerable<IITem>> GetMyFiles(int pageIndex, int pageSize)
  {
      var client = await EnsureClientCreated();

      var filesResults = await client.Files.ExecuteAsync();
      return filesResults.CurrentPage.OrderBy(e => e.Name).Skip(pageIndex * pageSize).Take(pageSize);
  }
  ````

1. **Add** the following code to upload a file.

  ````c#
  public async Task<File> UploadFile(System.IO.Stream filestream, string filename){
    var client = await EnsureClientCreated();

    File newFile = new File {
      Type = "File",
      Name = filename
    };

    // create the entry for the file
    await client.Files.AddItemAsync(newFile);
    // upload the file
    await client.Files.GetById(newFile.Id).ToFile().UploadAsync(filestream);

    return newFile;
  }
  ````

1. **Add** the following code to delete a file.

  ````c#
  public async Task DeleteFile(string id) {
    var client = await EnsureClientCreated();

    IFile file = await client.Files.GetById(id).ToFile().ExecuteAsync();
    await file.DeleteAsync();
  }
  ````

## Exercise 4: Code the MVC Application
In this exercise, you will code the MVC application to allow navigating the OneDrive for Business file collection.

1. In the **Solution Explorer**, expand the **Controllers** folder and open the **HomeController.cs** file.
1. **Add** the following references to the top of the file.

  ````c#
  using OneDriveWeb.Models;
  using System.Threading.Tasks;
  ````

1. **Replace** the **Index** method with the following code to read files.

  ````c#
  [Authorize]
  public async Task<ActionResult> Index(int? pageIndex, int? pageSize) {
    
    FileRepository repository = new FileRepository();

    // setup paging defaults if not provided
    pageIndex = pageIndex ?? 0;
    pageSize = pageSize ?? 10;

    // setup paging for the IU
    ViewBag.PageIndex = (int) pageIndex;
    ViewBag.PageSize = (int) pageSize;

    var myFiles = await repository.GetMyFiles((int) pageIndex, (int) pageSize);
    var results = myFiles.OrderBy(f => f.Name);

    return View(results);
  }
  ````

1. In the **Solution Explorer**, expand the **Views/Home** folder and open the **Index.cshtml** file.
1. **Replace** all of the code in the file with the following:

  ````asp
  @model IEnumerable<Microsoft.Office365.SharePoint.FileServices.IItem>

  @{ ViewBag.Title = "My Files"; }

  <h2>My Files</h2>

  <div class="row" style="margin-top:50px;">
    <div class="col-sm-12">
        <div class="table-responsive">
            <table id="filesTable" class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Created</th>
                        <th>Modified</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach (var file in Model)
                    {
                        <tr>
                            <td>
                                @{
                                    //Place delete control here
                                }
                            </td>
                            <td>
                                @file.Id
                            </td>
                            <td>
                                <a href="@file.WebUrl">@file.Name</a>
                            </td>
                            <td>
                                @file.DateTimeCreated
                            </td>
                            <td>
                                @file.DateTimeLastModified
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
        <div class="btn btn-group-sm">
            @{
                //Place Paging controls here
            }
        </div>
    </div>
  </div>
  ````

1. Open a browser and navigate to `https://[tenant].onedrive.com`.
1. Make sure that you have some test files available in the library.
1. In **Visual Studio**, hit **F5** to begin debugging.
1. When prompted, log in with your **Organizational Account**.
1. Verify that your application displays files from the OneDrive for Business library.

  ![](Images/08.png?raw=true "Figure 8")

1. Stop debugging.
1. In the **HomeController.cs** file, **add** the following code to upload and delete files.

  ````c#
  public async Task<ActionResult> Upload()
  {

      FileRepository repository = new FileRepository();

      foreach (string key in Request.Files)
      {
          if (Request.Files[key] != null && Request.Files[key].ContentLength > 0)
          {
              var file = await repository.UploadFile(
                  Request.Files[key].InputStream,
                  Request.Files[key].FileName.Split('\\')[Request.Files[key].FileName.Split('\\').Length - 1]);
          }
      }

      return Redirect("/");
  }

  public async Task<ActionResult> Delete(string name)
  {
      FileRepository repository = new FileRepository();

      if (name != null)
      {
          await repository.DeleteFile(name);
      }

      return Redirect("/");

  }
  ````

1. In the **Index.cshtml** file, **add** the following code under the comment `Place delete control here`.

  ````c#
  Dictionary<string, object> attributes1 = new Dictionary<string, object>();
  attributes1.Add("class", "btn btn-warning");

  RouteValueDictionary routeValues1 = new RouteValueDictionary();
  routeValues1.Add("name", file.Id);
  @Html.ActionLink("X", "Delete", "Home", routeValues1, attributes1);
  ````

1. **Add** the following code under the comment `Place Paging controls here`:

  ````c#
  Dictionary<string, object> attributes2 = new Dictionary<string, object>();
  attributes2.Add("class", "btn btn-default");

  RouteValueDictionary routeValues2 = new RouteValueDictionary();
  routeValues2.Add("pageIndex", (ViewBag.PageIndex == 0 ? 0 : ViewBag.PageIndex - 1).ToString());
  routeValues2.Add("pageSize", ViewBag.PageSize.ToString());
  @Html.ActionLink("Prev", "Index", "Home", routeValues2, attributes2);

  RouteValueDictionary routeValues3 = new RouteValueDictionary();
  routeValues3.Add("pageIndex", (ViewBag.PageIndex + 1).ToString());
  routeValues3.Add("pageSize", ViewBag.PageSize.ToString());
  @Html.ActionLink("Next", "Index", "Home", routeValues3, attributes2);
  ````

1. **Add** the following code to the bottom of the **Index.cshtml** file to create an upload control.

  ````asp
  <div class="row" style="margin-top:50px;">
    <div class="col-sm-12">
        @using (Html.BeginForm("Upload", "Home", FormMethod.Post, new { enctype = "multipart/form-data" }))
        {
            <input type="file" id="file" name="file" class="btn btn-default" />
            <input type="submit" id="submit" name="submit" value="Upload" class="btn btn-default" />
        }
    </div>
  </div>
  ````

1. Press **F5** to begin debugging.
1. Test the paging, upload, and delete functionality of the application.

Congratulations! You have completed working with the OneDrive for Business APIs.
