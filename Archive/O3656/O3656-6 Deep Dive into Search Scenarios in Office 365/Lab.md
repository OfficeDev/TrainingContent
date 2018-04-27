# O3656-6 Deep Dive into Search Scenarios in Office 365
In this lab, you will create solutions to extend the Search Center and build a search-based app.

## Prerequisites
1. You must have an Office 365 tenant to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You will need some task lists defined in your tenancy. If you do not have one created, then define at least one and add some tasks.

## Exercise 1: Extend the Search Center 
In this exercise you will create a custom solution that extends the Search Center.

1. Create a new Search Center in your tenant.
  1. Log into your SharePoint online tenancy using your **Organizational Account**.
  2. Select **Site Settings**.<br/>
     ![Screenshot of the previous step](Images/01.png?raw=true "Figure 1")
  3. Click **Site Collection Features**.<br/>
     ![Screenshot of the previous step](Images/02.png?raw=true "Figure 2")
  4. Activate **SharePoint Server Publishing Infrastructure**.<br/>
     ![Screenshot of the previous step](Images/03.png?raw=true "Figure 3")
  5. Select **Site Settings**.
  6. Click **Manage Site Features**.<br/>
     ![Screenshot of the previous step](Images/04.png?raw=true "Figure 4")
  7. Activate **SharePoint Server Publishing**.<br/>
     ![Screenshot of the previous step](Images/05.png?raw=true "Figure 5")
  8. Click **Site Contents**.
  9. Click **New Subsite**.
  10. On the **New SharePoint Site** page:
    1. Enter **My Search Center** for the **Title**..
    2. Enter **mysearch** for the **Url**.
    3. Select **Enterprise Search Center** as the template.
    4. Click **Create**.<br/>
       ![Screenshot of the previous step](Images/06.png?raw=true "Figure 6")
  11. Test the Search Center by entering the following query to return your current tasks:

  ```
  ContentClass:STS_ListItem_Tasks AssignedToOWSUSER:'[YOUR DISPLAY NAME]' PercentCompleteOWSNMBR<>'100'
  ```
  ![Screenshot of the previous step](Images/07.png?raw=true "Figure 7")

2. Create a Result Source.
  1. Select **Site Settings**.
  2. Click **Result Sources**.<br/>
      ![Screenshot of the previous step](Images/08.png?raw=true "Figure 8")
  3. Click **New Result Source**.<br/>
      ![Screenshot of the previous step](Images/09.png?raw=true "Figure 9")
    1. Enter **Tasks** for the **Name**.
    2. Click **Launch Query Builder**.
    3. On the **Basics** tab, enter the following query in the **Query Text** field.

    ```
    ContentClass:STS_ListItem_Tasks AssignedToOWSUSER:{User.Name} PercentCompleteOWSNMBR<>'100'
    ```
    4. Click **Test Query** and verify you see results.<br/>
      ![Screenshot of the previous step](Images/10.png?raw=true "Figure 10")
    5. Click **OK**
  4. Click **Save**.

3. Create a Result Type.
  1. Click **Master Pages and Page Layouts**.<br/>
    ![Screenshot of the previous step](Images/11.png?raw=true "Figure 11")
  2. Click the **Display Templates** folder.
  3. Click the **Search** folder.
  4. Click the **Files** tab and then **Upload Document**.
  5. **Browse** to the **LabFiles** folder and upload **Task_Default.html**.
  6. Click **OK**.<br/>
    ![Screenshot of the previous step](Images/12.png?raw=true "Figure 12")
  7. When the Properties form appears, simply click **Save**.
  8. Return to the **My Search Center** site.
  9. Click **Site Settings**.
  10. Click **Result Types**.<br/>
    ![Screenshot of the previous step](Images/13.png?raw=true "Figure 13")
  11. Click **New Result Type**.<br/>
      ![Screenshot of the previous step](Images/14.png?raw=true "Figure 14")
    1. Enter **Task** for the **Name**.
    2. Select **Tasks** for the **Which source should results match?** drop-down list.
    3. Select **Task Template** for the **What should these results look like?** drop-down list.
    4. Click **Save**.<br/>
      ![Screenshot of the previous step](Images/15.png?raw=true "Figure 15")

