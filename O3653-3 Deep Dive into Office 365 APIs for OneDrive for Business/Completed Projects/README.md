# How to Run the Completed Sample

## Step 1: Build the Project
1. Open the project in Visual Studio 2013.
1. Simply Build the project to restore NuGet packages.
1. Ignore any build errors for now as we will configure the project in the next steps.

## Step 2: Configure the sample
Once downloaded, open the sample in Visual Studio.

### Register Azure AD application to consume Office 365 APIs
Office 365 applications use Azure Active Directory (Azure AD) to authenticate and authorize users and applications respectively. All users, application registrations, permissions are stored in Azure AD.

Using the Office 365 API Tool for Visual Studio you can configure your web application to consume Office 365 APIs. 

1. In the Solution Explorer window, **right click your project -> Add -> Connected Service**.
1. A Services Manager dialog box will appear. Choose **Office 365 -> Office 365 API** and click **Register your app**.
1. On the sign-in dialog box, enter the username and password for your Office 365 tenant. 
1. After you're signed in, you will see a list of all the services. 
1. Initially, no permissions will be selected, as the app is not registered to consume any services yet.
1. Select **Users and Groups** and then click **Permissions**.
1. In the **Users and Groups Permissions** dialog, select **Enable sign-on and read users** profiles' and click **Apply**.
1. Select **My Files** and then click **Permissions**.
1. In the **My Files Permissions** dialog, select **Read users' files** & **Edit or delete users' files**, then click **Apply**.
1. Click on **App Properties** and select **Single Organizations** to make this app single-tenant and remove the HTTP endpoint.
1. Click **Ok**.
1. Open the `web.config` file and update the **ida:TenantID** setting to include the GUID of your Azure AD subscription ID.

  > You can get this GUID if you login to your Azure subscription & go to your Azure AD directory. Look at the URL and you will see a GUID in the URL. Copy just that GUID out and put it in the **ida:TenantID** in the `web.config`.

After clicking OK in the Services Manager dialog box, Office 365 client libraries (in the form of NuGet packages) for connecting to Office 365 APIs will be added to your project. 

In this process, Office 365 API tool registered an Azure AD Application in the Office 365 tenant that you signed in the wizard and added the Azure AD application details to `web.config`. 

### Step 3: Build and Debug your web application
Now you are ready for a test run. Hit F5 to test the app.