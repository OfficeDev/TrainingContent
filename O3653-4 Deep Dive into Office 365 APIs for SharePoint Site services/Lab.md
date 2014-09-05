# Office 365 APIs for SharePoint Sites
In this lab, you will use the Office 365 APIs for SharePoint Sites as part of an ASP.NET MVC5 application to manage a Tasks list.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have the Office 365 API Tools version 1.1.728 installed in Visual Studio 2013.
3. You must have a task list named "Tasks" in the root site of SharePoint online.

## Exercise 1: Create an ASP.NET MVC5 Application
In this exercise, you will create the ASP.NET MVC5 application and register it with Azure active Directory.

1. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  2. In Visual Studio select **File/New/Project**.
  3. In the **New Project** dialog:
    1. Select **Templates/Visual C#/Web**.
    2. Click **ASP.NET Web Application**.
    3. Name the new project **TasksWeb**.
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
2. Connect the SharePoint Sites service:
  1. In the **Solution Explorer**, right click the **TasksWeb** project and select **Add/Connected Service**.
  2. In the **Services Manager** dialog:
    1. Click **Register Your App**.
    2. When prompted, login with your **Organizational Account**.
    3. Click **Sites**.
    4. Click **Permissions**.
    5. Check **Create or Delete Items and Lists in All Site Collections**.
    6. Check **Edit or Delete Items in All Site Collections**.
    7. Check **Read Items in All Site Collections**.
    8. Click **Apply**.<br/>
       ![](Images/04.png?raw=true "Figure 4")
    9. Click **OK**.<br/>
       ![](Images/05.png?raw=true "Figure 5")

## Exercise 2: Use Azure AD Access Token to call SharePoint REST API
In this exercise, you will create a respository object for wrapping CRUD operations associated with the Tasks list and use the repository to read the list.

1. In the **Solution Explorer**, right click the **Models** folder and select **Add/Class**.
2. In the **Add New Item** dialog, name the new class **Task.cs**.
3. Click **Add**.
4. **Add** the following properties to hold data for an individual task.
  ```
        public string Id { get; set; }
        public string Title { get; set; }

        public string Priority { get; set; }
        public string Status { get; set; }

        public string AssignedTo { get; set; }

  ```

5. In the **Solution Explorer**, right click the **Models** folder and select **Add/Class**.
6. In the **Add New Item** dialog, name the new class **TaskRepository.cs**.
7. Click **Add**.
8. **Add** the following references to the top of the **TaskRepository** class.
  ```

  using Microsoft.Office365.OAuth;
  using Microsoft.Office365.SharePoint;
  using System.Xml.Linq;
  using System.Threading.Tasks;
  using System.Text;
  using System.Net.Http;
  using System.Net.Http.Headers;

  ```
9. **Add** the following constants to the class being sure to modify them for your tenant.
  ```

  const string ServiceResourceId = "https://[tenant].sharepoint.com";
  static readonly Uri ServiceEndpointUri = new Uri("https://[tenant].sharepoint.com/_api/");
  XNamespace a = "http://www.w3.org/2005/Atom";
  XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
  XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

  ```
10. **Add** the following helper functions to manage session state variables.
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
11. **Add** the following code to return an access token you can use with the REST API.
  ```

        private async Task<string> GetAccessToken()
        {
            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null)
            {
                disco = await DiscoveryContext.CreateAsync();
                SaveInCache("DiscoveryContext", disco);
            }

            var dcr = await disco.DiscoverResourceAsync(ServiceResourceId);

            SaveInCache("LastLoggedInUser", dcr.UserId);

            return (await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                new SessionCache().Read("RefreshToken"),
                new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(
                    disco.AppIdentity.ClientId,
                    disco.AppIdentity.ClientSecret),
                    ServiceResourceId)).AccessToken;
        }

  ```
12. **Add** the following code to read a page of Tasks.
  ```

        public async Task<List<Task>> GetTasks(int pageIndex, int pageSize)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getbytitle('Tasks')/items")
                .Append("?$select=Id,Title,Status,Priority,AssignedTo/Name&$expand=AssignedTo");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();
            XElement root = XElement.Parse(responseString);

            List<Task> tasks = new List<Task>();

            foreach (XElement entryElement in root.Elements(a + "entry"))
            {

                Task task = new Task();
                task.Id = entryElement.Descendants(m + "properties").Descendants(d + "Id").First().Value;
                task.Title = entryElement.Descendants(m + "properties").Descendants(d + "Title").First().Value;
                task.Status = entryElement.Descendants(m + "properties").Descendants(d + "Status").First().Value;
                task.Priority = entryElement.Descendants(m + "properties").Descendants(d + "Priority").First().Value;
                try { task.AssignedTo = entryElement.Descendants(a + "entry").Descendants(d + "Name").First().Value; }
                catch {}
                tasks.Add(task);
            }

            return tasks.OrderBy(e => e.Title).Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }


  ```
