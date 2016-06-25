# Application Lifecycle Management
In this lab, you will implement continouous integration for a Provider-Hosted app deployed to Windows Azure and Office 365.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have a Microsoft Account. If not, obtain one at https://signup.live.com.

## Exercise 1: Create a Provider-Hosted App 
In this exercise you create a new provider-hosted app under source control.

1. Sign up for Visual Studio Online
  1. Sign in to Visual Studio Online (http://go.microsoft.com/fwlink/?LinkId=307137) with your **Microsoft Account**.
  2. If you are new to Visual Studio Online, you will have to fill out some additional information.
2. Connect to Team Foundation Server
  1. Start **Visual Studio 2013**.
  2. Click **Sign In**.<br/>
      ![Screenshot of the previous step](Images/01.png?raw=true "Figure 1")
  3. Click **Team/Connect to Team Foundation Server** from the main menu in Visual Studio 2013.
  4. Click **Team Explorer**.
  5. Click **Select Team Projects** to open the **Connect to Team Foundation Server** dialog.<br/>
      ![Screenshot of the previous step](Images/02.png?raw=true "Figure 2")
  6. Select your Team Foundation Server instance.
  7. Click **Connect**.<br/>
      ![Screenshot of the previous step](Images/03.png?raw=true "Figure 3")
  8. In the **Team Explorer**, click **Configure Your Workspace**.
  9. Enter an appropriate path to map your workspace to a local directory.
  10. Click **Map and Get**.<br/>
      ![Screenshot of the previous step](Images/04.png?raw=true "Figure 4") 
3. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  2. In Visual Studio select **File/New/Team Project**.
  3. In **Visual Studio Online** name the new Team Project **Lifecycle App Project**.
  4. Click **Create Project**<br/>
       ![Screenshot of the previous step](Images/05.png?raw=true "Figure 5")
  5. In Visual Studio, select **View/Team Explorer**.
  6. Click **Source Control Explorer**.
  7. Right click the **Default Collection** and select **Get Latest Version**.
  8. In Visual Studio select **File/New/Project**.
  9. In the New Project dialog:
    1. Select **Templates/Visual C#/Office/SharePoint/Apps**.
    2. Click **App for SharePoint 2013**.
    3. Select to place the new project in the **Lifecycle App Project** directory.
    4. Name the new project **LifecycleApp**.
    5. Check the box **Add to Source Control**.
    6. Click **OK**.<br/>
       ![Screenshot of the previous step](Images/06.png?raw=true "Figure 6")
  7. In the New App for SharePoint wizard:
    1. Enter the address of a SharePoint site to use for testing the app (***NOTE:*** The targeted site must be based on a Developer Site template)
    2. Select **Provider-Hosted** as the hosting model.
    3. Click **Next**.<br/>
       ![Screenshot of the previous step](Images/07.png?raw=true "Figure 7")
    4. Select **ASP.NET MVC Web Application**.
    5. Click **Next**.<br/>
       ![Screenshot of the previous step](Images/08.png?raw=true "Figure 8")
    6. Select the option labeled **Use Windows Azure Access Control Service (for SharePoint cloud apps)**.
    7. Click **Finish**.<br/>
       ![Screenshot of the previous step](Images/09.png?raw=true "Figure 9")
    8. When prompted, select to add the new project to the **Lifecycle App Project** Team Project.
4. When the project is created, **Build** the solution.

## Exercise 2: Deploy the App
In this exercise, you will perform the initial deployment of the app to the O365/Azure environment.

1. Deploy the remote web to Windows Azure.
  1. In the **Solution Explorer**, right click the **LifecycleAppWeb** project and select **Publish**.
  2. In the **Publish Web** dialog:
    1. Click **Windows Azure Web Sites**.
    2. In the **Select Existing Web Site** dialog, click **Sign In**.
    3. Sign in using your **Organizational Account**.
    4. Click **New**.
    5. In the **Create Site on Windows Azure** dialog, give your app a unique name and select a region for hosting.
    6. Click **Create**.<br/>
       ![Screenshot of the previous step](Images/10.png?raw=true "Figure 10")
    7. In the **Publish Web** dialog, click **Publish**.
2. Register the app in Office 365
  1. Log into the O365 developer site as an administrator
  2. From the developer site, navigate to **/_layouts/15/appregnew.aspx**.
  3. Click **Generate** next to Client ID.
  4. Click **Generate** next to Client Secret.
  5. Enter **Lifecycle App** as the Title.
  6. Enter the **App Domain** for the Azure web site you created earlier (e.g., lifecycleapp.azurewebsites.net)
  7. Enter the **Redirect URI** as the reference for home page (e.g. https://lifecycleapp.azurewebsites.net).
  8. Click **Create.**
    1. Save the **Client ID** and **Client Secret** separately for later use.<br/>
         ![Screenshot of the previous step](Images/11.png?raw=true "Figure 11")
3.  Update the provider-hosted app
  1. In the **LifecycleApp** project open the **AppManifest.xml** file in a text editor.
  2. Update the **Client ID** and **App Start page** to reflect the values you created earlier.<br/>
         ![Screenshot of the previous step](Images/12.png?raw=true "Figure 12")
  3. Open the **web.config** file for the **LifecycleAppWeb** project.
  4. Update the **Client ID** and **Client Secret** to use the generated values.
4. Update information in the Azure Portal	
  1. Open to the [Azure Management portal](https://manage.windowsazure.com).
  2. Click **Web Sites**.
  3. Select your Azure Web Site.
  4. Click **Configure**.
  5. In the **App Settings** section, add a **ClientId** and **ClientSecret** setting.
  6. Set the values to the values you generated earlier.
  7. Click **Save**.<br/>
5. Package the SharePoint App
  1. In **Visual Studio 2013**, right click the **LifecycleApp** project and select **Publish**.
  2. Click **Package the App**.
  3. Enter the **Start URL** and **Client ID** for the app.
  4. Click **Finish**.<br/>
         ![Screenshot of the previous step](Images/13.png?raw=true "Figure 13")
6. Publish the App to the Corporate Catalog
  1. Return to the O365 tenant and select **Admin/SharePoint**.
  2. Click **Apps/App Catalog**.
  3. In the app catalog site, click **Apps for SharePoint**.
  4. Click **New**.
  5. **Browse** to the app package you created earlier.
  6. **Add** the app package to the Apps for SharePoint library.
7. Add the app to a SharePoint site
  1. Navigate to a site in your O365 tenancy.
  2. Click **Site Contents**.
  3. Click **Add an App**.
  4. Click **From Your Organization**.
  5. Click the app installer.
  6. When prompted, click **Trust It**.

## Exercise 3: Configure Continuous Integration
In this exercise, you will utilize Visual Studio Online to automatically deploy the app when code is updated.

1. In **Visual Studio 2013**, check in the code.
  1. Right click the **LifecycleApp** solution and select **Check In...**.
  2. Enter a comment and click "Check In".<br/>
         ![Screenshot of the previous step](Images/14.png?raw=true "Figure 14")
2. In **Visual Studio 2013**, make some code changes.
  1. In the **LifecycleApp** project, open **AppManifest.xml**.
  2. Update the app title to be **Lifecycle Demonstration App**.
  3. In the ""LifecycleAppWeb** project, open **Index.cshtml** from the **Views/Home** folder.
  4. **Replace** all of the code with the following:
  ```HTML

  @{
      ViewBag.Title = "Home Page";
  }

  <div class="jumbotron">
      <h2>Welcome @ViewBag.UserName! You have successfully implemented Continuous Integration.</h2>
  </div>

  ```
3. Navigate to the [Azure Portal](https://manage.windowsazure.com)
  1. Click **Web Sites**.
  2. Click the web site created for this exercise.
  3. Click **Setup Deployment from Source Control**.
         ![Screenshot of the previous step](Images/15.png?raw=true "Figure 15")
  4. Select **Visual Studio Online**.
  5. Click the **Next** arrow.<br/>
         ![Screenshot of the previous step](Images/16.png?raw=true "Figure 16")
  6. Fill in the information for your instance of **Visual Studio Online** and click **Authorize Now**.
  7. When prompted, click **Accept**.
  8. Select to deploy **Lifecycle App Project** and click the **checkmark**.<br/>
         ![Screenshot of the previous step](Images/17.png?raw=true "Figure 17")
4. In **Visual Studio 2013**, configure the build process.
  1. Click the **Team Explorer** tab.
  2. Click the **Home** icon.
  3. Click **Builds**.
  4. Right-click the build definition **lifecycleapp_CD** and select **Edit Build Definition**.
         ![Screenshot of the previous step](Images/18.png?raw=true "Figure 18")
  5. Click **General** and verify that the build definition is **Enabled**.<br/>
         ![Screenshot of the previous step](Images/19.png?raw=true "Figure 19")
  6. Click **Trigger** and verify that the it is set to **Continuous Integration**.<br/>
         ![Screenshot of the previous step](Images/20.png?raw=true "Figure 20")
  7. Click **Source Settings** and verify that the **Lifecycle App** is selected.<br/>
         ![Screenshot of the previous step](Images/21.png?raw=true "Figure 21")
  8. Click **Process**.
  9. Expand the **Deployment** node.
  10. Click **SharePoint Deployment**.
  11. In the **Office 365 Deployment Settings** dialog:
    1. Enter **Lifecycle App O365** in the **Deployment Settings Name** field.
    2. Enter the URL for the target SharePoint site in the **SharePoint URL** field.
    3. Enter your **Organizational Account** in the **User Name** field.
    4. Enter your password in the **Password** field.
    5. Click **OK**.<br/>
         ![Screenshot of the previous step](Images/22.png?raw=true "Figure 22")
  12. Save the project.
5. Check in your code changes, build, and deploy.
  1. Right click the **LifecycleApp** solution and select **Check In...**.
  2. Enter a comment and click "Check In". 
  3. Click **Team Explorer**.
  4. Click the **Home** icon.
  5. Click **Builds**.
  6. Double click the in-process build so you can montior the progress.<br/>
         ![Screenshot of the previous step](Images/23.png?raw=true "Figure 23")
6. Validate changes
  1. When the build is complete, navigate to O365 and verify that the app title has changed.<br/>
         ![Screenshot of the previous step](Images/24.png?raw=true "Figure 24")
  2. Launch the app and verify the UI changes were successfully deployed to Windows Azure.<br/>
         ![Screenshot of the previous step](Images/25.png?raw=true "Figure 25")

## Exercise 4: Build Validation Testing
In this exercise, you will use Microsoft Test Manager to create a test plan for the app.

1. Add a new Test Plan
  1. In **Visual Studio 2013**, click **Team Explorer**.
  2. Click **Web Portal** to open Visual Studio Online.
  3. Click **Test**.<br/>
          ![Screenshot of the previous step](Images/26.png?raw=true "Figure 26")
  4. Select to create a new **Test Plan**.<br/>
          ![Screenshot of the previous step](Images/27.png?raw=true "Figure 27")
  5. Name the new Test Plan **Build Validation**.
  6. Click **Create**.<br/>
          ![Screenshot of the previous step](Images/28.png?raw=true "Figure 28")
2. Create a Test case
  1. Select to create a new **Test Case**.<br/>
          ![Screenshot of the previous step](Images/29.png?raw=true "Figure 29")
  2. Name the test **Launch Test**.
  3. Add steps to the test so it appears as shown.
  4. Click **Save**.<br/>
          ![Screenshot of the previous step](Images/30.png?raw=true "Figure 30")
  5. Close the dialog.
  6. Click **Open Test Plan using Microsoft Test Manager**.<br/>
          ![Screenshot of the previous step](Images/31.png?raw=true "Figure 31")
  7. In **Microsoft Test Manager**, mark the testing suite as **In Progress**.<br/>
          ![Screenshot of the previous step](Images/32.png?raw=true "Figure 32")
  8. Click **Test**.
          ![Screenshot of the previous step](Images/33.png?raw=true "Figure 33")
  9. Right click the **Launch Test** and select **Run**.<br/>
          ![Screenshot of the previous step](Images/34.png?raw=true "Figure 34")
  10. Check **Create Action Recording**.
  11. Click **Start Test**.
  12. Follow the steps in the test to record the test case.
  13. Click **End Test** when you are finished.
  14. When finished, click **Save and Close**.<br/>
          ![Screenshot of the previous step](Images/35.png?raw=true "Figure 35")


Congratulations! You have completed implementing Continuous Integration.