4. Create a Search Results Page
  1. Return to the **My Search Center** site.
  2. Click **Site Contents**.
  3. Click the **Pages** library.
  4. Click the **Flies** tab and then select **New Document/Page**.<br/>
      ![Screenshot of the previous step](Images/16.png?raw=true "Figure 16")
    1. Enter **Tasks** in the **Title** field.
    2. Click **Create**.<br/>
      ![Screenshot of the previous step](Images/17.png?raw=true "Figure 17")
  5. Click on the newly-created **Tasks** page.
  6. Select **Edit Page**.
  7. Select **Edit Web Part** from the **Search Results** web part.
      ![Screenshot of the previous step](Images/18.png?raw=true "Figure 18")
  8. Click **Change Query**.
  9. In the **Build Your Query** dialog:
    1. Select **Tasks** from the **Select a Query** drop-down list.
    2. Click **Test Query** and verify you get results.
    3. Click **OK**.<br/>
      ![Screenshot of the previous step](Images/19.png?raw=true "Figure 19")
  10. Click **OK**.
  11. Click **Publish**. You should now see a properly-formatted task list.
      ![Screenshot of the previous step](Images/20.png?raw=true "Figure 20")

5. Add Search Navigation
  1. Click **Site Settings**.
  2. Click **Search Settings**.<br/>
      ![Screenshot of the previous step](Images/21.png?raw=true "Figure 21")
  3. In the **Configure Search Navigation** section:
    1. Click **Add Link**.
    2. Enter **Tasks** in the **Title**.
    3. Enter **/mysearch/Pages/Tasks.aspx** in the **URL**.
    4. Click **OK*.<br/>
      ![Screenshot of the previous step](Images/22.png?raw=true "Figure 22")
  4. Click **OK**.

6. Test the Solution
  1. Return to the **My Search Center** site.
  2. Enter a keyword and click the **Tasks** scope.
  3. Verify that you see appropriate results for the query.
      ![Screenshot of the previous step](Images/23.png?raw=true "Figure 23")

## Exercise 2: Build an Employee Directory app 
In this exercise you will create a SharePoint app that uses the Search service.

1. Create the App Project
  1. Start **Visual Studio 2013**.
  2. Select **File/New/Project** from the main menu.
  3. In the **New Project** dialog:
    1. Select **Templates/Visual C#/Office/SharePoint/Apps**.
    2. Select **App for SharePoint**.
    3. Name the new project **Employee Directory**.
    4. Click **OK**.<br/>
      ![Screenshot of the previous step](Images/24.png?raw=true "Figure 24")
  4. In the **New App for SharePoint** wizard:
    1. Enter the URL of your tenancy.
    2. Select **Provider-Hosted**.
    3. Click **Next**.
      ![Screenshot of the previous step](Images/25.png?raw=true "Figure 25")  
    4. Select **ASP.NET MVC Web Application**.
    5. Click **Finish**.
  5. When prompted, enter your **Organizational Account** credentials.

2. Code the App Project
  1. In the **Solution Explorer**, double-click **AppManifest.xml**.
  2. Click the **Permissions** tab.
  3. Select **Search** in the **Scope** drop-down list.
  4. Select **QueryAsUserIgnoreAppPrincipal** in the **Permission** drop-down list.
      ![Screenshot of the previous step](Images/26.png?raw=true "Figure 26") 

3. Code the Web Project
  1. In the **Solution Explorer**, right click the **Models** folder and select **Add/Existing Content**.
  2. Navigate to the **Lab Files** folder and add the **Person.cs** file to the project.
  3. In the **Solution Explorer**, expand the **Controllers** folder and open **HomeController.cs** for editing.
  4. **Add** the following statements to the top of the code file:

  ```C#
  using System.Text;
  using System.Net.Http;
  using System.Net.Http.Headers;
  using System.Xml.Linq;
  using System.Threading.Tasks;
  using EmployeeDirectoryWeb.Models;

  ```

  5. **Replace** the entire **Index** method with the following code:

  ```C#

        public async Task<ActionResult> Index(string startLetter)
        {
            List<Person> people = new List<Person>();

            if (startLetter != null)
            {
                var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

                string accessToken = spContext.UserAccessTokenForSPHost;

                StringBuilder requestUri = new StringBuilder()
                .Append(spContext.SPHostUrl)
                .Append("/_api/search/query?querytext='LastName:")
                .Append(startLetter)
                .Append("*'&selectproperties='LastName,FirstName,WorkEmail,WorkPhone'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'&sortlist='FirstName:ascending'");

                HttpClient client = new HttpClient();
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                HttpResponseMessage response = await client.SendAsync(request);
                string responseString = await response.Content.ReadAsStringAsync();

                XElement root = XElement.Parse(responseString);

                XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";

                foreach (XElement row in root.Descendants(d + "Rows").First().Elements(d + "element"))
                {
                    Person person = new Person();

                    foreach (XElement cell in row.Descendants(d + "Cells").First().Elements(d + "element"))
                    {
                        if (cell.Elements(d + "Key").First().Value == "FirstName")
                        {
                            person.FirstName = cell.Elements(d + "Value").First().Value;
                        }
                        if (cell.Elements(d + "Key").First().Value == "LastName")
                        {
                            person.LastName = cell.Elements(d + "Value").First().Value;
                        }
                        if (cell.Elements(d + "Key").First().Value == "WorkPhone")
                        {
                            person.WorkPhone = cell.Elements(d + "Value").First().Value;
                        }
                        if (cell.Elements(d + "Key").First().Value == "WorkEmail")
                        {
                            person.WorkEmail = cell.Elements(d + "Value").First().Value;
                        }
                    }

                    people.Add(person);
                }

            }

            return View(people);

        }

  ```