13. In the **Solution Explorer**, right click the **Models** folder and select **Add/Class**.
14. In the **Add New Item** dialog, name the new class **TaskViewModel.cs**.
15. Click **Add**.
16. **Add** the following code to hold data for the view.
  ```
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public List<Task> Tasks { get; set; }

  ```
17. In the **Solution Explorer**, expand the **Controllers** folder and open the **HomeController.cs** file.
18. **Add** the following refernces to the top of the file.
  ```

  using Microsoft.Office365.OAuth;
  using System.Threading.Tasks;
  using TasksWeb.Models;

  ```
19. **Replace** the **Index** method with the following code to read files.
  ```

        public async Task<ActionResult> Index(int? pageIndex, int? pageSize, string taskId)
        {
            TaskRepository repository = new TaskRepository();

            //Uncomment later for DELETE support
            //if (Request.HttpMethod == "POST" && taskId != null)
            //{
            //    await repository.DeleteTask(taskId);
            //    return Redirect("/");
            //}

            TaskViewModel model = new TaskViewModel();

            if (pageIndex == null)
            {
                model.PageIndex = 0;
            }
            else
            {
                model.PageIndex = (int)pageIndex;
            }

            if (pageSize == null)
            {
                model.PageSize = 10;
            }
            else
            {
                model.PageSize = (int)pageSize;
            }

            try
            {
                model.Tasks = await repository.GetTasks(model.PageIndex, model.PageSize);
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }

            return View(model);
        }

  ```
20. In the **Solution Explorer**, expand the **Views/Home** folder and open **Index.cshtml**.
21. **Replace** the entire file with the following code.
  ```
  @model TasksWeb.Models.TaskViewModel
  
  @{
      ViewBag.Title = "Home Page";
  }
  <h2>Tasks</h2>
  
  <div class="row" style="margin-top:50px;">
    <div class="col-sm-12">
        @{
            Dictionary<string, object> attributes4 = new Dictionary<string, object>();
            attributes4.Add("class", "btn btn-default");
            @Html.ActionLink("New Task", "Create", "Home", null, attributes4);
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
                        <th>Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach (var task in @Model.Tasks)
                    {
                        <tr>
                            <td>
                                @using (Html.BeginForm())
                                {
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
                                @Html.ActionLink("Details", "View", "Home", routeValues2, attributes2);
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
                            <td>
                                @task.AssignedTo
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
                @Html.ActionLink("Prev", "Index", "Home", routeValues3, attributes3);
            }
            @{
                RouteValueDictionary routeValues4 = new RouteValueDictionary();
                routeValues4.Add("pageIndex", (Model.PageIndex + 1).ToString());
                routeValues4.Add("pageSize", Model.PageSize.ToString());
                @Html.ActionLink("Next", "Index", "Home", routeValues4, attributes3);
            }
        </div>
    </div>
  </div>


  ```
22. Press **F5** to begin debugging and ensure items from the task list appear.<br/>
       ![](Images/06.png?raw=true "Figure 6")

## Exercise 3: Complete the CRUD Operations
In this exercise, you will finish developing the CRUD operations for the task list.

1. **Add** the following code to the **TaskRepository** class to view individual task items.
  ```
        public async Task<Task> GetTask(string Id)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getbytitle('Tasks')/items?$filter=Id%20eq%20")
                .Append(Id)
                .Append("&$select=Id,Title,Status,Priority,AssignedTo/Name&$expand=AssignedTo");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();


            XElement root = XElement.Parse(responseString);
            XElement entryElement = root.Elements(a + "entry").First();

            Task task = new Task();
            task.Id = entryElement.Descendants(m + "properties").Descendants(d + "Id").First().Value;
            task.Title = entryElement.Descendants(m + "properties").Descendants(d + "Title").First().Value;
            task.Status = entryElement.Descendants(m + "properties").Descendants(d + "Status").First().Value;
            task.Priority = entryElement.Descendants(m + "properties").Descendants(d + "Priority").First().Value;
            try { task.AssignedTo = entryElement.Descendants(a + "entry").Descendants(d + "Name").First().Value; }
            catch {}

            return task;
        }

  ```
2. Add the following code to the **HomeController.cs** file to handle viewing an item.
  ```
        public async Task<ActionResult> View(string taskId)
        {
            TaskRepository repository = new TaskRepository();

            TasksWeb.Models.Task task = null;
            try
            {
                task = await repository.GetTask(taskId);
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }

            return View(task);
        }

  ```
3. Right click inside the **View** method you just created and select **Add View**.
  1. In the **Template** drop-down list, select **Details**.
  2. In the **Model Class** drop-down list, select **Task**.
  3. Click **OK**.<br/>
       ![](Images/07.png?raw=true "Figure 7")
4. Press **F5** to debug and verify that you can see the task details for an individual item.<br/>
       ![](Images/08.png?raw=true "Figure 8")
