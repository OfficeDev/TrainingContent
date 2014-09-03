# Office 365 APIs for OneDrive for Business
In this lab, you will use the Office 365 APIs for OneDrive for Business as part of an ASP.NET MVC5 application.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have the Office 365 API Tools version 1.1.728 installed in Visual Studio 2013.

## Exercise 1: Create an ASP.NET MVC5 Application
In this exercise, you will create the ASP.NET MVC5 application and register it with Azure active Directory.

1. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  2. In Visual Studio select **File/New/Project**.
  3. In the **New Project** dialog:
    1. Select **Templates/Visual C#/Web**.
    2. Click **ASP.NET Web Application**.
    3. Name the new project **OneDriveWeb**.
    4. Click **OK**.<br/>
       ![](Images/01.png?raw=true "Figure 1")
  4. In the **New ASP.NET Project** dialog:
    1. Click **MVC**.
    2. Click **Change Authentication**.
    3. Select **No Authentication**.
    4. Click **OK**.<br/>
       ![](Images/02.png?raw=true "Figure 2")
    5. Click **OK**.<br/>
       ![](Images/03.png?raw=true "Figure 3")
2. Connect the OneDrive for Business service:
  1. In the **Solution Explorer**, right click the **OneDriveWeb** project and select **Add/Connected Service**.
  2. In the **Services Manager** dialog:
    1. Click **Register Your App**.
    2. When prompted, login with your **Organizational Account**.
    3. Click **My Files**.
    4. Click **Permissions**.
    5. Check **Edit or Delete User's Files**.
    6. Check **Read User's Files**.
    7. Click **Apply**.<br/>
       ![](Images/04.png?raw=true "Figure 4")
    8. Click **Sites**.
    9. Click **Permissions**.
    10. Check **Create or Delete items and lists in all site collections**.
    11. Check **Edit or Delete items in all site collections**.
    12. Check **Read items in all site collections**.
    13. Click **Apply**.<br/>
       ![](Images/05.png?raw=true "Figure 5")
    14. Click **OK**.<br/>
       ![](Images/06.png?raw=true "Figure 6")

## Exercise 2: Code the Files API
In this exercise, you will create a respository object for wrapping CRUD operations associated with the Files API.

1. In the **Solution Explorer**, right click the **OneDriveWeb** project and select **Add/Class**.
2. In the **Add New Item** dialog, name the new class **FileRepository.cs**.
3. Click **Add**.<br/>
       ![](Images/07.png?raw=true "Figure 7")
4. **Add** the following references to the top of the **FileRepository** class.
  ```

  using Microsoft.Office365.OAuth;
  using Microsoft.Office365.SharePoint;
  using System.IO;
  using System.Threading.Tasks;

  ```
5. **Add** the following helper functions to manage session state variables.
  ```

  private void SaveInCache(string name, object value)
  {
      System.Web.HttpContext.Current.Session[name] = value;
  }

  private object GetFromCache(string name)
  {
      return System.Web.HttpContext.Current.Session[name];
  }

  private void RemoveFromCache(string name)
  {
      System.Web.HttpContext.Current.Session.Remove(name);
  }

  ```
6. **Add** the following code to discover the "MyFiles" capability and return a SharePointClient.
  ```

        private async Task<SharePointClient> EnsureClientCreated()
        {
            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null)
            {
                disco = await DiscoveryContext.CreateAsync();
                SaveInCache("DiscoveryContext", disco);
            }

            var dcr = await disco.DiscoverCapabilityAsync("MyFiles");

            var ServiceResourceId = dcr.ServiceResourceId;
            var ServiceEndpointUri = dcr.ServiceEndpointUri;
            SaveInCache("LastLoggedInUser", dcr.UserId);

            return new SharePointClient(ServiceEndpointUri, async () =>
            {
                return (await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                    new SessionCache().Read("RefreshToken"),
                    new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(
                        disco.AppIdentity.ClientId,
                        disco.AppIdentity.ClientSecret),
                        ServiceResourceId)).AccessToken;
            });
        }

  ```
