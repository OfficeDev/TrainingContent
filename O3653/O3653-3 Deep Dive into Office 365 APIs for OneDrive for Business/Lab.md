# Microsoft Graph for OneDrive for Business
In this lab, you will use Microsoft Graph to integrate Office 365 OneDrive for Business with an ASP.NET MVC5 application.

## Prerequisites
1. You must have an Office 365 tenant and Microsoft Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
1. You must have Visual Studio 2015 with Update 1 installed.

## Exercise 1: Create an ASP.NET MVC5 Application
In this exercise, you will create the ASP.NET MVC5 application and register it with Azure active Directory.

1. Launch **Visual Studio 2015** as an administrator. 
1. In Visual Studio select **File/New/Project**.
1. In the **New Project** dialog, select **Templates/Visual C#/Web** and click **ASP.NET Web Application**. Name the new project **OneDriveWeb** and then click **OK**.  
    
    ![Screenshot of the previous step](Images/01.png)
    > **Note:** Make sure you enter the exact same name for the Visual Studio Project that is specified in these lab instructions.  The Visual Studio Project name becomes part of the namespace in the code.  The code inside these instructions depends on the namespace matching the Visual Studio Project name specified in these instructions.  If you use a different project name the code will not compile unless you adjust all the namespaces to match the Visual Studio Project name you enter when you create the project.
    
1. In the **New ASP.NET Project** dialog, click **MVC** and then click **Change Authentication**.
1. Select **Work And School Accounts**, check **Read directory data** and click **OK**.

	![Screenshot of the previous step](Images/02.png)

1. Uncheck **Host in the cloud**, once the **New ASP.NET Project** dialog appears like the following screenshot, click **OK**. 

	![Screenshot of the previous step](Images/03.png)
    
1. At this point you can test the authentication flow for your application.
  1. In Visual Studio, press **F5**. The browser will automatically launch taking you to the HTTPS start page for the web application.

   > **Note:** If you receive an error that indicates ASP.NET could not connect to the SQL database, please see the [SQL Server Database Connection Error Resolution document](../../SQL-DB-Connection-Error-Resolution.md) to quickly resolve the issue. 

  1. To sign in, click the **Sign In** link in the upper-right corner.
  1. Login using your **Organizational Account**.
  1. Upon a successful login, since this will be the first time you have logged into this app, Azure AD will present you with the common consent dialog that looks similar to the following image:

    ![Screenshot of the previous step](Images/ConsentDialog.png)
  1. Click **Accept** to approve the app's permission request on your data in Office 365.
  1. You will then be redirected back to your web application. However notice in the upper right corner, it now shows your email address and the **Sign Out** link.
  1. In Visual Studio, press **Shift+F5** to stop debugging.

Congratulations... at this point your app is configured with Azure AD and leverages OpenID Connect and OWIN to facilitate the authentication process!

