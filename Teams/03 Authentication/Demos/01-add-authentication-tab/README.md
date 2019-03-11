# Add Authentication to a Tab

In this demo, you will demonstrate the construction of a configurable tab that acquires an access token from Azure Active Directory and calls the Microsoft Graph API.

## Application Registration worksheet

This demo requires the registration of multiple applications in Azure Active Directory (Azure AD), the Bot Framework and the Azure Portal. The **LabFiles** folder of this module contains a file named **AppWorksheet.txt** which can be used to record the various ids and secrets generated and used in the demo.

## Prerequisites

Developing apps for Microsoft Teams requires preparation for both the Office 365 tenant and the development workstation.

For the Office 365 Tenant, the setup steps are detailed on the [Prepare your Office 365 Tenant page](https://docs.microsoft.com/en-us/microsoftteams/platform/get-started/get-started-tenant). Note that while the getting started page indicates that the Public Developer Preview is optional, this lab includes steps that are not possible unless the preview is enabled. Information about the Developer Preview program and participation instructions are detailed on the [What is the Developer Preview for Microsoft Teams? page](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-intro).

### Administrator credentials to tenant

This demo requires delegated permissions that are consented by a tenant administrator. If you are not an administrator in your tenant, you can request a developer tenant through the [Office 365 developer program](https://developer.microsoft.com/en-us/office/dev-program)

### Download ngrok

As Microsoft Teams is an entirely cloud-based product, it requires all services it accesses to be available from the cloud using HTTPS endpoints. To enable the exercises to work within Microsoft Teams, a tunneling application is required.

This lab uses [ngrok](https://ngrok.com) for tunneling publicly-available HTTPS endpoints to a web server running locally on the developer workstation. ngrok is a single-file download that is run from a console.

## Update Demo solution

Make the following updates to the demo solution.

1. Launch **Visual Studio 2017** as an administrator: right-click **Visual Studio 2017** and select **Run as administrator**.

1. In **Visual Studio 2017**, select **File > Open > Project/Solution**.

1. Select the **officedev-talent-management.sln** file from the **Demos\01-add-authentication-tab\solution** folder.

### Find the project URL

1. In **Solution Explorer**, double-click on **Properties**.

1. In the **Properties** designer, select the **Web** tab.

1. Note the **Project URL**.

    ![Screenshot of Solution Explorer highlighting project URL.](../../Images/Demo-01.png)

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the **ngrok.exe** application.

1. Run the command `ngrok http [port] -host-header=localhost:[port]`. Replace `[port]` with the port portion of the URL noted above.

1. The ngrok application will fill the entire prompt window.

    > **NOTE:** Record the **Forwarding address** using https on the AppWorksheet as the "ngrok forwarding address".

1. Minimize the ngrok command prompt window. It is no longer referenced in this lab, but it must remain running.

    ![Screenshot of ngrok command prompt with local host highlighted.](../../Images/Demo-02.png)

## Register application in the Azure Active Directory

1. Open the [Azure Active Directory admin center](https://aad.portal.azure.com).

1. Log in with the work or school account that is an administrator in the tenant.

1. Select **Azure Active Directory** in the left-most blade.

1. Select **App registrations (Preview)** in the left-hand menu.

1. Select **New registration**.

1. Enter a name for the application. A suggested name is `Talent Management application` which distinguishes this application from the bot. Select **Register**.

1. In the **Overview** blade, copy the **Application (client) ID**.

    > **NOTE:** Record the **Application (client) ID** on the AppWorksheet as the **AzureAppID**.

1. In the **Overview** blade, , copy the **Directory (tenant) ID**.

    > **NOTE:** Record the **Directory (tenant) ID** on the AppWorksheet as the **AzureTenantID**.

1. Select **Authentication** in the left-hand menu.

1. In the **Redirect URIs section, enter the following address for the **Redirect URI**. Replace the token `[from-ngrok]` with the value recorded on the AppWorksheet as **ngrok forwarding address id**. (The Sign-in URL is case-sensitive.)  Leave the **Type** as **Web**

    ```
    https://[from-ngrok].ngrok.io/Tabs/auth.html
    ```

1. In the **Implicit grant** section, select **Access tokens** and **ID tokens**.

1. Select **Save** from the toolbar at the top of the Authentication blade.

1. Select **API permissions** in the left-had menu.

1. In the **API permissions** blade, select **Add a permission**. Select **Microsoft Graph**. Select **Delegated permissions**.

1. The following permissions are required for the lab. Select any that are not included by default:

- openid (Sign users in)
- profile (View users' basic profile)
- Group > Group.Read.All (Read all groups)
- User > User.Read (Sign in and read user profile)
- User > User.Read.All (Read all users' full profiles)

Select **Add permissions**.

Select **Grand admin consent for [Directory]**. Select **Yes** in the confirmation banner.

    ![Screenshot of Azure Active Directory portal with the requested permissions displayed.](Images/Exercise1-01.png)

## Update the Visual Studio project

The Visual Studio project must be updated with information from the registration.

1. In **Visual Studio**, open file **auth-start.html** in the **Tabs** folder.
    - Replace the token `[AzureAppID]` with the value recorded on the AppWorksheet as **AzureAppID**.

1. In the **Manifest** folder , open the **manifest.json** file. The **manifest.json** file requires several updates:
    - The `packageName` property must contain a unique identifier. The industry standard is to use the bot's URL in reverse format. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - The `developer` property has three URLs that should match the hostname of the Messaging endpoint. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - The `configurableTabs` property also contains a URL. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - The `validDomains` property requires a string array of all domains that will be accessed by the Teams app. Replace the token `[from-ngrok]` with the value record on the AppWorksheet as **ngrok forwarding address id**.
    - Save and close the **manifest.json** file.

1. Press **F5** to compile, create the package and start the debugger.

### Upload app into Microsoft Teams

Although not strictly necessary, in this demo the app is added to a new team.

1. In the Microsoft Teams application, click the **Add team** link. Then click the **Create team** button.

    ![Screenshot of Microsoft Teams with Create Team button highlighted.](../../Images/Demo-07.png)

1. Enter a team name and description. Select **Next**.

1. Invite others from the organization to the team. The demo provides more impact with members in addition to the owner.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams with Manage Team highlighted.](../../Images/Starter-08.png)

1. On the Manage team display, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the zip file from the **bin** folder that represents your app. Select **Open**.

1. The app is loaded to the Team. The description and icon for the app is displayed.

    ![Screenshot of Microsoft Teams with new app displayed.](../../Images/Starter-09.png)

## Add tab to team view

Configurable tabs are displayed in a channel.

1. Tabs are not automatically displayed for the team. To add the tab, select **General** channel in the team.

1. Select the **+** icon at the end of the tab strip.

1. In the tab gallery, uploaded tabs are displayed in the **Tabs for your team** section. Tabs in this section are arranged alphabetically. Select the tab created in this lab.

    ![Screenshot of tab gallery with the talent management app highlighted.](../../Images/Exercise1-04.png)

1. Type a name for the tab. Select **Save**.

    ![Screenshot of the tab configuration page](Images/Exercise1-07.png)

1. The tab is displayed in the channel tab strip.

    ![Screenshot of the talent management tab](Images/Exercise1-06.png)

1. Select the **Login to Azure AD** button. When the tab is first viewed by a user, the Talent Management application does not have a token to use for calls to the Microsoft Graph. Microsoft Teams will display a popup window which may request login credentials. If a valid token is cached for the user, the popup window will close without user intervention.

    ![Screenshot of Microsoft Teams showing the login popup window.](../../Images/Exercise1-08.png)

1. The tab will display the members of the Azure Active Directory group that supports the Team. Changes to the Team members will be reflected the next time the tab is displayed.

    ![Screenshot of Microsoft Teams showing the configurable tab added in the lab](../../Images/Exercise1-05.png)