5. **Add** the following code to the **TaskRepository.cs** file to create new tasks.
  ```

       public async Task<Task> CreateTask(Task task)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
            .Append("/_api/web/lists/getByTitle('Tasks')/items");

            XElement entry = new XElement(a + "entry",
                    new XAttribute(XNamespace.Xmlns + "d", d),
                    new XAttribute(XNamespace.Xmlns + "m", m),
                    new XElement(a + "category", new XAttribute("term", "SP.Data.TasksListItem"), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
                    new XElement(a + "content", new XAttribute("type", "application/xml"),
                        new XElement(m + "properties",
                            new XElement(d + "Title", task.Title),
                            new XElement(d + "Status", task.Status),
                            new XElement(d + "Priority", task.Priority))));

            StringContent requestContent = new StringContent(entry.ToString());
            requestContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/atom+xml");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            request.Content = requestContent;
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();

            XElement root = XElement.Parse(responseString); 
            XElement entryElement = root.Elements(a + "entry").First();

            Task newTask = new Task();
            newTask.Id = entryElement.Descendants(m + "properties").Descendants(d + "Id").First().Value;
            newTask.Title = entryElement.Descendants(m + "properties").Descendants(d + "Title").First().Value;
            newTask.Status = entryElement.Descendants(m + "properties").Descendants(d + "Status").First().Value;
            newTask.Priority = entryElement.Descendants(m + "properties").Descendants(d + "Priority").First().Value;
            newTask.AssignedTo = "Not created in this exercise for simplicity";

            return newTask;
        }

  ```
6. Add the following code to the **HomeController.cs** file to handle creating an item.
  ```
        public async Task<ActionResult> Create(TasksWeb.Models.Task task)
        {
            TaskRepository repository = new TaskRepository();

            if (Request.HttpMethod == "POST")
            {
                TasksWeb.Models.Task newTask = await repository.CreateTask(task);
                return Redirect("/");
            }
            else
            {
                return View(task);
            }
        }

  ```
7. Right click inside the **Create** method you just created and select **Add View**.
  1. In the **Template** drop-down list, select **Details**.
  2. In the **Model Class** drop-down list, select **Task**.
  3. Click **OK**.<br/>
       ![](Images/09.png?raw=true "Figure 9")
8. Press **F5** to debug and verify that you can add new task items.<br/>
       ![](Images/10.png?raw=true "Figure 10")
9. **Add** the following code to the **TaskRepository.cs** file to edit a task.
  ```
        public async System.Threading.Tasks.Task UpdateTask(Task task)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getByTitle('Tasks')/getItemByStringId('")
                .Append(task.Id)
                .Append("')");

            XElement entry = new XElement(a + "entry",
                    new XAttribute(XNamespace.Xmlns + "d", d),
                    new XAttribute(XNamespace.Xmlns + "m", m),
                    new XElement(a + "category", new XAttribute("term", "SP.Data.TasksListItem"), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
                    new XElement(a + "content", new XAttribute("type", "application/xml"),
                        new XElement(m + "properties",
                            new XElement(d + "Title", task.Title),
                            new XElement(d + "Status", task.Status),
                            new XElement(d + "Priority", task.Priority))));

            StringContent requestContent = new StringContent(entry.ToString());
            requestContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/atom+xml");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            request.Content = requestContent;
            request.Headers.Add("IF-MATCH", "*");
            request.Headers.Add("X-Http-Method", "PATCH");
            HttpResponseMessage response = await client.SendAsync(request);

        }

  ```
10. **Add** the following code to the **HomeController.cs** file to handle editing an updating task items.
  ```
        public async Task<ActionResult> Edit(string Id, TasksWeb.Models.Task task)
        {
            TaskRepository repository = new TaskRepository();

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

  ```
11. Right click inside the **Edit** method you just created and select **Add View**.
  1. In the **Template** drop-down list, select **Edit**.
  2. In the **Model Class** drop-down list, select **Task**.
  3. Click **OK**.<br/>
       ![](Images/11.png?raw=true "Figure 11")
12. Press **F5** to debug and verify that you can add edit task items from the **Details** page.<br/>
       ![](Images/12.png?raw=true "Figure 12")
13. **Add** the following code to the **TaskRepository.cs** file to delete a task.
  ```
        public async System.Threading.Tasks.Task DeleteTask(string Id)
        {
            StringBuilder requestUri = new StringBuilder(ServiceResourceId)
                .Append("/_api/web/lists/getByTitle('Tasks')/getItemByStringId('")
                .Append(Id)
                .Append("')");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetAccessToken());
            request.Headers.Add("IF-MATCH", "*");
            HttpResponseMessage response = await client.SendAsync(request);
        }

  ```
14. In the **HomeController.cs** file, uncomment the code in the **Index** method to support deleting a task item.
15. Press **F5** and try out the complete application.


Congratulations! You have completed working with the SharePoint Site APIs.