## Grant App Necessary Permissions
1. Browse to the [Azure Management Portal](https://manage.windowsazure.com) and sign in with your **Organizational Account**.
2. In the left-hand navigation, click **Active Directory**.
3. Select the directory you share with your Office 365 subscription.
4. Search for the app with the **ida:ClientId** value that was created in the web.config file in exercise 1.

    ![Screenshot of the previous step](Images/04.png)
5. Select the application. 
6. Open the **Configure** tab.
7. Scroll down to the **permissions to other applications** section. 
8. Click the **Add Application** button.
9. In the **Permissions to other applications** dialog, click the **PLUS** icon next to the **Microsoft Graph** option.
10. Click the **Check mark** icon in the lower right corner.
11. For the new **Microsoft Graph** application permission entry, select the **Delegated Permissions** dropdown on the same line and then select the following permissions:
    * **Have full access to user files and files shared with**
12. Click the **Save** button at the bottom of the page.

## Exercise 2: Use Microsoft Graph for OneDrive for Business
In this exercise, you will create a repository object for wrapping CRUD operations associated with files in OneDrive for Business.

1. In the **Solution Explorer**, locate the **Models** folder in the **OneDriveWeb** project.
1. First, you will use JSON serialization to simply the processing of the response coming from the Microsoft Graph.
  1. Right-click the **Models** folder and select **Add** -> **New Folder**.
  1. Name the folder **JsonHelpers**.
  1. Locate the [`\O3653\O3653-3 Deep Dive into Office 365 APIs for OneDrive for Business\Lab Files\FolderContents.cs`](/O3653/O3653-3 Deep Dive into Office 365 APIs for OneDrive for Business/Lab Files/FolderContents.cs) file and copy it into the **JsonHelpers** folder in the project.
1. Right-click the **Models** folder and select **Add/Class**.
1. In the **Add New Item** dialog, name the new class **FileRepository.cs**.
1. Click **Add**.

  ![Screenshot of the previous step](Images/07.png)

1. **Add** the following references to the top of the `FileRepository` class.

  ````c#
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using Newtonsoft.Json;
    using System.Configuration;
    using System.Diagnostics;
    using OneDriveWeb.Models.JsonHelpers;
  ````

1. Add the following code to the `FileRepository` class, creating a private field `GraphResourceUrl`
  
  ````c#
    private string GraphResourceUrl = "https://graph.microsoft.com/V1.0/";
  ````
  
1. Add a function named `GetGraphAccessTokenAsync` to the `FileRepository` class to retrieve an Access Token.

  ````c#
    public static async Task<string> GetGraphAccessTokenAsync()
    {
        var AzureAdGraphResourceURL = "https://graph.microsoft.com/";
        var Authority = ConfigurationManager.AppSettings["ida:AADInstance"] + ConfigurationManager.AppSettings["ida:TenantId"];

        var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
        var userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
        var clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ida:ClientId"], ConfigurationManager.AppSettings["ida:ClientSecret"]);
        var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

        // create auth context
        AuthenticationContext authContext = new AuthenticationContext(Authority, new ADALTokenCache(signInUserId));
        var result = await authContext.AcquireTokenSilentAsync(AzureAdGraphResourceURL, clientCredential, userIdentifier);

        return result.AccessToken;
    }  
  ````

1. Add the following methods to get a list of all the items (folders and files) within the root of the user's OneDrive:

  ````c#
    public async Task<IEnumerable<FolderItem>> GetMyFiles(int pageIndex, int pageSize)
    {
        // create the query for all file at the root
        var query = GraphResourceUrl + "me/drive/root/children";
        // issue request & get response
        string responseString = await GetJsonAsync(query);
        // convert them to JSON
        var folderContents = JsonConvert.DeserializeObject<FolderContents>(responseString);

        return folderContents.FolderItems.OrderBy(item => item.Name).Skip(pageIndex * pageSize).Take(pageSize);
    }
    
    public static async Task<string> GetJsonAsync(string url)
    {
        string accessToken = await GetGraphAccessTokenAsync();
        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            using (var response = await client.GetAsync(url))
            {
                if (response.IsSuccessStatusCode)
                    return await response.Content.ReadAsStringAsync();
                return null;
            }
        }
    }  
  ````
  
1. Add the following method to the `FileRepository` class to delete a single file from the user's OneDrive for Business drive:

  ````c#
    public async Task<bool> DeleteFile(string id, string etag)
    {
        // create query request to delete file
        var query = GraphResourceUrl + "/me/drive/items/" + id;
        string accessToken = await GetGraphAccessTokenAsync();

        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            client.DefaultRequestHeaders.IfMatch.Add(new EntityTagHeaderValue(etag));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            using (var response = await client.DeleteAsync(query))
            {
                if (response.IsSuccessStatusCode)
                    return true;
                else
                    Debug.WriteLine("DeleteMessage error: " + response.StatusCode);
            }
        }

        return false;
    }  
  ````

