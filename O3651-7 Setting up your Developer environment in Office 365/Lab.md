# Setting up your Development Environment in Office 365
In this lab, you will create a cloud development environment and build a cloud-hosted app.

## Exercise 1: Obtain Office 365 and Azure subscriptions 
In this exercise you obtain trial subscriptions to Office 365 and Azure. If you already have these subscriptions, you can skip this exercise.

1. Sign up for an Office 365 developer subscription.
  1. Navigate to the [Office Dev Center](http://msdn.microsoft.com/en-us/library/office/fp179924(v=office.15).aspx)
  2. Under the heading **Sign up for an Office 365 Developer Site** click **Try It Free**.
     ![](Images/1.png?raw=true "Figure 1")
  3. Fill out the form to obtain your trial O365 subscription.
  4. When completed, you will have a developer site in the [subscription].sharepoint.com domain located at the root of your subscription (e.g. https://mysubscription.sharepoint.com)
2. Sign up for an Azure trial subscription
  1. Navigate to the [Azure Portal](https://manage.windowsazure.com)
  2. If prompted, log in using the credentials you created for your O365 subscription.
  3. After logging in, you should see a screen notifying you that you do not have a subscription
     ![](Images/2.png?raw=true "Figure 2")
  4. Click Sign Up for Windows Azure.
  5. Fill out the form to obtain your free trial.

## Exercise 2: Create a Provider-Hosted App 
In this exercise you create a new provider-hosted app for your O365 subscription.

1. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator: 
  2. In Visual Studio select **File/New/Project**.
  3. In the New Project dialog:
    1. Select **Templates/Visual C#/Office/SharePoint/Apps**.
    2. Click **App for SharePoint 2013**.
    3. Name the new project **AzurePHA** and click **OK**.
       ![](Images/3.png?raw=true "Figure 3")
  4. In the New App for SharePoint wizard:
    1. Enter the address of a SharePoint site to use for testing the app

> NOTE: The targeted site must be based on a Developer Site template


    2. Select **Provider-Hosted** as the hosting model.
    3. Click **Next**.
       ![](Images/4.png?raw=true "Figure 4")
    4. Select **ASP.NET MVC Web Application**.
    5. Click **Next**.
       ![](Images/5.png?raw=true "Figure 5")
    6. Select the option labeled **Use Windows Azure Access Control Service (for SharePoint cloud apps)**.
    7. Click **Finish**.
       ![](Images/6.png?raw=true "Figure 6")
    8. When prompted, log in using your O365 administrator credentials.
2. Test your app
  1. Press F5 to begin debugging.
  2. When prompted, log in using your O365 administrator credentials.
  3. When prompted, click **Trust it**.
       ![](Images/7.png?raw=true "Figure 7")
  4. Verify that the app home page shows and that it properly welcomes you by name.
       ![](Images/8.png?raw=true "Figure 8")
 
## Exercise 3: Access a Database using MVC5
In this exercise, you will add additional functionality to the app to read data from the Wingtip CRM database, which was set up in previous labs.
1.	Update the Entity Framework package.
a)	Right click the AzurePHAWeb project and select Manage NuGet Packages.
b)	Type Entity Framework in the search box.
c)	Click the Install button for Entity Framework version 6.
 
d)	After the package is installed, click Close.
2.	Add an Entity Framework model.
a)	In the Solution Explorer, right-click the Models folder in the AzurePHAWeb project.
b)	Select Add ? New Item from the context menu.
c)	In the New Item dialog:
i)	Select Visual C# ? Data ? ASP.NET Entity Data Model.
ii)	Name the new model WingtipCRMModel.edmx.
iii)	Click Add.
 
d)	In the Entity Data Model wizard:
i)	Click EF Designer from Database.
ii)	Click Next.
 
iii)	Click New Connection.
iv)	In the Connection Properties dialog:
(1)	Enter (local) in the Server Name field.
(2)	Enter WingtipCRM in the Database Name field.
(3)	Click Test Connection.
(4)	Click OK.
v)	Click Next.
 
vi)	Check Tables.
vii)	Click Finish.
 
3.	Add a controller.
a)	Build the AzurePHAWeb project.
b)	Right-click the Controllers folder and select Add ? Controller.
i)	Select MVC5 Controller with views using Entity Framework.
ii)	Click Add.
 
iii)	Select Customer as the Model Class..
Select WingtipCRMEntities as the Data Context Class.
iv)	Click Add.
v)	 
4.	Update the App Manifest
a)	In the AzurePHA project, double-click the AppManifest.xml file.
b)	Update the Start Page to be AzurePHAWeb/Customers.
5.	Test your app
a)	Press F5 to begin debugging.
b)	When prompted, log in using your O365 administrator credentials.
c)	When prompted, click Trust it.
d)	Verify that the customer data appears in the app.
Exercise 4: Deploy the App to Production
In this exercise, you will deploy the database and app to the O365/Azure environment.
1.	Create a Web Site and SQL Azure database
a)	Log into https://manage.windowsazure.com as an administrator.
b)	Click Web Sites.
c)	Click New.
d)	Click Custom Create.
 
