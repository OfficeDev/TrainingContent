# Deep Dive into Business Connectivity Services in Office 365
In this lab, you will create solutions using Business Connectivity Services.

## Prerequisites
1. You must have an Office 365 tenant to complete exercise 1. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have an on-premises installation of SharePoint 2013 to complete exercise2.

## Exercise 1: Creating an App-Level ECTs 
In this exercise you will create an External Content Type based on an OData source.

1. Create the App Project
  1. Start **Visual Studio 2013**.
  2. Select **File/New/Project** from the main menu.
  3. In the **New Project** dialog:
    1. Select **Templates/Visual C#/Office/SharePoint/Apps**.
    2. Select **App for SharePoint**.
    3. Name the new project **AppLevelEct**.
    4. Click **OK**.<br/>
      ![Screenshot of the previous step](Images/01.png?raw=true "Figure 1")
  4. In the **New App for SharePoint** wizard:
    1. Enter the URL of your tenancy.
    2. Select **Provider-Hosted**.
    3. Click **Next**.
      ![Screenshot of the previous step](Images/02.png?raw=true "Figure 2")  
    4. Select **ASP.NET MVC Web Application**.
    5. Click **Finish**.
  5. When prompted, enter your **Organizational Account** credentials.
  
2. Add an app-level External Content Type
  1. In the **Solution Explorer**, right click the **AppLevelEct** project and select **Add/Content Types for an External Data Source**.
  2. In the **SharePoint Customization wizard**:
    1. Enter **http://services.odata.org/Northwind/Northwind.svc/** in the field labeled **What OData Service URL do you want to use to create the external data source?**.
    2. Enter **Northwind** in the field labeled **What do you want to name your new data source?**
    3. Click **Next**.<br/>
      ![Screenshot of the previous step](Images/03.png?raw=true "Figure 3")  
    4. Check **Employees**.
    5. Click **Finish**.<br/>
      ![Screenshot of the previous step](Images/04.png?raw=true "Figure 4") 

3. Code the Remote web
  1. In the **Solution Explorer**, right click the **Models** folder and select **Add/Existing Item**.
  2. Browse to the **Lab Files** folder and add **Employee.cs** to the project.
  3. Expand the **Controllers** folder and open **HomeController.cs** for editing.
  4. Add the following statement to the top of the file:

  ```C#
  using AppLevelectWeb.Models;
  ```

  5. **Replace** the **Index** method with the following code to read the External List.
  
  ```C#

        public ActionResult Index(string lastPosition)
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
            List<Employee> employees = new List<Employee>();

            using (var clientContext = spContext.CreateUserClientContextForSPAppWeb())
            {
                List list = clientContext.Web.Lists.GetByTitle("Employees");
                CamlQuery camlQuery = new CamlQuery();

                if (lastPosition != null)
                {
                    ListItemCollectionPosition position = new ListItemCollectionPosition();
                    position.PagingInfo = string.Format("Paged=TRUE&p_ID={0}", lastPosition);
                    camlQuery.ListItemCollectionPosition = position;
                    lastPosition = (int.Parse(lastPosition) + 20).ToString();
                }
                else
                {
                    lastPosition = "20";
                }

               camlQuery.ViewXml=@"<View>
                    <Query>
                      <OrderBy>
                        <FieldRef Name='LastName'/>
                      </OrderBy>
                    </Query>
                    <ViewFields>
                      <FieldRef Name='EmployeeID'/>
                      <FieldRef Name='LastName'/>
                      <FieldRef Name='FirstName'/>
                      <FieldRef Name='HireDate'/>
                      <FieldRef Name='HomePhone'/>
                    </ViewFields>
                    <RowLimit>100</RowLimit>
                  </View>";

                ListItemCollection listItems = list.GetItems(camlQuery);
                clientContext.Load(
                     listItems,
                     items => items
                         .Include(
                             item => item["EmployeeID"],
                             item => item["LastName"],
                             item => item["FirstName"],
                             item => item["HireDate"],
                             item => item["HomePhone"]));
                clientContext.ExecuteQuery();

                foreach (ListItem listItem in listItems)
                {
                    Employee employee = new Employee();
                    employee.EmployeeID = listItem["EmployeeID"] == null ? -1 : (int)listItem["EmployeeID"];
                    employee.FirstName = listItem["FirstName"] == null ? string.Empty : listItem["FirstName"].ToString();
                    employee.LastName = listItem["LastName"] == null ? string.Empty : listItem["LastName"].ToString();
                    employee.HomePhone = listItem["HomePhone"] == null ? string.Empty : listItem["HomePhone"].ToString();
                    employee.HireDate = listItem["HireDate"] == null ? DateTime.Today : (DateTime)listItem["HireDate"];
                    employees.Add(employee);
                }
            }

            ViewBag.LastPosition = lastPosition;
            return View(employees);
        }

  ``` 

  6. Expand the **Views** folder and then the **Home** folder.
  7. Open **Index.cshtml** for editing.
  8. **Replace** all of the code in the view with the following:

  ```HTML

  @model IEnumerable<AppLevelectWeb.Models.Employee>

  @{
    ViewBag.Title = "Index";
  }

  <h2>Index</h2>

  <p>
    @Html.ActionLink("Next", "Index", new { lastPosition = @ViewBag.LastPosition })
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
            @Html.DisplayNameFor(model => model.HireDate)
        </th>
        <th>
            @Html.DisplayNameFor(model => model.HomePhone)
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
            @Html.DisplayFor(modelItem => item.HireDate)
        </td>
        <td>
            @Html.DisplayFor(modelItem => item.HomePhone)
        </td>
    </tr>
  }

  </table>

  ```