1. Add the following method to the `FileRepository` class to upload a single file to the user's OneDrive for Business:

  ````c#
    public async Task<FolderItem> UploadFile(System.IO.Stream filestream, string filename)
    {
        // create query request to delete file
        var query = GraphResourceUrl + "me/drive/root:/" + filename + ":/content";
        string accessToken = await GetGraphAccessTokenAsync();

        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            using (var content = new StreamContent(filestream))
            {
                content.Headers.Add("Content-Type", "text/plain");
                using (var response = await client.PutAsync(query, content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<FolderItem>(await response.Content.ReadAsStringAsync());
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }
    } 
  ````

### Code the MVC Application
Now you will code the MVC application to allow navigating the OneDrive for Business file collection using the Microsoft Graph.

1. Locate the **Views/Shared** folder in the project.
1. Open the **_Layout.cshtml** file found in the **Views/Shared** folder.
    1. Locate the part of the file that includes a few links at the top of the page... it should look similar to the following code:
    
    ````asp
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
            <li>@Html.ActionLink("Home", "Index", "Home")</li>
            <li>@Html.ActionLink("About", "About", "Home")</li>
            <li>@Html.ActionLink("Contact", "Contact", "Home")</li>
        </ul>
        @Html.Partial("_LoginPartial")
    </div>
    ````

    1. Update that navigation to have a new link (the **Files (Graph)** link added below) as well as a reference to the login control you just created:

    ````asp
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
            <li>@Html.ActionLink("Home", "Index", "Home")</li>
            <li>@Html.ActionLink("About", "About", "Home")</li>
            <li>@Html.ActionLink("Contact", "Contact", "Home")</li>
            <li>@Html.ActionLink("Files (Graph)", "Index", "Files")</li>
        </ul>
        @Html.Partial("_LoginPartial")
    </div>
    ````

1. Right-click the **Controllers** folder and select **Add/Controller**.
  1. In the **Add Scaffold** dialog, select **MVC 5 Controller - Empty** and click **Add**.
  1. In the **Add Controller** dialog, give the controller the name **FilesController** and click **Add**.
1. **Add** the following references to the top of the file.

  ````c#
    using OneDriveWeb.Models;
    using System.Threading.Tasks;
    using OneDriveWeb.Models.JsonHelpers;
  ````

1. **Replace** the **Index** method with the following code to read files.

  ````c#
    [Authorize]
    public async Task<ActionResult> Index(int? pageIndex, int? pageSize)
    {

        FileRepository repository = new FileRepository();

        // setup paging defaults if not provided
        pageIndex = pageIndex ?? 0;
        pageSize = pageSize ?? 10;

        // setup paging for the IU
        ViewBag.PageIndex = (int)pageIndex;
        ViewBag.PageSize = (int)pageSize;

        var results = await repository.GetMyFiles((int)pageIndex, (int)pageSize);

        return View(results);
    }
  ````

1. Within the `FilesController` class, right click the `View()` at the end of the `Index()` method and select **Add View**.
1. Within the **Add View** dialog, set the following values:
  1. View Name: **Index**.
  1. Template: **Empty (without model)**.
    
    > Leave all other fields blank & unchecked.
  
  1. Click **Add**.
1. **Replace** all of the code in the file with the following:

  ````asp
    @model IEnumerable<OneDriveWeb.Models.JsonHelpers.FolderItem>

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
                                    @file.CreatedDateTime
                                </td>
                                <td>
                                    @file.LastModifiedDateTime
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

1. In **Visual Studio**, hit **F5** to begin debugging.

 > **Note:** If you receive an error that indicates ASP.NET could not connect to the SQL database, please see the [SQL Server Database Connection Error Resolution document](../../SQL-DB-Connection-Error-Resolution.md) to quickly resolve the issue. 

1. When prompted, log in with your **Organizational Account**.
1. Click the link **Files (Graph)** on the top of the home page.
1. Verify that your application displays files from the OneDrive for Business library.

  ![Screenshot of the previous step](Images/08.png)

1. Stop debugging.
1. In the **FilesController.cs** file, **add** the following code to upload and delete files.

  ````c#
    [Authorize]
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

        return Redirect("/Files");
    }

    [Authorize]
    public async Task<ActionResult> Delete(string name, string etag)
    {
        FileRepository repository = new FileRepository();

        if (name != null)
        {
            await repository.DeleteFile(name, etag);
        }

        return Redirect("/Files");

    }
  ````

1. In the **Index.cshtml** file under **Views/Files** folder, **add** the following code under the comment `Place delete control here`.

  ````c#
    Dictionary<string, object> attributes1 = new Dictionary<string, object>();
    attributes1.Add("class", "btn btn-warning");

    RouteValueDictionary routeValues1 = new RouteValueDictionary();
    routeValues1.Add("name", file.Id);
    routeValues1.Add("etag", file.eTag);
    @Html.ActionLink("X", "Delete", "Files", routeValues1, attributes1);
  ````

1. **Add** the following code under the comment `Place Paging controls here`:

  ````c#
    Dictionary<string, object> attributes2 = new Dictionary<string, object>();
    attributes2.Add("class", "btn btn-default");

    RouteValueDictionary routeValues2 = new RouteValueDictionary();
    routeValues2.Add("pageIndex", (ViewBag.PageIndex == 0 ? 0 : ViewBag.PageIndex - 1).ToString());
    routeValues2.Add("pageSize", ViewBag.PageSize.ToString());
    @Html.ActionLink("Prev", "Index", "Files", routeValues2, attributes2);

    RouteValueDictionary routeValues3 = new RouteValueDictionary();
    routeValues3.Add("pageIndex", (ViewBag.PageIndex + 1).ToString());
    routeValues3.Add("pageSize", ViewBag.PageSize.ToString());
    @Html.ActionLink("Next", "Index", "Files", routeValues3, attributes2);
  ````

1. **Add** the following code to the bottom of the **Index.cshtml** file to create an upload control.

  ````asp
    <div class="row" style="margin-top:50px;">
        <div class="col-sm-12">
            @using (Html.BeginForm("Upload", "Files", FormMethod.Post, new { enctype = "multipart/form-data" }))
            {
                <input type="file" id="file" name="file" class="btn btn-default" />
                <input type="submit" id="submit" name="submit" value="Upload" class="btn btn-default" />
            }
        </div>
    </div>
  ````

1. Press **F5** to begin debugging.

 > **Note:** If you receive an error that indicates ASP.NET could not connect to the SQL database, please see the [SQL Server Database Connection Error Resolution document](../../SQL-DB-Connection-Error-Resolution.md) to quickly resolve the issue. 

1. Test the paging, upload, and delete functionality in the application.

Congratulations! In this exercise you have created an MVC application that uses Microsoft Graph to to return and manage files in a OneDrive for Business file collection.