6. In the **Solution Explorer**, expand the **Views** folder and then the **Home** folder.
7. Open **Index.cshtml** for editing.
8. **Replace** the entire contents of the file with the following view definition:

  ```C#

  @model IEnumerable<EmployeeDirectoryWeb.Models.Person>

  @{
      ViewBag.Title = "Employees";
  }

  <h2>Employees</h2>

  <p>
    @Html.ActionLink("A", "Index", new { startLetter = "A"})
    @Html.ActionLink("B", "Index", new { startLetter = "B" })
    @Html.ActionLink("C", "Index", new { startLetter = "C" })
    @Html.ActionLink("D", "Index", new { startLetter = "D" })
    @Html.ActionLink("E", "Index", new { startLetter = "E" })
    @Html.ActionLink("F", "Index", new { startLetter = "F" })
    @Html.ActionLink("G", "Index", new { startLetter = "G" })
    @Html.ActionLink("H", "Index", new { startLetter = "H" })
    @Html.ActionLink("I", "Index", new { startLetter = "I" })
    @Html.ActionLink("J", "Index", new { startLetter = "J" })
    @Html.ActionLink("K", "Index", new { startLetter = "K" })
    @Html.ActionLink("L", "Index", new { startLetter = "L" })
    @Html.ActionLink("M", "Index", new { startLetter = "M" })
    @Html.ActionLink("N", "Index", new { startLetter = "N" })
    @Html.ActionLink("O", "Index", new { startLetter = "O" })
    @Html.ActionLink("P", "Index", new { startLetter = "P" })
    @Html.ActionLink("Q", "Index", new { startLetter = "Q" })
    @Html.ActionLink("R", "Index", new { startLetter = "R" })
    @Html.ActionLink("S", "Index", new { startLetter = "S" })
    @Html.ActionLink("T", "Index", new { startLetter = "T" })
    @Html.ActionLink("U", "Index", new { startLetter = "U" })
    @Html.ActionLink("V", "Index", new { startLetter = "V" })
    @Html.ActionLink("W", "Index", new { startLetter = "W" })
    @Html.ActionLink("X", "Index", new { startLetter = "X" })
    @Html.ActionLink("Y", "Index", new { startLetter = "Y" })
    @Html.ActionLink("Z", "Index", new { startLetter = "Z" })
  </p>
  <table class="table">
    <tr>
        <th>
            @Html.DisplayNameFor(model => model.FirstName)
        </th>
        <th>
            @Html.DisplayNameFor(model => model.LastName)
        </th>
        <th>
            @Html.DisplayNameFor(model => model.WorkEmail)
        </th>
        <th>
            @Html.DisplayNameFor(model => model.WorkPhone)
        </th>
        <th></th>
    </tr>

  @foreach (var item in Model) {
    <tr>
        <td>
            @Html.DisplayFor(modelItem => item.FirstName)
        </td>
        <td>
            @Html.DisplayFor(modelItem => item.LastName)
        </td>
        <td>
            @Html.DisplayFor(modelItem => item.WorkEmail)
        </td>
        <td>
            @Html.DisplayFor(modelItem => item.WorkPhone)
        </td>
    </tr>
  }

  </table>

  ```

4. Test the Project
  1. Press **F5** to start debugging the project.
  2. When prompted, enter your **Organizational Account** credentials.
  3. When the app appears, click some letters and verify that you get proper results.

Congratulations! You have finished creating solutions with SharePoint search. 


