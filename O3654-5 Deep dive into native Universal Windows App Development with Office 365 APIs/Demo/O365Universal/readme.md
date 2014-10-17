# OneDrive Images Universal App #
The OneDrive Images app is a [Universal App targeting Windows and Windows Phone](http://msdn.microsoft.com/en-us/library/windows/apps/dn609832.aspx "Universal App targeting Windows and Windows Phone"). It uses the Office 365 Discovery Service to locate a user's OneDrive for Business site and retrieves and displays images in that repository. It binds the images to several different universal controls including a GridViews and FlipViews. Follow the steps below to setup the app with your credentials.

## Setup Steps ##
1. Open the **O365Universal** solution in Visual Studio
2. Right-click the **O365Universal.Windows** project and select **Add** > **Connected Service...**
3. In the **Service Manager** dialog, select **Office 365 APIs** in the side navigation and then use the **Sign in** link to log into Office 365 (use an account that has permissions to manage Azure AD for your Office 365 tenant as this process will generate an Application in Azure AD):
![Sign into Office 365 to register app](http://i.imgur.com/HwnAAFN.png)
4. Once you have signed in, assign the following permissions to the app:
	- **My Files**: Read users' files
	- **Users and Groups**: Enable sign-on and read users' profiles
![Assign app permissions](http://i.imgur.com/O2dxI6b.png)
6. Open the **MyFilesController.cs** file that is located in the **O365Universal.Shared** project
7. Update the **TENANT** constant in line 24 of **MyFilesController.cs** with your tenant domain (ex: *"contoso.onmicrosoft.com"*)
8. Next, we need to get the redirect URI for the Windows Phone app (the Windows app redirect URI was automatically generated during the registration process). To do this, place a break-point on line 35 of the **MyFilesController.cs** file.
9. Set the **O365Universal.WindowsPhone** project as the start-up project and start the debugger by pressing F5
10. When the break-point hits, copy the value of the **redirectURI** variable on line 34. This should be a long URI that starts with "**ms-app://**" (see example below):
![Debug to find the other redirect URI](http://i.imgur.com/71cvU7W.png)
11. Log into the [Azure Management Portal](https://manage.windowsazure.com/ "Azure Management Portal") and select **Active Directory** from the side navigation.
12. Click on the Directory for your Office 365 tenant in the directory listing and then select the **Applications** tab in the top navigation.
13. Locate and select the OneDrive Images app in the Application list (most likely **O365Universal.Windows.Office365app**)
14. Click on the **Configure** tab in the top navigation and copy the redirect URI from **Step 10** as an additional **Redirect Uri** (the automatically generated redirect URI for the Windows app should already be present):
![Register the second app redirect in Azure AD](http://i.imgur.com/L3DiWAE.png)
15. Click the Save button at the bottom.
16. Both apps should be ready to debug!