4. Test the app
  1. Press **F5** to debug the app.
  2. Verify that employee names appear in the app.
      ![Screenshot of the previous step](Images/05.png?raw=true "Figure 5") 


## Exercise 2: Create a Remote Event Receiver
In this exercise you will configure a Remote Event Receiver sample

1. Create a SQl Azure database.
  1. Log into the [Azure Portal](https://manage.windowsazure.com) as an administrator.
  2. Select **New/Data Services/SQL Database/Quick Create**.<br/>
      ![Screenshot of the previous step](Images/06.png?raw=true "Figure 6") 
    1. Enter **MiniCRM** for the **Database Name**.
    2. Create a new SQL database server in an appropriate region
    3. Enter **MiniCRMAdmin** for the **Login Name**.
    4. Enter a **Password**.
    5. Click **Create SQL database**.<br/>
      ![Screenshot of the previous step](Images/07.png?raw=true "Figure 7") 

2. Upload test data to SQL Azure:
  1. In the Azure portal, click **SQL database**.
  2. Click **Dashboard**.
    1. Click **Manage allowed IP addresses**.
    2. **Add** a new rule to allow addresses **0.0.0.0** through **255.255.255.255**.
    3. Click **Save**.
      ![Screenshot of the previous step](Images/07a.png?raw=true "Figure 7a") 
  3. Click **MiniCRM** and copy down your database server name.
  4. Click **Run Transact SQL Queries Against Your Database**.
  5. If prompted to add a firewall rule, click **Yes**.
  6. If prompted, select to manage the **MiniCRM** database.
  7. Log in to the database server using the credentials you created earlier.
      ![Screenshot of the previous step](Images/08.png?raw=true "Figure 8") 
  8. Paste the contents of the following script into the query window. 
 
     ```

     CREATE TABLE [dbo].[Customers](
      [ID] [int] IDENTITY(1,1) NOT NULL,
      [FirstName] [nvarchar](100) NOT NULL,
      [LastName] [nvarchar](100) NOT NULL,
      [Company] [nvarchar](100) NULL,
      [WorkPhone] [nvarchar](100) NULL,
      [HomePhone] [nvarchar](100) NULL,
      [EmailAddress] [nvarchar](100) NULL,
      CONSTRAINT [PK_Customers] PRIMARY KEY CLUSTERED ([ID] ASC))
     
     GO

     CREATE TABLE [dbo].[Subscriptions](
     	[SubscriptionId] [int] IDENTITY(1,1) NOT NULL,
	[EventType] [nvarchar](50) NULL,
	[DeliveryAddress] [nvarchar](255) NULL,
       CONSTRAINT [PK_Subscriptions] PRIMARY KEY CLUSTERED ([SubscriptionId] ASC))

     GO
     
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Gordon', 'Hee', 'Adventure Works Cycles', '1(340)555-7748', '1(340)555-3737', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Michael', 'Allen', 'Blue Yonder Airlines', '1(203)555-0466', '1(203)555-0071', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('James', 'Alvord', 'City Power and Light', '1(518)555-6571', '1(518)555-8576', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Jeff', 'Phillips', 'Coho Vineyard', '1(270)555-1720', '1(270)555-7810', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Stefen', 'Hessee', 'Contoso, Ltd', '1(407)555-4851', '1(407)555-5411', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Christian', 'Hess', 'Fabrikam, Inc', '1(844)555-0550', '1(844)555-3522', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Cassie', 'Hicks', 'Fourth Coffee', '1(204)555-6648', '1(204)555-2831', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Chris', 'Preston', 'Litware, Inc', '1(407)555-7308', '1(407)555-1700', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Diane', 'Prescott', 'Lucerne Publishing', '1(323)555-3404', '1(323)555-7814', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Michael', 'Hillsdale', 'Margie Travel', '1(802)555-5583', '1(802)555-0246', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Ran', 'Yossi', 'Northwind Traders', '1(250)555-4824', '1(250)555-3653', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Arlene', 'Huff', 'Proseware, Inc', '1(248)555-1267', '1(248)555-0302', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Julia', 'Isla', 'School of Fine Art', '1(270)555-5347', '1(270)555-3401', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Rodrigo', 'Ready', 'Southridge Video', '1(808)555-1110', '1(808)555-4310', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('Shu', 'Ito', 'Trey Research', '1(844)555-5428', '1(844)555-2117', 'someone@example.com') 
     INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) Values('David', 'Jaffe', 'Wingtip Toys', '1(340)555-4478', '1(340)555-1010', 'someone@example.com') 
     
     GO

     ```
  9. Click **Run**.


3. Create a Secure Store application definition
  1. Log into your SharePoint tenancy using your **Organizational Account**.
  2. Select **SharePoint/Admin**.<br/>
      ![Screenshot of the previous step](Images/09.png?raw=true "Figure 9")  
  3. Click **Secure Store**.
  4. Click **New**.<br/>
      ![Screenshot of the previous step](Images/10.png?raw=true "Figure 10")  
    1. Enter **MiniCRM** for the **Target Application ID**.
    2. Enter **MiniCRM** for the **Display Name**.
    3. Enter your e-mail address for the **Contact e-mail**.
    4. Enter **SQL Azure Username** for the user name **Field Name**.
    5. Enter **SQL Azure Password** for the password **Field Name**.
    6. Enter your account for the **Target Application Administrators**.
    7. Enter **Everyone** for the **Members**.
    8. Click **OK**.<br/>
      ![Screenshot of the previous step](Images/11.png?raw=true "Figure 11")
  5. Click **Set Credentials**.<br/>
    ![Screenshot of the previous step](Images/12.png?raw=true "Figure 12")  
    1. Enter **MiniCRMAdmin** for the **SQL Azure Username**.
    2. Enter your password for **SQL Azure Password**.
    3. Click **OK**.<br/>
      ![Screenshot of the previous step](Images/13.png?raw=true "Figure 13")

4. Configure BCS Permissions.
  1. Click **BCS**.
  2. Click **Manage BDC Models and external Content Types**.<br/>
      ![Screenshot of the previous step](Images/14.png?raw=true "Figure 14")  
  3. Click **Set Metadata Store Permissions**.<br/>
      ![Screenshot of the previous step](Images/15.png?raw=true "Figure 15")  
    1. Resolve your name and click **Add**.
    2. Check all of the permissions.
    3. Check the box to **Propogate permissions**.
    4. Click **OK**.<br/>
      ![Screenshot of the previous step](Images/16.png?raw=true "Figure 16")  

5. Configure External Content Type
  1. Navigate to the **Lab Files** folder and Open **MiniCRMCustomerModel.bdcm.xml**.
  2. Locate the placeholder **[YOUR SERVER]** and replace it with the proper value for your SQl Azure instance.
  3. Log into your SharePoint tenancy using your **Organizational Account**.
  4. Select **SharePoint/Admin**.
  5. Click **BCS**.
  6. Click **Manage BDC Models and external Content Types**.
  7. Click **Import**.<br/>
      ![Screenshot of the previous step](Images/17.png?raw=true "Figure 17")
  8. Browse to the edited **MiniCRMCustomerModel.bdcm.xml** file and click **Import**.

6. Create an External List
  1. Navigate to the root team Site in your tenancy.
  2. Click **Site Contents**.
  3. Click **Add an App**.
  4. Click **External List**.
    1. Name the new list **Customers**.
    2. Select **Customer** for the **External Content Type**.
    3. Click **Create**.<br/>
      ![Screenshot of the previous step](Images/18.png?raw=true "Figure 18")

7. Add a Subscription
  1. In the Team Site where you created the Customers list, select **Site Settings**.
  2. Click **Manage Site Features**.
  3. **Activate** the **External System Events** feature.<br/>
      ![Screenshot of the previous step](Images/19.png?raw=true "Figure 19")
  4. Navigate to the **Customers** list.
  5. Click **List**.
  6. Click **Alert Me** and then **Set an Alert on this List**. This will create a new subscription in the External System.<br/>
      ![Screenshot of the previous step](Images/20.png?raw=true "Figure 20")
  7. In the alert dialog, simply click **OK** to accept the defaults.<br/>
      ![Screenshot of the previous step](Images/21.png?raw=true "Figure 21")
  8. Return to the Azure portal and click **SQL database**.
  9. Click **MiniCRM**.
  10. Click **Run Transact SQL Queries Against Your Database**.
  11. Log in to the database server using the credentials you created earlier.
  12. Paste the contents of the following script into the query window. 
 
    ```
     Select * FROM Subscriptions
    ```
  13. Click **Run**.
  14. Verify that the notification endpoints are present in the table for the create, update, and delete operations.<br/>
      ![Screenshot of the previous step](Images/22.png?raw=true "Figure 22")

8. Send a Notification
  1. Locate the Project **MiniCRMApp** located in the **Lab Files** folder.
  2. Open **MiniCRMApp** in **Visual Studio 2013**.
  3. Update the **SiteUrl** property of the **MiniCRMApp** project to refer to your tenancy.<br/>
      ![Screenshot of the previous step](Images/23.png?raw=true "Figure 23")
  4. In the **Solution Explorer**, expand the **Controllers** folder.
  5. Open **HomeController.cs** for editing.
  6. **Replace** the placeholder **[YOUR CONNECTION STRING]** with the connection string for your SQL Azure database.
  7. Press **F5** to start debugging.
  8. When the app starts, you will see a form for adding a customer to the database.<br/>
      ![Screenshot of the previous step](Images/24.png?raw=true "Figure 24")
  9. Fill out the form and create a new entry. After a little time, you should receive an alert notification in your inbox.<br/>
      ![Screenshot of the previous step](Images/25.png?raw=true "Figure 25")

Congratulations! You have finished creating solutions with Business Connectivity Services. 


