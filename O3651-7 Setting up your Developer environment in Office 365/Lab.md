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
    1. Enter the address of a SharePoint site to use for testing the app (***NOTE:*** The targeted site must be based on a Developer Site template)
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
1. Update the Entity Framework package.
  1. Right click the AzurePHAWeb project and select Manage NuGet Packages.
  2. Type Entity Framework in the search box.
  3. Click the Install button for Entity Framework version 6.
  4. After the package is installed, click Close.
2. Add an Entity Framework model.
  1. In the Solution Explorer, right-click the Models folder in the AzurePHAWeb project.
  2. Select Add ? New Item from the context menu.
  3. In the New Item dialog:
    1. Select Visual C# ? Data ? ASP.NET Entity Data Model.
    2. Name the new model WingtipCRMModel.edmx.
    3. Click Add.
  4. In the Entity Data Model wizard:
    1. Click EF Designer from Database.
    2. Click Next.
    3. Click New Connection.
    4. In the Connection Properties dialog:
      1. Enter (local) in the Server Name field.
      2. Enter WingtipCRM in the Database Name field.
      3. Click Test Connection.
      4. Click OK.
      5. Click Next.
      6. Check Tables.
      7. Click Finish.
3. Add a controller.
  1. Build the AzurePHAWeb project.
  2. Right-click the Controllers folder and select Add ? Controller.
    1. Select MVC5 Controller with views using Entity Framework.
    2. Click Add.
    3. Select Customer as the Model Class. 
    4. Select WingtipCRMEntities as the Data Context Class.
    5. Click Add.
4. Update the App Manifest
  1. In the AzurePHA project, double-click the AppManifest.xml file.
  2. Update the Start Page to be AzurePHAWeb/Customers.
5. Test your app
  1. Press F5 to begin debugging.
  2. When prompted, log in using your O365 administrator credentials.
  3. When prompted, click Trust it.
  4. Verify that the customer data appears in the app.

## Exercise 4: Deploy the App to Production
In this exercise, you will deploy the database and app to the O365/Azure environment.

1. Create a Web Site and SQL Azure database
  1. Log into https://manage.windowsazure.com as an administrator.
  2. Click Web Sites.
  3. Click New.
  4. Click Custom Create.
  5. Enter a URL for the application. (**NOTE:** URLs must be globally unique, so you will have to choose one not used by another.)
  6. Select Create New Web Hosting Plan.
  7. Select an appropriate Region.
  8. Select Create a free 20MB SQL Database.
  10. Name the database connection string AzurePHA.
  11. Click the Right Arrow.
  12. In the Specify Database Settings
  13. Name the new database WingtipCRM.
    1. Select New SQL database server.
    2. Name the administrator AzurePHAAdmin and enter a password.
    3. Write down the credentials for later!
    4. Pick an appropriate Region.
    5. Click the checkmark. 
2. Upload test data to SQL Azure:
  1. In the Azure portal, click SQL database.
  2. Click WingtipCRM.
  3. Click Run Transact SQl Queries Against Your Database.
  4. When prompted to add a firewall rule, click Yes.
  5. When prompted, select to manage the WingtipCRM database.
  6. Log in to the database server using the credentials you created earlier.
  7. Paste the contents of the script CreateAzureWingtipCrmDatabase.sql into the query window.
  8. Click Run.
3. Update the SQL Azure connection string in the provider-hosted app.
  1. In the Azure portal, click SQL database.
  2. Click WingtipCRM.
  3. Click View SQL database connection strings.
  4. Copy the ADO.NET connection string.
  5. Open the web.config file for the AzurePHAWeb project.
  6. Locate the part of the connection string surrounded by encoded quotes as shown:
  7. Carefully replace the information between the encoded quotes with the connection string you obtained from the Azure portal. Be sure to update the string with your password as appropriate.
4. Register the app in Office 365
  1. Log into the O365 developer site as an administrator
  2. From the developer site, navigate to /_layouts/15/appregnew.aspx.
  3. Click Generate next to Client ID.
  4. Click Generate next to Client Secret.
  5. Enter Azure PHA as the Title.
  6. Enter the App Domain for the Azure web site you created earlier (e.g., azurepha.azurewebsites.net)
  7. Enter the Redirect URI as the reference for the Customers page (e.g. https://azurepha.azurewebsites.net/Customers).
  8. Click Create.
    1. Save the Client ID and Client Secret separately for later use.
5.  Update the provider-hosted app
  1. In the AzurePHA project open the AppManifest.xml file in a text editor.
  2. Update the Client ID and App Start page to reflect the values you created earlier.
  3. Open the web.config file for the AzurePHAWeb project.
  4. Update the Client ID and Client Secret to use the generated values.
6. Publish the remote web
  1. Right click the AzurePHAWeb project and select Publish.
  2. Click Windows Azure Web Sites.
  3. When prompted, select to deploy the remote web to the existing Azure web site you created earlier.
  4. Publish the remote web.
7. Update information in the Azure Portal	
  1. Return to the Azure Management portal.
  2. Click Web Sites.
  3. Select your Azure Web Site.
  4. Click Configure.
  5. In the App Settings section, add a ClientId and ClientSecret setting.
  6. Set the values to the values you generated earlier.
  7. Click Save.
8. Package the SharePoint App
  1. Right click the AzurePHA project and select Publish.
  2. Click Package the App.
  3. Enter the Start URL and Client ID for the app.
  4. Click Finish.
9. Publish the App to the Corporate Catalog
  1. Return to the O365 tenant and select Admin?SharePoint.
  2. Click Apps/App Catalog.
  3.Select Create new app catalog site.
  4. Click OK.
  5. Fill out the required information for the new app catalog site and click OK.
  6. Once created, navigate to the new app catalog site.
  7. In the app catalog site, click Apps for SharePoint.
  8. Click New.
  9. Browse to the app package you created earlier.
  10. Add the app package to the Apps for SharePoint library.
10. Add the app to a SharePoint site
  1. Navigate to a site in your O365 tenancy.
  2. Click Site Contents. (**NOTE:** If you are using the Developer site, it may have an older version of the app still installed from testing. You must remove the app from the site AND remove the entry from the “Apps in Testing” list or the new app will not install.)
  3. Click Add an App.
  4. Click From Your Organization.
  5. Click the app installer.
  6. When prompted, click Trust It.
11. Test the App
  1. Use the tile to launch the app.
  2. Verify that data from the SQL Azure database appears in the app.
  3. Manually remove /Customers from the URL in the browser. This should navigate you to the home page where you should be welcomed validating that the app communicates with SharePoint.

Congratulations! You have completed building a provider-hosted app using Office 365 and Azure.