7. **Add** the following code to read a page of files.
  ```

        public async Task<IEnumerable<IFileSystemItem>> GetMyFiles(int pageIndex, int pageSize)
        {
            var client = await EnsureClientCreated();

            var filesResults = await client.Files.ExecuteAsync();
            return filesResults.CurrentPage.OrderBy(e => e.Name).Skip(pageIndex * pageSize).Take(pageSize);

        }

  ```
8. **Add** the following code to upload a file.
  ```

        public async Task<IFile> UploadFile(Stream filestream, string filename)
        {
            var client = await EnsureClientCreated();
            return await client.Files.AddAsync(filename, true, filestream);
           
        }

  ```
9. **Add** the following code to delete a file.
  ```

        public async Task DeleteFile(string id)
        {
            var client = await EnsureClientCreated();
            IFileSystemItem fileSystemItem = await client.Files.GetByIdAsync(id);
            await fileSystemItem.DeleteAsync();
        }

  ```

## Exercise 3: Code the MVC Application
In this exercise, you will code the MVC application to allow navigating the OneDrive for Business file collection.

1. In the **Solution Explorer**, expand the **Controllers** folder and open the **HomeController.cs** file.
2. **Add** the following refernces to the top of the file.
  ```

  using Microsoft.Office365.OAuth;
  using System.Threading.Tasks;

  ```
3. **Replace** the **Index** method with the following code to read files.
  ```

        public async Task<ActionResult> Index(int? pageIndex, int? pageSize)
        {

            FileRepository repository = new FileRepository();

            if (pageIndex == null)
            {
                pageIndex = 0;
            }

            if (pageSize == null)
            {
                pageSize = 10;
            }

            try
            {
                ViewBag.PageIndex = (int)pageIndex;
                ViewBag.PageSize = (int)pageSize;
                ViewBag.Files = await repository.GetMyFiles((int)pageIndex, (int)pageSize);
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }

            return View();
        }

  ```
4. In the **Solution Explorer**, expand the **Views/Home** folder and open the **Index.cshtml** file.
5. **Replace** all of the code in the file with the following:
  ```

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
                    @foreach (var file in ViewBag.Files)
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
                                <a href="@file.Url">@file.Name</a>
                            </td>
                            <td>
                                @file.TimeCreated
                            </td>
                            <td>
                                @file.TimeLastModified
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


  ```
6. Open a browser and navigate to https://[tenant].onedrive.com.
7. Make sure that you have some test files available in the library.
8. In **Visual Studio**, hit **F5** to begin debugging.
9. When prompted, log in with your **Organizational Account**.
10. Verify that your application displays files from the OneDrive for Business library.<br/>
       ![](Images/08.png?raw=true "Figure 8")
11. Stop debugging.
12. In the **HomeController.cs** file, **add** the following code to upload and delete files.
  ```

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

  ```
13. In the **Index.cshtml** file, **add** the following code under the comment **Place delete control here**.
  ```

    Dictionary<string, object> attributes1 = new Dictionary<string, object>();
    attributes1.Add("class", "btn btn-warning");

    RouteValueDictionary routeValues1 = new RouteValueDictionary();
    routeValues1.Add("name", file.Id);
    @Html.ActionLink("X", "Delete", "Home", routeValues1, attributes1);

  ```
14. **Add** the following code under the comment **Place Paging controls here**
  ```

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

  ```
15. **Add** the following code to the bottom of the file to create an upload control.
  ```

  <div class="row" style="margin-top:50px;">
    <div class="col-sm-12">
        @using (Html.BeginForm("Upload", "Home", FormMethod.Post, new { enctype = "multipart/form-data" }))
        {
            <input type="file" id="file" name="file" class="btn btn-default" />
            <input type="submit" id="submit" name="submit" value="Upload" class="btn btn-default" />
        }
    </div>
  </div>

  ```
16. Press **F5** to begin debugging.
17. Test the paging, upload, and delete functionality of the application.


Congratulations! You have completed working with the OneDrive for Business APIs.