e)	Enter a URL for the application.
NOTE: URLs must be globally unique, so you will have to choose one not used by another.
f)	Select Create New Web Hosting Plan.
g)	Select an appropriate Region.
h)	Select Create a free 20MB SQL Database.
i)	Name the database connection string AzurePHA.
j)	Click the Right Arrow.
 
k)	In the Specify Database Settings
i)	Name the new database WingtipCRM.
ii)	Select New SQL database server.
iii)	Name the administrator AzurePHAAdmin and enter a password.
Write down the credentials for later!
iv)	Pick an appropriate Region.
v)	Click the checkmark.
 
2.	Upload test data to SQL Azure:
a)	In the Azure portal, click SQL database.
b)	Click WingtipCRM.
c)	Click Run Transact SQl Queries Against Your Database.
d)	When prompted to add a firewall rule, click Yes.
 
e)	When prompted, select to manage the WingtipCRM database.
 
f)	Log in to the database server using the credentials you created earlier.
g)	Paste the contents of the script CreateAzureWingtipCrmDatabase.sql into the query window.
h)	Click Run.
 
3.	Update the SQL Azure connection string in the provider-hosted app.
a)	In the Azure portal, click SQL database.
b)	Click WingtipCRM.
c)	Click View SQL database connection strings.
d)	Copy the ADO.NET connection string.
e)	Open the web.config file for the AzurePHAWeb project.
f)	Locate the part of the connection string surrounded by encoded quotes as shown:
 
g)	Carefully replace the information between the encoded quotes with the connection string you obtained from the Azure portal. 
Be sure to update the string with your password as appropriate.
4.	Register the app in Office 365
a)	Log into the O365 developer site as an administrator
b)	From the developer site, navigate to /_layouts/15/appregnew.aspx.
c)	Click Generate next to Client ID.
d)	Click Generate next to Client Secret.
e)	Enter Azure PHA as the Title.
f)	Enter the App Domain for the Azure web site you created earlier (e.g., azurepha.azurewebsites.net)
g)	Enter the Redirect URI as the reference for the Customers page (e.g. https://azurepha.azurewebsites.net/Customers).
h)	Click Create.
 
i)	Save the Client ID and Client Secret separately for later use.
5.	Update the provider-hosted app
a)	In the AzurePHA project open the AppManifest.xml file in a text editor.
b)	Update the Client ID and App Start page to reflect the values you created earlier.
 
c)	Open the web.config file for the AzurePHAWeb project.
d)	Update the Client ID and Client Secret to use the generated values.
6.	Publish the remote web
a)	Right click the AzurePHAWeb project and select Publish.
b)	Click Windows Azure Web Sites.
 
c)	When prompted, select to deploy the remote web to the existing Azure web site you created earlier.
d)	Publish the remote web.
7.	Update information in the Azure Portal	
a)	Return to the Azure Management portal.
b)	Click Web Sites.
c)	Select your Azure Web Site.
d)	Click Configure.
e)	In the App Settings section, add a ClientId and ClientSecret setting.
f)	Set the values to the values you generated earlier.
g)	Click Save.
 
The update to the Azure Portal is required because the Client ID and Client Secret are not automatically picked up from the web.config file in Azure.
8.	Package the SharePoint App
a)	Right click the AzurePHA project and select Publish.
b)	Click Package the App.
c)	Enter the Start URL and Client ID for the app.
d)	Click Finish.
 
9.	Publish the App to the Corporate Catalog
a)	Return to the O365 tenant and select Admin?SharePoint.
 
b)	Click Apps ? App Catalog.
c)	 
d)	Select Create new app catalog site.
e)	Click OK.
f)	 Fill out the required information for the new app catalog site and click OK.
g)	Once created, navigate to the new app catalog site.
h)	In the app catalog site, click Apps for SharePoint.
i)	Click New.
j)	Browse to the app package you created earlier.
k)	Add the app package to the Apps for SharePoint library.
10.	Add the app to a SharePoint site
a)	Navigate to a site in your O365 tenancy.
b)	Click Site Contents.
NOTE: If you are using the Developer site, it may have an older version of the app still installed from testing. You must remove the app from the site AND remove the entry from the “Apps in Testing” list or the new app will not install..
c)	Click Add an App.
d)	Click From Your Organization.
 
e)	Click the app installer.
f)	When prompted, click Trust It.
11.	Test the App
a)	Use the tile to launch the app.
b)	Verify that data from the SQL Azure database appears in the app.
c)	Manually remove /Customers from the URL in the browser. This should navigate you to the home page where you should be welcomed validating that the app communicates with SharePoint.
Congratulations! You have completed building a provider-hosted app using Office 365 and Azure.

